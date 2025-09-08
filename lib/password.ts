import bcrypt from "bcryptjs";
import crypto from "crypto";
import { faker } from "@faker-js/faker";

const ALGORITHM = "aes-256-gcm";
const SECRET_KEY = crypto.scryptSync(process.env.JWT_SECRET!, "salt", 32);
const IV_LENGTH = 16;

export function generatePassword(): string {
  const upper = faker.string.alpha({ casing: "upper", length: 1 });
  const lower = faker.string.alpha({
    casing: "lower",
    length: faker.number.int({ min: 1, max: 4 }),
  });
  const number = faker.string.numeric(faker.number.int({ min: 1, max: 3 }));
  const special = faker.string.fromCharacters("!@#$%^&*()-_=+[]{};:,.<>?/|");

  let password = upper + lower + number + special;

  while (password.length < 6) {
    password += faker.string.alpha({ casing: "lower", length: 1 });
  }

  if (password.length > 10) {
    password = password.slice(0, 10);
  }

  return password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}

export function encryptPassword(password: string): {
  encrypted: string;
  iv: string;
  tag: string;
} {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);

  let encrypted = cipher.update(password, "utf8", "hex");
  encrypted += cipher.final("hex");

  const tag = cipher.getAuthTag().toString("hex");

  return {
    encrypted,
    iv: iv.toString("hex"),
    tag,
  };
}

export function decryptPassword(
  encrypted?: string | null,
  ivHex?: string | null,
  tagHex?: string | null
): string {
  if (!encrypted || !ivHex || !tagHex) {
    console.warn("decryptPassword called with missing values");
    return "N/A";
  }

  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
