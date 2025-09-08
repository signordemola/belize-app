"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicUserData } from "@/types/users";
import { DetailItem } from "../detail-item";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { decryptUserPassword } from "@/actions/decrypt-password";

export function UserDetailDialog({
  user,
  open,
  onOpenChange,
}: {
  user: BasicUserData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [password, setPassword] = useState("********");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleTogglePassword() {
    if (!visible) {
      setLoading(true);
      const decrypted = await decryptUserPassword(
        user.encryptedPass,
        user.iv,
        user.tag
      );
      setPassword(decrypted);
      setLoading(false);
    } else {
      setPassword("********");
    }
    setVisible(!visible);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary-600">
            {user.firstName} {user.lastName} Details
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Details</TabsTrigger>
            <TabsTrigger value="account">Account Details</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <div className="grid gap-4 py-4 grid-cols-2">
              <DetailItem
                label="Full Name"
                value={`${user.firstName} ${user.lastName}`}
              />
              <DetailItem label="Email" value={user.email} />
              <DetailItem label="Phone" value={user.phoneNumber} />
              <DetailItem
                label="Password"
                value={
                  <div className="flex items-center gap-2">
                    <span>{loading ? "decrypting..." : password}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleTogglePassword}
                    >
                      {visible ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                }
              />
              <DetailItem label="SSN" value={user.ssn} />
              <DetailItem label="Address" value={user.fullAddress} />
              <DetailItem label="Zip Code" value={user.zipCode} />
              <DetailItem label="State" value={user.state} />
              <DetailItem label="Country" value={user.country} />
              <DetailItem
                label="Date of Birth"
                value={user.dateOfBirth.toLocaleDateString()}
              />
              <DetailItem
                label="Account Status"
                value={
                  <Badge variant={user.isActive ? "default" : "destructive"}>
                    {user.isActive ? "Active" : "Deactivated"}
                  </Badge>
                }
              />
              <DetailItem
                label="Transfer"
                value={
                  <Badge
                    variant={user.isTransferBlocked ? "destructive" : "default"}
                  >
                    {user.isTransferBlocked ? "Blocked" : "Allowed"}
                  </Badge>
                }
              />
            </div>
          </TabsContent>

          <TabsContent value="account">
            <div className="grid gap-4 py-4 grid-cols-2">
              {user.account ? (
                <>
                  <DetailItem
                    label="Account Number"
                    value={user.account.accountNumber}
                  />
                  <DetailItem
                    label="Routing Number"
                    value={user.account.routingNumber}
                  />
                  <DetailItem
                    label="Balance"
                    value={`$${user.account.balance.toFixed(2)}`}
                  />
                  <DetailItem label="Type" value={user.account.type} />
                  <DetailItem label="Status" value={user.account.status} />
                  <DetailItem
                    label="Opened At"
                    value={new Date(user.account.openedAt).toLocaleDateString()}
                  />
                  {user.account.closedAt && (
                    <DetailItem
                      label="Closed At"
                      value={new Date(
                        user.account.closedAt
                      ).toLocaleDateString()}
                    />
                  )}
                </>
              ) : (
                <DetailItem label="Account" value="No account linked" />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
