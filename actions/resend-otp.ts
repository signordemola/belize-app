"use server";

import { prisma } from "@/lib/db";
import { sendOtpEmail } from "@/lib/email";
import { generateOtp } from "@/lib/otp";
import { hashPassword } from "@/lib/password";

export const resendOTP = async (email: string) => {
  const otp = generateOtp();
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
