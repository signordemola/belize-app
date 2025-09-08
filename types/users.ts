import { AccountType } from "@prisma/client";

export type BasicUserData = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: Date;
  fullAddress: string;
  state: string;
  zipCode: string;
  country: string;
  encryptedPass: string;
  iv: string;
  tag: string;
  isActive: boolean;
  isTransferBlocked: boolean;
  createdAt: Date;
  account: {
    id: string;
    type: AccountType;
    balance: number;
    accountNumber: string;
    routingNumber: string;
    status: string;
    openedAt: Date;
    closedAt: Date | null;
    createdAt: Date;
  } | null;
};
