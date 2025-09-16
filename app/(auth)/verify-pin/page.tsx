import VerifyPinForm from "@/components/auth/verify-pin-form";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Verify PIN",
};

const VerifyPinPage = () => {
  return (
    <section className="pt-20">
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyPinForm />
      </Suspense>
    </section>
  );
};

export default VerifyPinPage;
