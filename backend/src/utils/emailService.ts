import nodemailer from "nodemailer";

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other services like 'Outlook', 'Yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "your-app-password", // Use app password for Gmail
  },
});

// Function to generate a random 4-digit OTP
export const generateOTP = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Function to send OTP email
export const sendOTPEmail = async (
  email: string,
  otp: string,
  firstName: string
): Promise<boolean> => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || "your-email@gmail.com",
      to: email,
      subject: "HomeSync - Account Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #3498db;">HomeSync</h1>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9; border-radius: 4px;">
            <p>Hello ${firstName},</p>
            <p>Welcome to HomeSync! To complete your registration, please use the verification code below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="display: inline-block; padding: 15px 30px; background-color: #3498db; color: white; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 4px;">
                ${otp}
              </div>
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
          <div style="margin-top: 20px; text-align: center; color: #7f8c8d; font-size: 12px;">
            <p>© ${new Date().getFullYear()} HomeSync. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
