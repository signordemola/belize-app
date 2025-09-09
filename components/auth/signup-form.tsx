"use client";

import { SignUpSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState, useTransition, useRef } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Upload, X, User } from "lucide-react";
import Image from "next/image";
import { signUp } from "@/actions/sign-up";

const SignUpForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      ssn: "",
      dateOfBirth: "",
      fullAddress: "",
      state: "",
      zipCode: "",
      country: "",
      accountType: "CHECKING",
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file.");
        setSelectedImage(null);
        setImagePreview(null);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB.");
        setSelectedImage(null);
        setImagePreview(null);
        return;
      }

      setSelectedImage(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (values: z.infer<typeof SignUpSchema>) => {
    setError("");

    if (!selectedImage) {
      setError("Please select a profile image.");
      return;
    }

    startTransition(() => {
      signUp(values, selectedImage).then((result) => {
        if (result?.error) {
          setError(result.error);
        } else {
          if (result?.success) {
            setSuccess(result.success);
          }
          if (result?.redirect) {
            setTimeout(() => {
              router.push(result.redirect);
            }, 5000);
          }
        }
      });
    });
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 text-foreground">
      <div className="w-full max-w-4xl rounded-sm border border-primary-600/30 bg-white p-16 shadow-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Profile Image Upload */}
            <section className="space-y-6">
              <h3 className="text-xl font-semibold text-primary-900">
                Profile Picture
              </h3>

              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  {imagePreview ? (
                    <div className="relative">
                      <Image
                        src={imagePreview}
                        alt="Profile preview"
                        width={120}
                        height={120}
                        className="rounded-md object-cover border-4 border-primary/20"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/80"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-30 h-30 rounded-full bg-muted flex items-center justify-center border-4 border-primary/20">
                      <User size={40} className="text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="profile-image"
                  />
                  <label
                    htmlFor="profile-image"
                    className="cursor-pointer inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    <Upload size={16} />
                    {selectedImage ? "Change Image" : "Upload Image"}
                  </label>
                  <p className="text-sm text-muted-foreground mt-2">
                    JPG, PNG or GIF (max. 5MB)
                  </p>
                </div>
              </div>
            </section>

            {/* Account Credentials */}
            <section className="space-y-6">
              <h3 className="text-xl font-semibold text-primary-900">
                Account Credentials
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="email@example.com"
                          disabled={isPending}
                          {...field}
                          className="rounded-md py-5 bg-white autofill:!bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="(555) 123-4567"
                          disabled={isPending}
                          {...field}
                          className="rounded-md py-5 bg-white autofill:!bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            {/* Personal Information */}
            <section className="space-y-6">
              <h3 className="text-xl font-semibold text-primary-900">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John"
                          disabled={isPending}
                          {...field}
                          className="rounded-md py-5 bg-white autofill:!bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Doe"
                          disabled={isPending}
                          {...field}
                          className="rounded-md py-5 bg-white autofill:!bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="ssn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Social Security Number (SSN)</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="123-45-6789"
                          disabled={isPending}
                          {...field}
                          className="rounded-md py-5 bg-white autofill:!bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          disabled={isPending}
                          {...field}
                          className="rounded-md pt-3 pb-7 bg-white autofill:!bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            {/* Contact Information */}
            <section className="space-y-6">
              <h3 className="text-xl font-semibold text-primary-900">
                Contact Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street and City</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123 Main St, Springfield"
                          disabled={isPending}
                          {...field}
                          className="rounded-md py-5 bg-white autofill:!bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="90210"
                          disabled={isPending}
                          {...field}
                          className="rounded-md py-5 bg-white autofill:!bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State / Province / Region</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="California, Ontario, etc."
                          disabled={isPending}
                          {...field}
                          className="rounded-md py-5 bg-white autofill:!bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Select
                          disabled={isPending}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="rounded-md py-5 bg-white autofill:!bg-white w-full">
                            <SelectValue placeholder="Select a country" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 overflow-y-auto">
                            <SelectItem value="US">United States</SelectItem>
                            <SelectItem value="CA">Canada</SelectItem>
                            <SelectItem value="UK">United Kingdom</SelectItem>
                            <SelectItem value="FR">France</SelectItem>
                            <SelectItem value="DE">Germany</SelectItem>
                            <SelectItem value="IT">Italy</SelectItem>
                            <SelectItem value="JP">Japan</SelectItem>
                            <SelectItem value="AU">Australia</SelectItem>
                            <SelectItem value="IN">India</SelectItem>
                            <SelectItem value="CN">China</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6"></div>
            </section>

            {/* Account Type */}
            <section className="space-y-6">
              <h3 className="text-xl font-semibold text-primary-900">
                Account Type
              </h3>

              <FormField
                control={form.control}
                name="accountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select an account</FormLabel>
                    <FormControl>
                      <Select
                        disabled={isPending}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="rounded-md py-5 bg-white autofill:!bg-white w-full">
                          <SelectValue placeholder="Select an account type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CHECKING">Checking</SelectItem>
                          <SelectItem value="SAVINGS">Savings</SelectItem>
                          <SelectItem value="FIXED_DEPOSIT">
                            Fixed Deposit
                          </SelectItem>
                          <SelectItem value="PRESTIGE">Prestige</SelectItem>
                          <SelectItem value="BUSINESS">Business</SelectItem>
                          <SelectItem value="INVESTMENT">Investment</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            {error && (
              <p className="text-sm text-destructive font-medium">{error}</p>
            )}

            {success && (
              <p className="text-sm text-green-600 font-medium">{success}</p>
            )}

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
                "Create Account"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignUpForm;
