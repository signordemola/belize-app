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
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

const SignUpForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      userId: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      dateOfBirth: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
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
          if (result?.redirect) {
            router.push(result.redirect);
          }
        }
      });
    });
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 text-foreground">
      <div className="w-full max-w-4xl rounded-sm border bg-white p-16 shadow-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Profile Image Upload */}
            <section className="space-y-6">
              <h3 className="text-xl font-semibold">Profile Picture</h3>

              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  {imagePreview ? (
                    <div className="relative">
                      <Image
                        src={imagePreview}
                        alt="Profile preview"
                        width={120}
                        height={120}
                        className="rounded-none object-cover border-4 border-primary/20"
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
              <h3 className="text-xl font-semibold">Account Credentials</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User ID</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="johndoe123"
                          disabled={isPending}
                          {...field}
                          className="rounded-none py-5 bg-white autofill:!bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          className="rounded-none py-5 bg-white autofill:!bg-white"
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative bg-white">
                          <Input
                            {...field}
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            disabled={isPending}
                            className="rounded-none py-5 bg-white autofill:!bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground cursor-pointer"
                          >
                            {showPassword ? (
                              <IoEyeOffOutline size={20} />
                            ) : (
                              <IoEyeOutline size={20} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          disabled={isPending}
                          {...field}
                          className="rounded-none py-5 bg-white autofill:!bg-white"
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
              <h3 className="text-xl font-semibold">Personal Information</h3>

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
                          className="rounded-none py-5 bg-white autofill:!bg-white"
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
                          className="rounded-none py-5 bg-white autofill:!bg-white"
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
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="(555) 123-4567"
                          disabled={isPending}
                          {...field}
                          className="rounded-none py-5 bg-white autofill:!bg-white"
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
                          className="rounded-none pt-3 pb-7 bg-white autofill:!bg-white"
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
              <h3 className="text-xl font-semibold">Contact Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123 Main St"
                          disabled={isPending}
                          {...field}
                          className="rounded-none py-5 bg-white autofill:!bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Any town"
                          disabled={isPending}
                          {...field}
                          className="rounded-none py-5 bg-white autofill:!bg-white"
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
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="90210"
                          disabled={isPending}
                          {...field}
                          className="rounded-none py-5 bg-white autofill:!bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Select
                          disabled={isPending}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="rounded-none py-5 bg-white autofill:!bg-white w-full">
                            <SelectValue placeholder="Select a state" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 overflow-y-auto">
                            <SelectItem value="AL">Alabama</SelectItem>
                            <SelectItem value="AK">Alaska</SelectItem>
                            <SelectItem value="AZ">Arizona</SelectItem>
                            <SelectItem value="AR">Arkansas</SelectItem>
                            <SelectItem value="CA">California</SelectItem>
                            <SelectItem value="CO">Colorado</SelectItem>
                            <SelectItem value="CT">Connecticut</SelectItem>
                            <SelectItem value="DE">Delaware</SelectItem>
                            <SelectItem value="DC">
                              District of Columbia
                            </SelectItem>
                            <SelectItem value="FL">Florida</SelectItem>
                            <SelectItem value="GA">Georgia</SelectItem>
                            <SelectItem value="HI">Hawaii</SelectItem>
                            <SelectItem value="ID">Idaho</SelectItem>
                            <SelectItem value="IL">Illinois</SelectItem>
                            <SelectItem value="IN">Indiana</SelectItem>
                            <SelectItem value="IA">Iowa</SelectItem>
                            <SelectItem value="KS">Kansas</SelectItem>
                            <SelectItem value="KY">Kentucky</SelectItem>
                            <SelectItem value="LA">Louisiana</SelectItem>
                            <SelectItem value="ME">Maine</SelectItem>
                            <SelectItem value="MD">Maryland</SelectItem>
                            <SelectItem value="MA">Massachusetts</SelectItem>
                            <SelectItem value="MI">Michigan</SelectItem>
                            <SelectItem value="MN">Minnesota</SelectItem>
                            <SelectItem value="MS">Mississippi</SelectItem>
                            <SelectItem value="MO">Missouri</SelectItem>
                            <SelectItem value="MT">Montana</SelectItem>
                            <SelectItem value="NE">Nebraska</SelectItem>
                            <SelectItem value="NV">Nevada</SelectItem>
                            <SelectItem value="NH">New Hampshire</SelectItem>
                            <SelectItem value="NJ">New Jersey</SelectItem>
                            <SelectItem value="NM">New Mexico</SelectItem>
                            <SelectItem value="NY">New York</SelectItem>
                            <SelectItem value="NC">North Carolina</SelectItem>
                            <SelectItem value="ND">North Dakota</SelectItem>
                            <SelectItem value="OH">Ohio</SelectItem>
                            <SelectItem value="OK">Oklahoma</SelectItem>
                            <SelectItem value="OR">Oregon</SelectItem>
                            <SelectItem value="PA">Pennsylvania</SelectItem>
                            <SelectItem value="RI">Rhode Island</SelectItem>
                            <SelectItem value="SC">South Carolina</SelectItem>
                            <SelectItem value="SD">South Dakota</SelectItem>
                            <SelectItem value="TN">Tennessee</SelectItem>
                            <SelectItem value="TX">Texas</SelectItem>
                            <SelectItem value="UT">Utah</SelectItem>
                            <SelectItem value="VT">Vermont</SelectItem>
                            <SelectItem value="VA">Virginia</SelectItem>
                            <SelectItem value="WA">Washington</SelectItem>
                            <SelectItem value="WV">West Virginia</SelectItem>
                            <SelectItem value="WI">Wisconsin</SelectItem>
                            <SelectItem value="WY">Wyoming</SelectItem>
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
              <h3 className="text-xl font-semibold">Account Type</h3>

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
                        <SelectTrigger className="rounded-none py-5 bg-white autofill:!bg-white w-full">
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

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-red-600 py-6 rounded-none text-lg hover:bg-red-800 focus:bg-red-800 cursor-pointer"
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
