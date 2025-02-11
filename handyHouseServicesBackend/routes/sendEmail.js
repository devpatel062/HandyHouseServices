const nodemailer = require("nodemailer");

const sendConfirmationEmail = (email, booking) => {
    console.log("Email User:", process.env.EMAIL_USER);
    console.log("Email Pass:", process.env.EMAIL_PASS ? "Exists" : "Not Set");

    const transporter = nodemailer.createTransport({
        // service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER, // Your email
            pass: process.env.EMAIL_PASS  // Your email password (use app password)
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Repair Service Booking Confirmation",
        text: `Hello ${booking.fullname},\n\nYour repair service booking is confirmed!\nDetails:\nProblem: ${booking.problem}\nDate: ${booking.date}\n\nThank you!`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log("Email Error:", error);
        else console.log("Email sent:", info.response);
    });
};

module.exports = sendConfirmationEmail
