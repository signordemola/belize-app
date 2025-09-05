import OtpForm from "@/components/auth/otp-form";
import React, { Suspense } from "react";

const VerifyOTPPage = () => {
  return (
    <section className="pt-20">
      <Suspense fallback={<div>Loading...</div>}>
        <OtpForm />
      </Suspense>
    </section>
  );
};

export default VerifyOTPPage;
