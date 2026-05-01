import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify((error) => {
  if (error) console.error("Mail transporter error:", error);
  else console.log("Mail server ready");
});

export async function sendResetEmail(
  email: string,
  otp: string
): Promise<void> {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Your Password Reset OTP",
    html: `
      <p>You requested a password reset.</p>
      <p>Use the following OTP to reset your password:</p>
      <h2 style="letter-spacing: 4px; font-family: monospace;">${otp}</h2>
      <p>This code will expire in 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    `,
  });
}
