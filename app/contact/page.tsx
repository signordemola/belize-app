import Header from "@/components/header";
import { getUserSession } from "@/lib/session";
import Link from "next/link";
import React from "react";

const ContactPage = async () => {
  const session = await getUserSession();
  return (
    <>
      <Header session={session} />
      <div className="mt-26"></div>
      <section className="container mx-auto p-12">
        <div className="flex items-center gap-4">
          <Link
            href={`/`}
            className="flex items-center text-primary-900 font-semibold hover:underline"
          >
            <span>Home</span>
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-inherit"
                fill="none"
                viewBox="0 0 24 16"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </Link>

          <div className="flex items-center text-danger-900 font-semibold">
            <span>Contact Us</span>
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-inherit"
                fill="none"
                viewBox="0 0 24 16"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center gap-3 mt-12 border-b pb-6">
          <h3 className="text-4xl text-danger-600">We’re Here to Help</h3>
          <p className="text-xl">
            Belize Bank Inc. Customer Service and Support
          </p>
        </div>

        <div className="mt-12">
          <p className="text-center">
            Contact us for account support and answers to all your banking
            questions.
          </p>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
