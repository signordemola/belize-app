import crypto from "crypto";

export const generatePin = (): string => {
  const num = crypto.randomInt(0, 1_000_000);
  return num.toString().padStart(6, "0");
};
