"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import CustomButton from "./custom-button";
import DesktopNavbar from "./desktop-navbar";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  return (
    <div className="fixed top-0 left-0 bg-white shadow border-b-2 w-full z-[9999]">
      <DesktopNavbar />

      <header>
        <div className="flex items-center justify-between px-10 py-2">
          <Link
            href="/"
            className="flex items-center space-x-"
            onClick={closeMobileMenu}
          >
            {/* <Image
            src="/images/logo.png"
            alt="FinTrust Credit Union Logo"
            width={30}
            height={30}
            className="rounded-full"
          /> */}
            <span className="text-text-white text-xl font-bold uppercase -ml-1 font-sans">
              BelizeBank
            </span>
          </Link>

          <div className="hidden md:flex space-x-8 items-center">
            <Link
              href="/locations"
              className="text-text-white hover:text-primary-500 transition-colors duration-200"
            >
              Locations
            </Link>
            <Link
              href="/contact"
              className="text-text-white hover:text-primary-500 transition-colors duration-200"
            >
              Contact Us
            </Link>
            <Button
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white rounded-none px-6 py-2 cursor-pointer"
            >
              <Link href={`/sign-in`}>Sign In</Link>
            </Button>
            <Link href={`/sign-up`}>
              <CustomButton text="Open an Account" />
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-text-white cursor-pointer focus:outline-none"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                )}
              </svg>
            </button>
          </div>
        </div>

        <div
          className={`md:hidden fixed inset-0 bg-gradient-to-br from-primary-600 to-accent-600 bg-opacity-95 z-[999] transition-all duration-300 ease-out
          ${
            isMobileMenuOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-full pointer-events-none"
          }`}
        >
          {/* Header for logo and close button within the mobile menu */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-br from-primary-600 to-accent-600">
            <Link
              href="/"
              className="flex items-center space-x-2"
              onClick={closeMobileMenu}
            >
              <Image
                src="/images/logo.png"
                alt="Belize Bank Inc. Logo"
                width={30}
                height={30}
                className="rounded-full"
              />
              <span className="text-text-white text-xl font-bold uppercase -ml-1 font-sans">
                Fintrustcu
              </span>
            </Link>
            <button
              onClick={closeMobileMenu}
              className="text-text-white cursor-pointer focus:outline-none"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          {/* Main menu links - centered and scrollable if needed */}
          <div className="flex flex-col items-center justify-center space-y-8 pt-20 pb-8 h-full overflow-y-auto">
            <Link
              href="/"
              className="text-text-white text-2xl hover:text-primary-500"
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-text-white text-2xl hover:text-primary-500"
              onClick={closeMobileMenu}
            >
              About Us
            </Link>
            <Link
              href="/services"
              className="text-text-white text-2xl hover:text-primary-500"
              onClick={closeMobileMenu}
            >
              Services
            </Link>
            <Link
              href="/contact"
              className="text-text-white text-2xl hover:text-primary-500"
              onClick={closeMobileMenu}
            >
              Contact
            </Link>
            <Button
              variant="outline"
              className="w-48 text-primary-900 border-text-white hover:bg-text-white/50  rounded-full px-6 py-3 text-lg"
              onClick={closeMobileMenu}
            >
              <Link href={`/sign-in`}>Sign In</Link>
            </Button>
            <Button
              className="w-48 bg-primary-600 text-text-white px-6 py-3 rounded-full hover:bg-primary-900 text-lg"
              onClick={closeMobileMenu}
            >
              <Link href={`/sign-up`}>New Account</Link>
            </Button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
