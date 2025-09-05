import { SignJWT, jwtVerify } from "jose";
import { UserRoleEnum } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET)
  throw new Error("JWT_SECRET is not defined in environment variables.");

const secretKey = new TextEncoder().encode(JWT_SECRET);

const SESSION_EXPIRATION = "7d";

export async function generateToken(
  userId: string,
  role: UserRoleEnum
): Promise<string> {
  return await new SignJWT({ userId, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_EXPIRATION)
    .sign(secretKey);
}

export async function decodeToken(token: string): Promise<{
  success: boolean;
  payload: { userId: string; role: UserRoleEnum } | null;
  error: string | null;
}> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return {
      success: true,
      payload: payload as { userId: string; role: UserRoleEnum },
      error: null,
    };
  } catch (error) {
    console.error("decodeToken: Failed to verify JWT:", error);
    return {
      success: false,
      payload: null,
      error: "Invalid or expired token",
    };
  }
}
