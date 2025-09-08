import { UserRoleEnum } from "@prisma/client";
import { z } from "zod";

export const AccountTypeEnum = z.enum([
  "CHECKING",
  "SAVINGS",
  "FIXED_DEPOSIT",
  "PRESTIGE",
  "BUSINESS",
  "INVESTMENT",
]);

const eighteenYearsAgo = new Date(
  new Date().setFullYear(new Date().getFullYear() - 18)
);

export const SignUpSchema = z.object({
  email: z.email({ message: "Please enter a valid email address." }),
  firstName: z
    .string()
    .min(2, { message: "First name is required." })
    .max(100, { message: "First name cannot exceed 100 characters." }),
  lastName: z
    .string()
    .min(2, { message: "Last name is required." })
    .max(100, { message: "Last name cannot exceed 100 characters." }),
  phoneNumber: z
    .string()
    .regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, {
      message: "Please enter a valid phone number (e.g., 555-123-4567).",
    }),
  ssn: z.string().regex(/^\d{3}-\d{2}-\d{4}$/, {
    message: "Please enter a valid SSN (e.g., 123-45-6789).",
  }),
  dateOfBirth: z
    .string()
    .min(1, { message: "Date of birth is required." })
    .refine(
      (dob) => {
        const selectedDate = new Date(dob);
        return selectedDate <= eighteenYearsAgo;
      },
      {
        message: "You must be at least 18 years old to create an account.",
      }
    ),
  fullAddress: z
    .string()
    .min(1, { message: "Street and city are required." })
    .max(255, { message: "Street and city cannot exceed 255 characters." }),
  state: z
    .string()
    .min(1, { message: "State is required." })
    .max(100, { message: "State cannot exceed 100 characters." }),
  zipCode: z.string().regex(/^\d{5}(?:[-\s]\d{4})?$/, {
    message: "Please enter a valid Zip Code (e.g., 12345 or 12345-6789).",
  }),
  country: z
    .string()
    .min(2, { message: "Country is required." })
    .max(100, { message: "Country cannot exceed 100 characters." }),
  accountType: AccountTypeEnum,
});

export const SignInSchema = z.object({
  accountNumber: z.string().regex(/^\d{10}$/, {
    message: "Account number must be exactly 10 digits, no spaces or dashes",
  }),
  password: z.string().min(1, { message: "Password is required." }),
  rememberMe: z.boolean().optional(),
});

export const VerifyOTPSchema = z.object({
  otp: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export const SessionSchema = z.object({
  userId: z.string(),
  role: z.enum(
    Object.values(UserRoleEnum) as [UserRoleEnum, ...UserRoleEnum[]]
  ),
});

export const ChangePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required" }),
    newPassword: z
      .string()
      .min(8, { message: "New password must be at least 8 characters long." })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;<>,.?~\\-]).{8,}$/,
        {
          message:
            "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
        }
      ),
    confirmNewPassword: z
      .string()
      .min(1, { message: "Confirm new password is required" }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match.",
    path: ["confirmNewPassword"],
  });

export const SetPinSchema = z
  .object({
    newPin: z
      .string()
      .length(4, { message: "PIN must be exactly 4 digits." })
      .regex(/^\d{4}$/, { message: "PIN must contain only digits." }),
    confirmNewPin: z
      .string()
      .length(4, { message: "Confirm PIN must be exactly 4 digits." })
      .regex(/^\d{4}$/, { message: "Confirm PIN must contain only digits." }),
  })
  .refine((data) => data.newPin === data.confirmNewPin, {
    message: "New PINs do not match.",
    path: ["confirmNewPin"],
  });

export const ChangePinSchema = z
  .object({
    currentPin: z
      .string()
      .length(4, { message: "Current PIN must be exactly 4 digits." })
      .regex(/^\d{4}$/, { message: "Current PIN must contain only digits." }),
    newPin: z
      .string()
      .length(4, { message: "New PIN must be exactly 4 digits." })
      .regex(/^\d{4}$/, { message: "New PIN must contain only digits." }),
    confirmNewPin: z
      .string()
      .length(4, { message: "Confirm new PIN must be exactly 4 digits." })
      .regex(/^\d{4}$/, {
        message: "Confirm new PIN must contain only digits.",
      }),
  })
  .refine((data) => data.newPin === data.confirmNewPin, {
    message: "New PINs do not match.",
    path: ["confirmNewPin"],
  });

export const AddBeneficiarySchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Beneficiary name is required." })
      .max(100, { message: "Beneficiary name cannot exceed 100 characters." }),
    type: z.enum(["BANK_ACCOUNT", "UTILITY"], {
      message: "Beneficiary type must be either 'BANK_ACCOUNT' or 'UTILITY'.",
    }),
    accountNumber: z
      .string()
      .optional()
      .refine(
        (val) => val === undefined || val === "" || /^\d{10}$/.test(val),
        { message: "Account number must be 10 digits if provided." }
      ),
    utilityId: z
      .string()
      .optional()
      .refine(
        (val) =>
          val === undefined || val === "" || /^[A-Za-z0-9-]{5,20}$/.test(val),
        {
          message:
            "Utility ID must be 5-20 alphanumeric characters or hyphens if provided.",
        }
      ),
  })
  .refine(
    (data) =>
      data.type === "BANK_ACCOUNT" ? !!data.accountNumber : !!data.utilityId,
    {
      message:
        "Account number is required for bank accounts, or utility ID for utilities.",
      path: ["accountNumber"],
    }
  );

export const EditBeneficiarySchema = z
  .object({
    id: z.string().uuid({ message: "Invalid beneficiary ID." }),
    name: z
      .string()
      .min(1, { message: "Beneficiary name is required." })
      .max(100, { message: "Beneficiary name cannot exceed 100 characters." }),
    type: z.enum(["BANK_ACCOUNT", "UTILITY"], {
      message: "Beneficiary type must be either 'BANK_ACCOUNT' or 'UTILITY'.",
    }),
    accountNumber: z
      .string()
      .optional()
      .refine(
        (val) => val === undefined || val === "" || /^\d{10}$/.test(val),
        { message: "Account number must be 10 digits if provided." }
      ),
    utilityId: z
      .string()
      .optional()
      .refine(
        (val) =>
          val === undefined || val === "" || /^[A-Za-z0-9-]{5,20}$/.test(val),
        {
          message:
            "Utility ID must be 5-20 alphanumeric characters or hyphens if provided.",
        }
      ),
  })
  .refine(
    (data) =>
      data.type === "BANK_ACCOUNT" ? !!data.accountNumber : !!data.utilityId,
    {
      message:
        "Account number is required for bank accounts, or utility ID for utilities.",
      path: ["accountNumber"],
    }
  );

export const UpdateUsernameSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username is required." })
    .max(50, { message: "Username cannot exceed 50 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    }),
});

export const AddBalanceSchema = z.object({
  amount: z
    .string()
    .min(1, { message: "Amount is required." })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a valid number greater than 0.",
    }),
  fromAccount: z
    .string()
    .min(1, { message: "From Account is required." })
    .max(100, { message: "From Account cannot exceed 100 characters." }),
  notes: z.string().max(255).optional(),
});
