import VerifyPinForm from "@/components/auth/verify-pin-form";
import React, { Suspense } from "react";

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
