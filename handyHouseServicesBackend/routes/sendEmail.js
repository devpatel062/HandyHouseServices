const { createTransport } = require("nodemailer");

const sendConfirmationEmail = (email, booking) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error("Email user or password not set in environment variables");
    }

    console.log("Email User:", process.env.EMAIL_USER);
    console.log("Email Pass:", process.env.EMAIL_PASS ? "Exists" : "Not Set");

    const transporter = createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER, // Your email
            pass: process.env.EMAIL_PASS  // Your email password (use app password)
        }
    });

    transporter.verify((err) => {
        if (err) {
            console.error("SMTP Verification Failed:", err);
            return;
        }
        console.log("SMTP Server Ready ");
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Repair Service Booking Confirmation",
        text: `Hello ${booking.fullname},

Your repair service booking is confirmed!

Booking Details:
------------------------------------------------------
Customer Name:      ${booking.fullname}
Contact Number:     ${booking.contact || "Not Provided"}
Email:              ${booking.email}
Service Address:    ${booking.address}
Issue Reported:     ${booking.problem}
Date:               ${booking.date}
Service Provider:   ${booking.serviceProvidername || "Not Assigned"}
Price:              $${booking.price || "To be discussed"}
------------------------------------------------------

Thank you for choosing Handy House Services!`,
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Email Error:", error);
                reject(error);
            } else {
                console.log("Email sent:", info.response);
                resolve(info);
            }
        });
    });
};

const sendCancellationEmail = (email, booking) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error("Email user or password not set in environment variables");
    }

    const transporter = createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Repair Service Booking Cancellation",
        text: `Hello ${booking.fullname},

        Your repair service booking has been cancelled.

        Cancelled Booking Details:
        ------------------------------------------------------
        Customer Name:      ${booking.fullname}
        Service Address:    ${booking.address}
        Date:               ${booking.date}
        Issue Reported:     ${booking.problem}
        ------------------------------------------------------

        Thank you for choosing Handy House Services!`,
            };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Email Error:", error);
                reject(error);
            } else {
                console.log("Email sent:", info.response);
                resolve(info);
            }
        });
    });
};

module.exports = { sendConfirmationEmail, sendCancellationEmail };
