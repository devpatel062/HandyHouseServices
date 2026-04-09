const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const Complaint = require("../models/complains");
const User = require("../models/signupUser");
const authenticateUser = require("./authenticateroute");
const { sendConfirmationEmail } = require("./sendEmail");

const buildBookingFromSession = (session) => {
  if (!session?.metadata) {
    throw new Error("Missing Stripe session metadata");
  }

  return {
    fullname: session.metadata.fullname,
    address: session.metadata.address,
    contact: session.metadata.contact,
    email: session.metadata.email,
    problem: session.metadata.problem,
    date: session.metadata.date,
    serviceType: session.metadata.serviceType,
    serviceProvidername: session.metadata.serviceProvidername,
    serviceProvideremail: session.metadata.serviceProvideremail,
    serviceProvidernumber: session.metadata.serviceProvidernumber,
    serviceProviderrating: session.metadata.serviceProviderrating,
    price: parseFloat(session.metadata.price),
  };
};

const saveBookingFromSession = async (session) => {
  const formData = buildBookingFromSession(session);

  // Final double-booking check before saving
  const existingBooking = await Complaint.findOne({
    serviceProvideremail: formData.serviceProvideremail,
    date: formData.date,
    paymentStatus: "paid",
    stripeSessionId: { $ne: session.id } // exclude current session
  });

  if (existingBooking) {
    console.error("❌ Confirmed: Attempted double-booking for session", session.id);
    return { created: false, error: "Slot already booked" };
  }

  const bookingPayload = {
    ...formData,
    paymentStatus: "paid",
    stripeSessionId: session.id,
    stripePaymentIntent: session.payment_intent || null,
  };

  const upsertResult = await Complaint.updateOne(
    { stripeSessionId: session.id },
    { $setOnInsert: bookingPayload },
    { upsert: true }
  );

  const booking = await Complaint.findOne({ stripeSessionId: session.id });
  const created = upsertResult.upsertedCount > 0;

  if (!created) {
    return { created: false, booking };
  }

  try {
    await sendConfirmationEmail(formData.email, formData);
    console.log("✅ Confirmation email sent.");
  } catch (emailError) {
    console.error("❌ Error sending email:", emailError);
  }

  return { created: true, booking };
};

router.post("/createCheckoutSession", authenticateUser, async (req, res) => {
  try {
    const { formData } = req.body;
    console.log("Payment route hit with formData:", JSON.stringify(formData, null, 2));

    if (!formData) {
      throw new Error("No formData received. Check if request body contains { formData: ... }");
    }

    if (!formData.price) {
      throw new Error("Price is missing in formData");
    }

    const signedInUser = await User.findById(req.user.id).select("email");
    if (!signedInUser?.email) {
      return res.status(401).json({ error: "Unauthorized user" });
    }

    const canonicalEmail = signedInUser.email.trim();

    // Check for existing bookings for the same provider at the same date
    const existingBooking = await Complaint.findOne({
      serviceProvideremail: formData.serviceProvideremail,
      date: formData.date,
      paymentStatus: "paid"
    });

    if (existingBooking) {
      return res.status(409).json({ 
        error: "This time slot is already booked for this provider. Please choose another time or provider." 
      });
    }

    const unitAmount = Math.round(Number(formData.price) * 100);
    if (isNaN(unitAmount)) {
        throw new Error(`Invalid price value: ${formData.price}`);
    }

    console.log(`Initiating Stripe Checkout for ${formData.email}, Amount: ${unitAmount} USD`);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: canonicalEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: formData.serviceType || "Repair Service",
              description: `Booking for ${formData.serviceType} on ${formData.date}`,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        fullname: formData.fullname.substring(0, 500) || "",
        address: formData.address.substring(0, 500) || "",
        contact: formData.contact.substring(0, 500) || "",
        email: canonicalEmail.substring(0, 500) || "",
        problem: formData.problem.substring(0, 500) || "",
        date: formData.date.substring(0, 500) || "",
        serviceType: formData.serviceType.substring(0, 500) || "",
        serviceProvidername: formData.serviceProvidername ? formData.serviceProvidername.substring(0, 500) : "",
        serviceProvideremail: formData.serviceProvideremail ? formData.serviceProvideremail.substring(0, 500) : "",
        serviceProvidernumber: formData.serviceProvidernumber ? formData.serviceProvidernumber.substring(0, 500) : "",
        serviceProviderrating: String(formData.serviceProviderrating || ""),
        price: String(formData.price || "0"),
        userId: String(req.user.id || ""),
      },
      success_url: `${process.env.CLIENT_URL}/RepairServices?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/RepairServices?payment=cancel`,
    });

    console.log("✅ Session created:", session.id);
    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("❌ Stripe session error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/confirm-booking", authenticateUser, async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Checkout session not found" });
    }

    if (session.payment_status !== "paid") {
      return res.status(400).json({ error: "Payment not completed" });
    }

    const signedInUser = await User.findById(req.user.id).select("email");
    if (!signedInUser?.email) {
      return res.status(401).json({ error: "Unauthorized user" });
    }

    const signedInEmail = signedInUser.email.trim().toLowerCase();
    const sessionEmail = String(session.metadata?.email || "").trim().toLowerCase();

    if (signedInEmail && sessionEmail && signedInEmail !== sessionEmail) {
      return res.status(403).json({ error: "Session does not belong to signed-in user" });
    }

    const result = await saveBookingFromSession(session);
    return res.status(200).json({ success: true, created: result.created });
  } catch (error) {
    console.error("❌ Confirm booking error:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

router.post("/webhook", async (req, res) => {
  console.log("🔥 Webhook endpoint HIT");

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook Signature Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("✅ Webhook verified. Event:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("✅ Payment Successful. Session:", session.id);
    try {
      const result = await saveBookingFromSession(session);
      if (result.created) {
        console.log("✅ Booking saved to DB via Webhook.");
      } else {
        console.log("ℹ️ Booking already exists for session:", session.id);
      }
    } catch (err) {
      console.error("❌ Error saving booking in webhook:", err.message);
    }
  }

  res.status(200).send();
});

module.exports = router;
