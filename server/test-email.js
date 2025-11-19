import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

console.log("📧 Testing Email Configuration...\n");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log(
  "EMAIL_PASS:",
  process.env.EMAIL_PASS ? "✅ Set (hidden)" : "❌ Not set"
);
console.log(
  "EMAIL_PASS length:",
  process.env.EMAIL_PASS?.length,
  "characters\n"
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Test connection
console.log("🔄 Testing SMTP connection...\n");
transporter.verify(function (error, success) {
  if (error) {
    console.log("❌ SMTP Connection Failed:");
    console.log("Error:", error.message);
    console.log("\n🔧 Possible solutions:");
    console.log("1. Check EMAIL_USER is correct Gmail address");
    console.log("2. Check EMAIL_PASS is 16-character App Password (no spaces)");
    console.log("3. Enable 2-Step Verification on Gmail");
    console.log(
      "4. Generate new App Password at: https://myaccount.google.com/apppasswords"
    );
  } else {
    console.log("✅ SMTP Connection Successful!");
    console.log("Server is ready to send emails\n");

    // Send test email
    console.log("📤 Sending test email...\n");
    transporter
      .sendMail({
        from: `"Paradise Perfume Test" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER, // Send to yourself
        subject: "✅ Test Email - Paradise Perfume",
        html: `
          <div style="font-family: Arial; padding: 20px; background: #f4f4f4;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
              <h1 style="color: #000;">🎉 Email Test Successful!</h1>
              <p>Your email configuration is working correctly.</p>
              <p><strong>Time:</strong> ${new Date().toLocaleString(
                "vi-VN"
              )}</p>
              <p style="color: #666; margin-top: 30px;">Paradise Perfume - Email System Test</p>
            </div>
          </div>
        `,
      })
      .then((info) => {
        console.log("✅ Test email sent successfully!");
        console.log("Message ID:", info.messageId);
        console.log("\n📬 Check your inbox:", process.env.EMAIL_USER);
        process.exit(0);
      })
      .catch((err) => {
        console.log("❌ Failed to send test email:");
        console.log("Error:", err.message);
        process.exit(1);
      });
  }
});
