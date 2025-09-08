"use server";

import { uploadImageToCloudinary } from "@/lib/cloudinary";
import {
  generateUniqueAccountNumber,
  generateAccountData,
} from "@/lib/customer/create-account";
import { prisma } from "@/lib/db";
import { sendOtpEmail } from "@/lib/email";
import { generateOtp } from "@/lib/otp";
import {
  encryptPassword,
  generatePassword,
  hashPassword,
} from "@/lib/password";
import { SignUpSchema } from "@/schemas";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import z from "zod";

export const signUp = async (
  values: z.infer<typeof SignUpSchema>,
  file: File
) => {
  const { error, success, data } = SignUpSchema.safeParse(values);

  if (!success) {
    return {
      error: "Validation failed!",
      issues: error.issues,
    };
  }

  const {
    email,
    firstName,
    lastName,
    phoneNumber,
    ssn,
    dateOfBirth,
    fullAddress,
    state,
    zipCode,
    country,
    accountType,
  } = data;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return { error: `User with email ${email} already exists!` };
      }
      if (existingUser.phoneNumber === phoneNumber) {
        return {
          error: `User with phone number ${phoneNumber} already exist!`,
        };
      }
    }

    const [secure_url, accountNumber] = await Promise.all([
      uploadImageToCloudinary(file),
      generateUniqueAccountNumber(accountType),
    ]);

    const password = generatePassword();
    const hashedPassword = await hashPassword(password);
    const encryptedPassword = encryptPassword(password);
    const otp = generateOtp();
    const hashedOTP = await hashPassword(otp);
    const accountData = generateAccountData(accountType, accountNumber);

    const result = await prisma.$transaction(
      async (tx) => {
        const user = await tx.user.create({
          data: {
            firstName,
            lastName,
            email,
            hashedPass: hashedPassword,
            encryptedPass: encryptedPassword.encrypted,
            ssn,
            phoneNumber,
            dateOfBirth: new Date(dateOfBirth),
            fullAddress,
            zipCode,
            state,
            country,
            imageUrl: secure_url,
            selectedAcctType: accountType,
            otpSecret: hashedOTP,
            isActive: false,
            iv: encryptedPassword.iv,
            tag: encryptedPassword.tag,
            account: {
              create: accountData,
            },
          },
          include: {
            account: true,
          },
        });

        return { user };
      },
      { timeout: 10000 }
    );

    try {
      await sendOtpEmail(email, otp);
    } catch (emailError) {
      console.error("Email send error:", emailError);

      try {
        await prisma.user.delete({
          where: { id: result.user.id },
        });
      } catch (cleanupError) {
        console.error("Cleanup error:", cleanupError);
      }

      return {
        error: `Failed to send OTP to ${email}. Please try again later!`,
      };
    }

    const redirectUrl = `/verify-otp?email=${encodeURIComponent(email)}`;

    return {
      success: `Account created successfully! We've sent your login OTP to ${email}. Please check your email before signing in.`,
      redirect: redirectUrl,
    };
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { error: "A user with this email already exists." };
      }
    }

    if (error instanceof Error) {
      console.log(error);
      return { error: "An unexpected error occurred. Please try again later!" };
    }

    return { error: "An unexpected error occurred. Please try again later!" };
  }
};
