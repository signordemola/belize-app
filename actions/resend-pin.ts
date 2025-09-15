"use server";

import { prisma } from "@/lib/db";
import { sendOtpEmail } from "@/lib/email";
import { hashPassword } from "@/lib/password";
import { generatePin } from "@/lib/pin";

export const resendPin = async (email: string) => {
  const otp = generatePin();
  const hashedOTP = await hashPassword(otp);

  try {
    await prisma.user.update({
      where: { email },
      data: { otpSecret: hashedOTP },
    });

    await sendOtpEmail(email, otp);
  } catch (error) {
    console.log(error);
    return { error: "Failed to send PIN to email. Please try again later!" };
  }

  return { success: "PIN resent successfully!" };
};
