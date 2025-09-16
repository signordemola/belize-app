import SignUpForm from "@/components/auth/signup-form";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Sign Up",
};

const SignUpPage = () => {
  return (
    <section>
      <SignUpForm />
    </section>
  );
};

export default SignUpPage;
