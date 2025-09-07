"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Button } from "../ui/button";
import CustomButton from "../custom-button";
import { Menu, X } from "lucide-react";

const AuthHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header>
      <nav
        className="flex items-center justify-between px-6 py-3"
        aria-label="Primary Header Navigation"
      >
        <Link href="/" className="flex items-center">
          {/* <Image
            src="/images/logo.png"
            alt="Belize Bank Inc. Logo"
            width={30}
            height={30}
            className="rounded-full"
          /> */}
          <span className="text-primary-600 text-xl font-bold uppercase -ml-1 font-sans">
            BelizeBank
          </span>
        </Link>

        <div className="hidden md:block pr-8">
          <div className="flex items-center gap-4 text-white">
            <Button
              variant="outline"
              className="text-primary-600 border-primary-600 hover:bg-primary-600 hover:text-white rounded-none px-6 py-2 cursor-pointer"
            >
              <Link href={`contact`}>Contact Us</Link>
            </Button>

            {pathname === "/sign-in" ? (
              <Link href={`/sign-up`}>
                <CustomButton text="Open an Account" />
              </Link>
            ) : (
              <Link href={`/sign-in`}>
                <CustomButton text="Sign in" />
              </Link>
            )}
          </div>
        </div>

        {/* Hamburger button for mobile */}
        <button
          className="md:hidden text-primary-600 cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {isMenuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </nav>

      <div className="fdic-insured relative bg-foreground/70">
        <span className="pl-2 text-xs md:text-sm italic text-background/90 font-[0.8rem]">
          FDIC-Insured - Backed by the full faith and credit of the U.S.
          Government
        </span>
        <style jsx>{`
          .fdic-insured::before {
            background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 274.7 115.3'%3E%3Cpath d='M250.5 27.6c9.4 0 18.5 4.2 24.1 12V5.5C266.5 2 258.3 0 249.5 0c-14.9 0-29.8 6.7-40.2 17.7-10.1 10.7-15.5 25.1-15.5 40.1s5.4 30.5 17 41.4c11 10.3 25 16.1 39.7 16.1s15.1-2.2 24.2-5.1V76.1C269 83.2 260 87.7 251 87.7c-17.1 0-28.6-12.5-28.6-29.8s11.3-30.3 28.2-30.3m-88 84.8H190V2.9h-27.4v109.5zM99.7 88.3h-6.2V27h6.5c17.7 0 30.1 11 30.1 30.6s-14 30.6-30.4 30.6m5.2-85.3h-39v109.5h39c29.3 0 53.7-24 53.7-54.7S134.4 2.9 104.9 2.9M.1 112.3h27.4v-43h30.1V45.2H27.5V26.9h33.2V2.8H0v109.5h.1z' fill='%23fff'/%3E%3C/svg%3E");
            background-position: 0;
            background-repeat: no-repeat;
            background-size: 90%;
            content: "";
            display: block;
            height: 100%;
            left: 1rem;
            position: absolute;
            top: 0;
            width: 2.35rem;
          }
          .fdic-insured {
            position: relative;
            padding-left: 3.5rem; /* Adjust to accommodate the pseudo-element */
          }
          .fdic-insured span {
            display: inline-block;
          }
        `}</style>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
            md:hidden absolute top-20 right-1 w-1/2 py-6 bg-primary-600 text-white shadow-lg z-[999]
            transform transition-all duration-500 ease-in-out
            ${
              isMenuOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2 pointer-events-none"
            }
        `}
      >
        <div className="px-6 py-4 flex flex-col space-y-4">
          <Button
            variant="outline"
            className="text-primary-600 border-red-600 hover:bg-gray-100 hover:text-primary-900 rounded-none px-6 py-2"
          >
            <Link href="contact">Contact Us</Link>
          </Button>

          {pathname === "/sign-in" ? (
            <Button
              variant="outline"
              className="text-primary-600 border-red-600 hover:bg-gray-100 hover:text-primary-900 rounded-none px-6 py-2 w-full"
            >
              <Link href="/sign-up">Open an Account</Link>
            </Button>
          ) : (
            <Button
              variant="outline"
              className="text-primary-600 border-red-600 hover:bg-gray-100 hover:text-primary-900 rounded-none px-6 py-2 w-full"
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;
