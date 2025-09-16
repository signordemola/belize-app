import { SignInForm } from "@/components/auth/signin-form";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Sign In",
};

const SignInPage = () => {
  return (
    <section className="pt-20">
      <SignInForm />
    </section>
  );
};

export default SignInPage;
