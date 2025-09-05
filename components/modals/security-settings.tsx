"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SetPinSchema, ChangePinSchema, ChangePasswordSchema } from "@/schemas";
import { setPin, changePin, changePassword } from "@/actions/security";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SecuritySettingsModalProps {
  isOpen: boolean;
  hasPin: boolean;
  onOpenChange: (open: boolean) => void;
}

const SecuritySettingsModal: React.FC<SecuritySettingsModalProps> = ({
  isOpen,
  hasPin,
  onOpenChange,
}) => {
  const [isPinPending, startPinTransition] = useTransition();
  const [isPasswordPending, startPasswordTransition] = useTransition();

  const pinForm = useForm<
    z.infer<typeof ChangePinSchema> | z.infer<typeof SetPinSchema>
  >({
    resolver: zodResolver(hasPin ? ChangePinSchema : SetPinSchema),
    defaultValues: hasPin
      ? { currentPin: "", newPin: "", confirmNewPin: "" }
      : { newPin: "", confirmNewPin: "" },
  });

  const passwordForm = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onPinSubmit = (
    values: z.infer<typeof ChangePinSchema> | z.infer<typeof SetPinSchema>
  ) => {
    startPinTransition(() => {
      if (hasPin) {
        // Type guard to ensure values match ChangePinSchema
        if ("currentPin" in values) {
          changePin(values as z.infer<typeof ChangePinSchema>).then((data) => {
            if (data?.error) {
              toast(data.error);
            } else {
              toast(data?.success || "PIN updated successfully!");
              pinForm.reset();
            }
          });
        }
      } else {
        // Values match SetPinSchema
        setPin(values as z.infer<typeof SetPinSchema>).then((data) => {
          if (data?.error) {
            toast(data.error);
          } else {
            toast(data?.success || "PIN set successfully!");
            pinForm.reset();
          }
        });
      }
    });
  };

  const onPasswordSubmit = (values: z.infer<typeof ChangePasswordSchema>) => {
    startPasswordTransition(() => {
      changePassword(values).then((data) => {
        if (data?.error) {
          toast(data.error);
        } else {
          toast(data?.success || "Password changed successfully!");
          passwordForm.reset();
        }
      });
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Security Settings</DialogTitle>
          <DialogDescription>
            {"Manage your account's security preferences."}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="pin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pin">Transaction PIN</TabsTrigger>
            <TabsTrigger value="password">Change Password</TabsTrigger>
          </TabsList>

          <TabsContent value="pin" className="mt-4">
            <Form {...pinForm}>
              <form
                onSubmit={pinForm.handleSubmit(onPinSubmit)}
                className="space-y-4"
              >
                <h4 className="text-lg font-semibold">
                  {hasPin
                    ? "Update Your Transaction PIN"
                    : "Set Your Transaction PIN"}
                </h4>
                <p className="text-sm text-muted-foreground">
                  Your 4-digit PIN for authorizing transactions.
                </p>

                {hasPin && (
                  <FormField
                    control={pinForm.control}
                    name="currentPin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current PIN</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="currentPin"
                            type="password"
                            maxLength={4}
                            pattern="\d{4}"
                            placeholder="••••"
                            disabled={isPinPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={pinForm.control}
                  name="newPin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New PIN</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id="newPin"
                          type="password"
                          maxLength={4}
                          pattern="\d{4}"
                          placeholder="••••"
                          disabled={isPinPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={pinForm.control}
                  name="confirmNewPin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New PIN</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id="confirmNewPin"
                          type="password"
                          maxLength={4}
                          pattern="\d{4}"
                          placeholder="••••"
                          disabled={isPinPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isPinPending}
                >
                  {isPinPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : hasPin ? (
                    "Update PIN"
                  ) : (
                    "Set PIN"
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="password" className="mt-4">
            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                className="space-y-4"
              >
                <h4 className="text-lg font-semibold">
                  Change Your Login Password
                </h4>
                <p className="text-sm text-muted-foreground">
                  Update your login password for online banking.
                </p>

                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id="currentPassword"
                          type="password"
                          placeholder="••••••••"
                          disabled={isPasswordPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id="newPassword"
                          type="password"
                          placeholder="••••••••"
                          disabled={isPasswordPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="confirmNewPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id="confirmNewPassword"
                          type="password"
                          placeholder="••••••••"
                          disabled={isPasswordPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isPasswordPending}
                >
                  {isPasswordPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SecuritySettingsModal;
