"use server";

import { decryptPassword } from "@/lib/password";

export async function decryptUserPassword(
  encryptedPass: string,
  iv: string,
  tag: string
) {
  try {
    return decryptPassword(encryptedPass, iv, tag);
  } catch {
    return "Error decrypting";
  }
}
