import { createTransport } from "nodemailer";

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
        text: `Hello ${booking.fullname},\n\nYour repair service booking is confirmed!\nDetails:\nProblem: ${booking.problem}\nDate: ${booking.date}\n\nThank you!`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log("Email Error:", error);
        else console.log("Email sent:", info.response);
    });
};

export default sendConfirmationEmail
