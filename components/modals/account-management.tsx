"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AddBeneficiarySchema,
  EditBeneficiarySchema,
  UpdateUsernameSchema,
} from "@/schemas";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Edit, Loader2, PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { addBeneficiary, deleteBeneficiary, editBeneficiary, updateUsername } from "@/actions/account.manage";

interface Beneficiary {
  id: string;
  name: string;
  type: "BANK_ACCOUNT" | "UTILITY";
  accountNumber?: string | null;
  utilityId?: string | null;
}

interface AccountManagementModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  beneficiaries: Beneficiary[];
  username: string | null;
}

const AccountManagementModal: React.FC<AccountManagementModalProps> = ({
  isOpen,
  onOpenChange,
  beneficiaries,
  username,
}) => {
  const [showAddBeneficiaryForm, setShowAddBeneficiaryForm] = useState(false);
  const [editingBeneficiaryId, setEditingBeneficiaryId] = useState<
    string | null
  >(null);
  const [isBeneficiaryPending, startBeneficiaryTransition] = useTransition();
  const [isUsernamePending, startUsernameTransition] = useTransition();

  const addBeneficiaryForm = useForm<z.infer<typeof AddBeneficiarySchema>>({
    resolver: zodResolver(AddBeneficiarySchema),
    defaultValues: {
      name: "",
      type: "BANK_ACCOUNT",
      accountNumber: "",
      utilityId: "",
    },
  });

  const editBeneficiaryForm = useForm<z.infer<typeof EditBeneficiarySchema>>({
    resolver: zodResolver(EditBeneficiarySchema),
    defaultValues: {
      id: "",
      name: "",
      type: "BANK_ACCOUNT",
      accountNumber: "",
      utilityId: "",
    },
  });

  const usernameForm = useForm<z.infer<typeof UpdateUsernameSchema>>({
    resolver: zodResolver(UpdateUsernameSchema),
    defaultValues: {
      username: username || "",
    },
  });

  const onAddBeneficiarySubmit = (
    values: z.infer<typeof AddBeneficiarySchema>
  ) => {
    startBeneficiaryTransition(() => {
      addBeneficiary(values).then((data) => {
        if (data?.error) {
          toast(data.error);
        } else {
          toast(data?.success || "Beneficiary added successfully!");
          addBeneficiaryForm.reset();
          setShowAddBeneficiaryForm(false);
        }
      });
    });
  };

  const onEditBeneficiarySubmit = (
    values: z.infer<typeof EditBeneficiarySchema>
  ) => {
    startBeneficiaryTransition(() => {
      editBeneficiary(values).then((data) => {
        if (data?.error) {
          toast(data.error);
        } else {
          toast(data?.success || "Beneficiary updated successfully!");
          editBeneficiaryForm.reset();
          setEditingBeneficiaryId(null);
        }
      });
    });
  };

  const handleEditBeneficiary = (beneficiary: Beneficiary) => {
    setEditingBeneficiaryId(beneficiary.id);
    setShowAddBeneficiaryForm(false);
    editBeneficiaryForm.reset({
      id: beneficiary.id,
      name: beneficiary.name,
      type: beneficiary.type,
      accountNumber: beneficiary.accountNumber || "",
      utilityId: beneficiary.utilityId || "",
    });
  };

  const handleDeleteBeneficiary = (id: string) => {
    startBeneficiaryTransition(() => {
      deleteBeneficiary(id).then((data) => {
        if (data?.error) {
          toast(data.error);
        } else {
          toast(data?.success || "Beneficiary deleted successfully!");
        }
      });
    });
  };

  const onUsernameSubmit = (values: z.infer<typeof UpdateUsernameSchema>) => {
    startUsernameTransition(() => {
      updateUsername(values).then((data) => {
        if (data?.error) {
          toast(data.error);
        } else {
          toast(data?.success || "Username updated successfully!");
          usernameForm.reset({ username: values.username });
        }
      });
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Account Management</DialogTitle>
          <DialogDescription>
            Manage your username and saved bill pay details.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="username" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="username">Username</TabsTrigger>
            <TabsTrigger value="bill-pay">Bill Pay</TabsTrigger>
          </TabsList>

          <TabsContent value="username" className="mt-4">
            <h4 className="text-lg font-semibold mb-3">Set Username</h4>
            <Form {...usernameForm}>
              <form
                onSubmit={usernameForm.handleSubmit(onUsernameSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={usernameForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id="username"
                          placeholder="e.g., johndoe123"
                          disabled={isUsernamePending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isUsernamePending}
                >
                  {isUsernamePending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Update Username"
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="bill-pay" className="mt-4">
            <h4 className="text-lg font-semibold mb-3">
              Manage Bill Pay Beneficiaries
            </h4>
            <Button
              onClick={() => {
                setShowAddBeneficiaryForm(!showAddBeneficiaryForm);
                setEditingBeneficiaryId(null);
                addBeneficiaryForm.reset();
              }}
              className="mb-4"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Beneficiary
            </Button>

            {showAddBeneficiaryForm && (
              <Form {...addBeneficiaryForm}>
                <form
                  onSubmit={addBeneficiaryForm.handleSubmit(
                    onAddBeneficiarySubmit
                  )}
                  className="space-y-4 p-4 border rounded-md mb-4 bg-gray-50"
                >
                  <h5 className="font-medium">New Beneficiary Details</h5>
                  <FormField
                    control={addBeneficiaryForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Beneficiary Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="beneficiaryName"
                            placeholder="e.g., John Doe or Utility Co."
                            disabled={isBeneficiaryPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addBeneficiaryForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="BANK_ACCOUNT">
                                Bank Account
                              </SelectItem>
                              <SelectItem value="UTILITY">Utility</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addBeneficiaryForm.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Account Number (for Bank Accounts)
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="beneficiaryAccount"
                            placeholder="e.g., 1234567890"
                            disabled={isBeneficiaryPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addBeneficiaryForm.control}
                    name="utilityId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Utility ID (for Utilities)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="utilityId"
                            placeholder="e.g., UTIL-12345"
                            disabled={isBeneficiaryPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isBeneficiaryPending}>
                    {isBeneficiaryPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Add Beneficiary"
                    )}
                  </Button>
                </form>
              </Form>
            )}

            {editingBeneficiaryId && (
              <Form {...editBeneficiaryForm}>
                <form
                  onSubmit={editBeneficiaryForm.handleSubmit(
                    onEditBeneficiarySubmit
                  )}
                  className="space-y-4 p-4 border rounded-md mb-4 bg-gray-50"
                >
                  <h5 className="font-medium">Edit Beneficiary</h5>
                  <input
                    type="hidden"
                    {...editBeneficiaryForm.register("id")}
                  />
                  <FormField
                    control={editBeneficiaryForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Beneficiary Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="beneficiaryName"
                            placeholder="e.g., John Doe or Utility Co."
                            disabled={isBeneficiaryPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editBeneficiaryForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="BANK_ACCOUNT">
                                Bank Account
                              </SelectItem>
                              <SelectItem value="UTILITY">Utility</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editBeneficiaryForm.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Account Number (for Bank Accounts)
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="beneficiaryAccount"
                            placeholder="e.g., 1234567890"
                            disabled={isBeneficiaryPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editBeneficiaryForm.control}
                    name="utilityId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Utility ID (for Utilities)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="utilityId"
                            placeholder="e.g., UTIL-12345"
                            disabled={isBeneficiaryPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isBeneficiaryPending}>
                    {isBeneficiaryPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Update Beneficiary"
                    )}
                  </Button>
                </form>
              </Form>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Beneficiary</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="w-[100px] text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {beneficiaries.map((beneficiary) => (
                  <TableRow key={beneficiary.id}>
                    <TableCell className="font-medium">
                      {beneficiary.name}{" "}
                      {beneficiary.accountNumber &&
                        `(${beneficiary.accountNumber})`}
                      {beneficiary.utilityId && `(${beneficiary.utilityId})`}
                    </TableCell>
                    <TableCell>{beneficiary.type}</TableCell>
                    <TableCell className="text-right flex justify-end space-x-2">
                      {isBeneficiaryPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto"
                            onClick={() => handleEditBeneficiary(beneficiary)}
                          >
                            <Edit className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto"
                            onClick={() =>
                              handleDeleteBeneficiary(beneficiary.id)
                            }
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {beneficiaries.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center text-muted-foreground py-4"
                    >
                      No beneficiaries added.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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

export default AccountManagementModal;
