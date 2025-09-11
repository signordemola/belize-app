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

const generateTransactionReceiptHtml = (
  transactionType: "DEPOSIT" | "WITHDRAWAL" | "TRANSFER",
  amount: number,
  reference: string,
  notes: string,
  balanceAfter: number,
  date: Date
) => {
  const formattedAmount = amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
  const formattedBalance = balanceAfter.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
      <h2 style="margin-bottom: 10px;">Transaction Receipt</h2>
      <p>This is a confirmation of your recent ${transactionType.toLowerCase()}.</p>
      <ul style="padding-left: 20px; line-height: 1.6;">
        <li><strong>Type:</strong> ${transactionType}</li>
        <li><strong>Amount:</strong> ${formattedAmount}</li>
        <li><strong>Reference:</strong> ${reference}</li>
        <li><strong>Date:</strong> ${date.toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        })}</li>
        <li><strong>Notes:</strong> ${notes}</li>
        <li><strong>Balance After:</strong> ${formattedBalance}</li>
      </ul>
      <p style="font-size: 12px; color: #666;">
        Thank you for banking with us.
      </p>
    </div>
  `;
};

const generateTransactionReceiptText = (
  transactionType: "DEPOSIT" | "WITHDRAWAL" | "TRANSFER",
  amount: number,
  reference: string,
  notes: string,
  balanceAfter: number,
  date: Date
) => {
  const formattedAmount = amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
  const formattedBalance = balanceAfter.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return `
Transaction Receipt - Belize Bank Inc.

Transaction Type: ${transactionType}
Amount: ${formattedAmount}
Reference: ${reference}
Date: ${date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  })}
Notes: ${notes}
Balance After: ${formattedBalance}

If you did not authorize this transaction, please contact Belize Bank Support immediately.

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
    subject: "New Login PIN - Belize Bank Inc.",
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

export const sendTransactionReceipt = async (
  to: string,
  transactionType: "DEPOSIT" | "WITHDRAWAL" | "TRANSFER",
  amount: number,
  reference: string,
  notes: string,
  balanceAfter: number,
  date: Date
) => {
  const transporter = await createTransporter();

  const emailHtml = generateTransactionReceiptHtml(
    transactionType,
    amount,
    reference,
    notes,
    balanceAfter,
    date
  );

  const emailText = generateTransactionReceiptText(
    transactionType,
    amount,
    reference,
    notes,
    balanceAfter,
    date
  );

  await transporter.sendMail({
    from: `"Belize Bank Inc. Transactions" <${process.env.ZOHO_USER}>`,
    to,
    subject: `Transaction Receipt - ${transactionType} ${amount.toLocaleString(
      "en-US",
      { style: "currency", currency: "USD" }
    )}`,
    html: emailHtml,
    text: emailText,
    replyTo: "support@belizebank.com",
  });
};
