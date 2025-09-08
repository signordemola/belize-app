import nodemailer from "nodemailer";

const generateOtpEmailHtml = (otp: string) => {
  return `
    <div style="background-color: #f9fafb; font-family: 'Segoe UI', Arial, sans-serif; padding: 40px 20px;">
      <div style="background-color: #ffffff; margin: 0 auto; max-width: 600px; border: 1px solid #e0effe; border-radius: 6px; overflow: hidden;">
        <div style="background-color: #0066cc; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600;">
            Belize Bank Inc.
          </h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #0066cc; margin: 0 0 20px; font-size: 18px; font-weight: 600;">
            Login OTP Verification
          </h2>
          <p style="color: #333333; line-height: 1.6; margin: 0 0 20px; font-size: 14px;">
            Please use the following One-Time Password (OTP) to complete your login. Do not share this code with anyone.
          </p>
          <div style="background-color: #f0f7ff; border: 2px solid #0066cc; border-radius: 4px; padding: 20px; text-align: center; margin: 30px 0;">
            <p style="color: #0066cc; margin: 0 0 10px; font-weight: bold; font-size: 14px;">Your OTP</p>
            <p style="color: #0066cc; margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 4px;">${otp}</p>
          </div>
          <p style="color: #6b7280; line-height: 1.6; margin: 0 0 20px; font-size: 13px;">
            This OTP will expire shortly. If you did not request this, please contact our support team immediately.
          </p>
        </div>
        <div style="background-color: #f9fafb; padding: 15px 30px; border-top: 1px solid #e0e0e0;">
          <p style="color: #6b7280; font-size: 12px; margin: 0; line-height: 1.4;">
            © 2025 Belize Bank Inc. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;
};

const generateWelcomeEmailHtml = (
  accountType: string,
  accountNumber: string,
  password: string,
  otp: string
) => {
  return `
    <div style="background-color: #f9fafb; font-family: 'Segoe UI', Arial, sans-serif; padding: 40px 20px;">
      <div style="background-color: #ffffff; margin: 0 auto; max-width: 600px; border: 1px solid #e0effe; border-radius: 6px; overflow: hidden;">
        <div style="background-color: #0066cc; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600;">
            Belize Bank Inc.
          </h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #0066cc; margin: 0 0 20px; font-size: 18px; font-weight: 600;">
            Welcome to Belize Bank
          </h2>
          <p style="color: #333333; line-height: 1.6; margin: 0 0 20px; font-size: 14px;">
            Thank you for confirming your account. Below are your account details. Please keep this information safe and never share it with anyone.
          </p>
          <div style="background-color: #f0f7ff; border: 1px solid #0066cc; border-radius: 4px; padding: 20px; margin: 20px 0;">
            <p style="color: #333333; margin: 0 0 10px; font-size: 14px;">
              <strong>${accountType} Account</strong> (${accountNumber})
            </p>
            <p style="color: #333333; margin: 0 0 10px; font-size: 14px;">
              <strong>Password:</strong> ${password}
            </p>
            <p style="color: #333333; margin: 0; font-size: 14px;">
              <strong>PIN:</strong> ${otp}
            </p>
          </div>
          <p style="color: #333333; font-size: 14px; margin: 20px 0 40px;">
            Regards, <br>
            Account Officer
          </p>
        </div>
        <div style="background-color: #f9fafb; padding: 15px 30px; border-top: 1px solid #e0e0e0;">
          <p style="color: #6b7280; font-size: 12px; margin: 0; line-height: 1.4;">
            © 2025 Belize Bank Inc. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;
};

const generateWelcomeEmailText = (
  accountType: string,
  accountNumber: string,
  password: string,
  otp: string
) => {
  return `
Your Account Details - Belize Bank Inc.

Thank you for confirming your account. Please do not share your password or PIN with a third party in any case.

${accountType} Account (${accountNumber})
Password: ${password}
PIN: ${otp}

Regards,
Account Officer

© 2025 Belize Bank Inc. All rights reserved.
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

export const sendWelcomeEmail = async (
  to: string,
  accountType: string,
  accountNumber: string,
  password: string,
  otp: string
) => {
  const transporter = await createTransporter();
  const emailHtml = generateWelcomeEmailHtml(
    accountType,
    accountNumber,
    password,
    otp
  );
  const emailText = generateWelcomeEmailText(
    accountType,
    accountNumber,
    password,
    otp
  );

  await transporter.sendMail({
    from: `"Belize Bank Inc." <${process.env.ZOHO_USER}>`,
    to,
    subject: "Welcome to Belize Bank Inc. - Your Account is Ready",
    html: emailHtml,
    text: emailText,
  });
};
