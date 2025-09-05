"use server";

import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/db";
import { sendOtpEmail } from "@/lib/email";
import { generateOtp } from "@/lib/otp";
import { hashPassword } from "@/lib/password";
import { SignUpSchema } from "@/schemas";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import z from "zod";

export const signUp = async (
  values: z.infer<typeof SignUpSchema>,
  file: File
) => {
  const { error, success, data } = SignUpSchema.safeParse(values);

  console.log("File size:", file?.size);

  if (!success) {
    return {
      error: "Validation failed!",
      issues: error.issues,
    };
  }

  const {
    firstName,
    lastName,
    email,
    userId,
    password,
    phoneNumber,
    dateOfBirth,
    address,
    city,
    state,
    zipCode,
    accountType,
  } = data;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { userId }],
      },
    });

    if (existingUser) {
      if (existingUser.userId === userId) {
        return { error: `User ID ${userId} is already taken!` };
      }
      if (existingUser.email === email) {
        return { error: `User with email ${email} already exists!` };
      }
    }

    const secure_url = await uploadImageToCloudinary(file);

    const hashedPassword = await hashPassword(password);
    const otp = generateOtp();
    const hashedOTP = await hashPassword(otp);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        userId,
        password: hashedPassword,
        phoneNumber,
        dateOfBirth: new Date(dateOfBirth),
        address,
        city,
        state,
        zipCode,
        country: "USA",
        imageUrl: secure_url,
        selectedAcctType: accountType,
        otpSecret: hashedOTP,
      },
    });

    try {
      await sendOtpEmail(email, otp);
    } catch (error) {
      await prisma.user.delete({ where: { id: user.id } });
      console.log(error);
      return { error: "Failed to send OTP email. Please try again." };
    }

    const redirectUrl = `/verify-otp?email=${encodeURIComponent(email)}`;

    return {
      success: `Account created successfully! We've sent your login OTP to ${email}. Please check your email before signing in.`,
      redirect: redirectUrl,
    };
  } catch (error) {
    console.error("Registration error:", error);

    // Handle Prisma errors
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { error: "A user with this email already exists." };
      }
    }

    // Handle other errors
    if (error instanceof Error) {
      console.log(error);
      return { error: "An unexpected error occurred. Please try again later!" };
    }

    return { error: "An unexpected error occurred. Please try again later!" };
  }
};
