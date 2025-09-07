import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFormattedDateTime() {
  const now = new Date();

  const date = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const time = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return { date, time };
}

export const formatAccountNumber = (accountNumber: string): string => {
  if (!accountNumber) return "";
  const cleanedNumber = accountNumber.replace(/\D/g, "");

  if (cleanedNumber.length === 10) {
    return `${cleanedNumber.slice(0, 3)} ${cleanedNumber.slice(
      3,
      6
    )} ${cleanedNumber.slice(6)}`;
  }

  return cleanedNumber.replace(/(\d{3})(?=\d)/g, "$1 ");
};
