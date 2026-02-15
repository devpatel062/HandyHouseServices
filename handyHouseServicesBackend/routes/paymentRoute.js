const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const Complaint = require("../models/complains");
const { sendConfirmationEmail } = require("./sendEmail");

router.post("/createCheckoutSession", async (req, res) => {
  try {
    const { formData } = req.body;
    console.log("Payment route hit with formData:", JSON.stringify(formData, null, 2));

    if (!formData) {
      throw new Error("No formData received. Check if request body contains { formData: ... }");
    }

    if (!formData.price) {
      throw new Error("Price is missing in formData");
    }

    const unitAmount = Math.round(Number(formData.price) * 100);
    if (isNaN(unitAmount)) {
        throw new Error(`Invalid price value: ${formData.price}`);
    }

    console.log(`Initiating Stripe Checkout for ${formData.email}, Amount: ${unitAmount} USD`);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: formData.email,
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
        email: formData.email.substring(0, 500) || "",
        problem: formData.problem.substring(0, 500) || "",
        date: formData.date.substring(0, 500) || "",
        serviceType: formData.serviceType.substring(0, 500) || "",
        serviceProvidername: formData.serviceProvidername ? formData.serviceProvidername.substring(0, 500) : "",
        serviceProvideremail: formData.serviceProvideremail ? formData.serviceProvideremail.substring(0, 500) : "",
        serviceProvidernumber: formData.serviceProvidernumber ? formData.serviceProvidernumber.substring(0, 500) : "",
        serviceProviderrating: String(formData.serviceProviderrating || ""),
        price: String(formData.price || "0"),
      },
      success_url: `${process.env.CLIENT_URL}/RepairServices?payment=success`,
      cancel_url: `${process.env.CLIENT_URL}/RepairServices?payment=cancel`,
    });

    console.log("✅ Session created:", session.id);
    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("❌ Stripe session error:", error);
    res.status(500).json({ error: error.message });
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
      const exists = await Complaint.findOne({ stripeSessionId: session.id });
      if (exists) {
        console.log("ℹ️ Booking already exists for session:", session.id);
        return res.status(200).send();
      }
    } catch (e) {
      console.error("❌ DB lookup failed:", e.message);
    }

    const formData = {
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

    try {
      await Complaint.create({
        ...formData,
        paymentStatus: "paid",
        stripeSessionId: session.id,
        stripePaymentIntent: session.payment_intent || null,
      });

      console.log("✅ Booking saved to DB via Webhook.");
      
      try {
        await sendConfirmationEmail(formData.email, formData);
        console.log("✅ Confirmation email sent.");
      } catch (emailError) {
        console.error("❌ Error sending email:", emailError);
      }
    } catch (err) {
      console.error("❌ Error saving booking in webhook:", err.message);
    }
  }

  res.status(200).send();
});

module.exports = router;
