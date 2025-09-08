"use client";

import { addBalanceToUser } from "@/actions/add-balance";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddBalanceSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const AddBalanceDialog = ({
  userId,
  fullName,
  open,
  onOpenChange,
}: {
  userId: string;
  fullName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof AddBalanceSchema>>({
    resolver: zodResolver(AddBalanceSchema),
    defaultValues: {
      amount: "",
      fromAccount: "",
      notes: "",
    },
  });

  const onSubmit = (values: z.infer<typeof AddBalanceSchema>) => {
    startTransition(() => {
      addBalanceToUser(values, userId).then((data) => {
        if (data?.error) {
          toast.error(data.error);
        } else {
          toast.success("Balance added successfully");
          form.reset();
          onOpenChange(false);
        }
      });
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-primary-600 text-xl font-semibold">
            Add Balance {`${fullName}'s`} Account
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activities</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="p-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Enter amount"
                            disabled={isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fromAccount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From Account</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Admin Reserve Account"
                            disabled={isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Reason for adding balance"
                            disabled={isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-primary-600 py-6 rounded-md text-lg hover:bg-primary-800 focus:bg-primary-800 cursor-pointer"
                  >
                    {isPending ? (
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      "Add Balance"
                    )}
                  </Button>
                </form>
              </Form>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="p-6">
              <p>Recent transactions will appear here.</p>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddBalanceDialog;
