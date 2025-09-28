import nodemailer from "nodemailer";

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

const generateOtpEmailHtml = (otp: string) => {
  return `
    <div style="background-color: #f9fafb; font-family: 'Segoe UI', Arial, sans-serif; padding: 40px 20px;">
      <div style="background-color: #ffffff; margin: 0 auto; max-width: 600px; border: 1px solid #e0effe; border-radius: 6px; overflow: hidden;">
        <div style="background-color: #0066cc; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600;">
            Belize Valley Inc.
          </h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #0066cc; margin: 0 0 20px; font-size: 18px; font-weight: 600;">
            Login PIN Verification
          </h2>
          <p style="color: #333333; line-height: 1.6; margin: 0 0 20px; font-size: 14px;">
            Please use the following PIN to complete your login. Do not share this code with anyone.
          </p>
          <div style="background-color: #f0f7ff; border: 2px solid #0066cc; border-radius: 4px; padding: 20px; text-align: center; margin: 30px 0;">
            <p style="color: #0066cc; margin: 0 0 10px; font-weight: bold; font-size: 14px;">Your PIN</p>
            <p style="color: #0066cc; margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 4px;">${otp}</p>
          </div>
        </div>
        <div style="background-color: #f9fafb; padding: 15px 30px; border-top: 1px solid #e0e0e0;">
          <p style="color: #6b7280; font-size: 12px; margin: 0; line-height: 1.4;">
            © 2025 Belize Valley Inc. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;
};

export const sendOtpEmail = async (to: string, otp: string) => {
  const transporter = await createTransporter();
  const emailHtml = generateOtpEmailHtml(otp);

  await transporter.sendMail({
    from: `"Belize Valley Inc. Security" <${process.env.ZOHO_USER}>`,
    to,
    subject: "New Login PIN - Belize Valley Inc.",
    html: emailHtml,
  });
};

// Welcome Email Template & Sender
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
            Belize Valley Inc.
          </h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #0066cc; margin: 0 0 20px; font-size: 18px; font-weight: 600;">
            Welcome to Belize Valley
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
            © 2025 Belize Valley Inc. All rights reserved.
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
Your Account Details - Belize Valley Inc.

Thank you for confirming your account. Please do not share your password or PIN with a third party in any case.

${accountType} Account (${accountNumber})
Password: ${password}
PIN: ${otp}

Regards,
Account Officer

© 2025 Belize Valley Inc. All rights reserved.
  `;
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
    from: `"Belize Valley Inc." <${process.env.ZOHO_USER}>`,
    to,
    subject: "Welcome to Belize Valley Inc. - Your Account is Ready",
    html: emailHtml,
    text: emailText,
  });
};
// Transaction Email Receipt Template & Sender
const generateTransactionReceiptHtml = (
  fullName?: string,
  date?: Date,
  amount?: number,
  transactionType?: string
): string => {
  const formattedAmount =
    amount !== undefined
      ? amount.toLocaleString("en-US", { style: "currency", currency: "USD" })
      : "N/A";

  const formattedDate = date
    ? date.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
    : "N/A";

  return `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
      <h2 style="margin-bottom: 10px;">Transaction Confirmation</h2>
      <p>Hello ${fullName || "Valued Customer"},</p>
      <p>This is a confirmation of your recent ${
        transactionType?.toLowerCase() || "transaction"
      }.</p>
      <ul style="padding-left: 20px; line-height: 1.6;">
        ${
          transactionType
            ? `<li><strong>Type:</strong> ${transactionType}</li>`
            : ""
        }
        ${
          amount !== undefined
            ? `<li><strong>Amount:</strong> ${formattedAmount}</li>`
            : ""
        }
        ${date ? `<li><strong>Date:</strong> ${formattedDate}</li>` : ""}
      </ul>
      <p style="font-size: 12px; color: #666;">
        Thank you for banking with us. Contact support at (800) 555-1234 or support@belizevalley.com.
        <br>&copy; 2025 Belize Valley Inc. All rights reserved.
        <br><a href="https://belizevalley.com/unsubscribe">Unsubscribe</a>
      </p>
    </div>
  `;
};

const generateTransactionReceiptText = (
  fullName?: string,
  date?: Date,
  amount?: number,
  transactionType?: string
): string => {
  const formattedAmount =
    amount !== undefined
      ? amount.toLocaleString("en-US", { style: "currency", currency: "USD" })
      : "N/A";

  const formattedDate = date
    ? date.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
    : "N/A";

  return `
Transaction Confirmation - Belize Valley Inc.

Hello ${fullName},

${transactionType ? `Transaction Type: ${transactionType}` : ""}
${amount !== undefined ? `Amount: ${formattedAmount}` : ""}
${date ? `Date: ${formattedDate}` : ""}

If you have any questions, contact Belize Valley Support at (800) 555-1234 or support@belizevalley.com.

© 2025 Belize Valley Inc. All rights reserved.
Unsubscribe: https://belizevalley.com/unsubscribe
  `.trim();
};

export const sendTransactionReceipt = async (
  to: string,
  fullName: string,
  date: Date,
  amount: number,
  transactionType: string
) => {
  const transporter = await createTransporter();

  if (!to) {
    throw new Error("Recipient email address is required");
  }

  const emailHtml = generateTransactionReceiptHtml(
    fullName,
    date,
    amount,
    transactionType
  );

  const emailText = generateTransactionReceiptText(
    fullName,
    date,
    amount,
    transactionType
  );

  await transporter.sendMail({
    from: `"Belize Valley New Transaction" <${process.env.ZOHO_USER}>`,
    to,
    subject: `Transaction Confirmation`,
    html: emailHtml,
    text: emailText,
  });
};
