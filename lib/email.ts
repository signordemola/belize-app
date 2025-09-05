import nodemailer from "nodemailer";

const generateOtpEmailHtml = (otp: string) => {
  return `
    <div style="background-color: #f8f9fa; font-family: 'Segoe UI', Arial, sans-serif; padding: 40px 20px;">
      <div style="background-color: #ffffff; margin: 0 auto; max-width: 600px; border: 1px solid #e0e0e0;">
        <div style="background-color: #cc0000; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: normal;">Belize Bank Inc.</h1>
        </div>
        <div style="padding: 40px 30px;">
          <h2 style="color: #cc0000; margin: 0 0 20px; font-size: 20px;">Your Login OTP Setup</h2>
          <p style="color: #333333; line-height: 1.6; margin: 0 0 20px;">
            Your account has been successfully created. Below is your one-time password (OTP) for future logins. You can change this later in your account settings.
          </p>
          <div style="background-color: #f1f5f9; border: 2px solid #cc0000; border-radius: 4px; padding: 20px; text-align: center; margin: 30px 0;">
            <p style="color: #cc0000; margin: 0 0 10px; font-weight: bold; font-size: 14px;">Your Login OTP</p>
            <p style="color: #cc0000; margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 4px;">${otp}</p>
          </div>
          <p style="color: #666666; line-height: 1.6; margin: 0 0 20px; font-size: 14px;">
            Please keep this OTP secure. You can update it anytime from your account dashboard.
          </p>
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; padding: 15px; margin: 20px 0;">
            <p style="color: #856404; font-size: 13px; margin: 0; line-height: 1.5;">
              <strong>Important:</strong> If you did not create an account with Belize Bank Inc., please ignore or contact our security team immediately at security@belizebank.com or call 1-800-FRAUD-1.
            </p>
          </div>
          <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 30px;">
            <p style="color: #999999; font-size: 12px; margin: 0; line-height: 1.5;">
              <strong>Security Notice:</strong> Belize Bank Inc. will never ask you to share your login credentials, account numbers, or verification codes via email or phone.
            </p>
          </div>
        </div>
        <div style="background-color: #f8f9fa; padding: 20px 30px; border-top: 1px solid #e0e0e0;">
          <p style="color: #666666; font-size: 11px; margin: 0; line-height: 1.4;">
            © 2025 Belize Bank Inc. All rights reserved. This email was sent to provide your login credentials. 
            <br>For questions, contact us at support@belizebank.com or 1-800-SECURE-1
          </p>
        </div>
      </div>
    </div>
  `;
};

const createTransporter = async () => {
  const ports = [
    Number(process.env.ZOHO_PORT),
    Number(process.env.ZOHO_PORT_2),
  ];

  for (const port of ports) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.ZOHO_HOST,
        port: port,
        secure: port === 465,
        auth: {
          user: process.env.ZOHO_USER,
          pass: process.env.ZOHO_PASS,
        },
      });

      await transporter.verify();
      return transporter;
    } catch (error) {
      console.log(`Port ${port} failed, trying next...${error}`);
    }
  }

  throw new Error("All email ports failed");
};

export const sendOtpEmail = async (to: string, otp: string) => {
  const transporter = await createTransporter();
  const emailHtml = generateOtpEmailHtml(otp);

  await transporter.sendMail({
    from: `"Belize Bank Inc. Security" <${process.env.ZOHO_USER}>`,
    to,
    subject: "Your Login OTP - Belize Bank Inc.",
    html: emailHtml,
  });
};
