"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import CustomButton from "./custom-button";
import DesktopNavbar from "./desktop-navbar";
import { usePathname } from "next/navigation";
import { fullNavItems } from "@/constants";
import { BelizeBankLogo } from "./logo";

interface HeaderProps {
  session: {
    userId: string;
    role: string;
  } | null;
}

const Header = ({ session }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isLoggedIn = Boolean(session?.userId);

  const customerUser = session?.role === "CUSTOMER";
  const adminUser = session?.role === "ADMIN";

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  return (
    <header className="fixed top-0 left-0 shadow border-b-2 w-full z-[9999] mb-40">
      <div className="bg-white py-1.5 lg:py-0">
        <DesktopNavbar />

        <nav>
          <div className="flex items-center justify-between px-10 py-2">
            <Link
              href="/"
              className="flex items-center space-x-"
              onClick={closeMobileMenu}
            >
              <BelizeBankLogo />
            </Link>

            <div className="hidden lg:flex space-x-8 items-center">
              {isLoggedIn && customerUser ? (
                <Link href={`/dashboard`}>
                  <CustomButton text="My Portal" />
                </Link>
              ) : isLoggedIn && adminUser ? (
                <Link href={`/admin-panel`}>
                  <CustomButton text="Admin Panel" />
                </Link>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="text-primary-600 border-primary-600 hover:bg-primary-800 hover:text-white rounded-none px-6 py-3 cursor-pointer"
                  >
                    <Link href={`/sign-in`}>Sign In</Link>
                  </Button>
                  <Link href={`/sign-up`}>
                    <CustomButton text="Open an Account" />
                  </Link>
                </>
              )}
            </div>

            <div className="lg:hidden z-[9999]">
              <button
                onClick={toggleMobileMenu}
                className="text-primary-600 cursor-pointer focus:outline-none"
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
            className={`lg:hidden fixed w-full h-full top-26 bg-gradient-to-br from-gray-50 to-white bg-opacity-95 z-[999] 
                          transition-all duration-500 ease-in-out
                          ${
                            isMobileMenuOpen
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 -translate-y-4"
                          }
                        `}
          >
            {/* Main menu links */}
            <div className="flex flex-col items-center justify-center pb-32 h-full transition-opacity duration-500 ease-in-out">
              <ul className="flex flex-col items-center gap-12 text-black/95">
                {fullNavItems?.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className={`px-12 py-3 transition-colors duration-300 ${
                        pathname === item.href
                          ? "underline underline-offset-4 text-xl text-red-900"
                          : "hover:underline hover:underline-offset-4"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                {isLoggedIn && customerUser ? (
                  <Link href={`/dashboard`}>
                    <CustomButton text="My Portal" />
                  </Link>
                ) : isLoggedIn && adminUser ? (
                  <Link href={`/admin-panel`}>
                    <CustomButton text="Admin Panel" />
                  </Link>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="text-primary-600 border-primary-600 hover:bg-primary-800 hover:text-white rounded-none px-6 py-2 cursor-pointer"
                    >
                      <Link href={`/sign-in`}>Sign In</Link>
                    </Button>
                    <Link href={`/sign-up`}>
                      <CustomButton text="Open an Account" />
                    </Link>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </div>

      <div className="bg-foreground/80 py-1.5 lg:hidden">
        <div className="fdic-insured relative">
          <span className="pl-6 text-xs italic text-background/90 font-[0.8rem]">
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
              left: 2rem;
              position: absolute;
              top: 0;
              width: 2.5rem;
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
      </div>
    </header>
  );
};

export default Header;
