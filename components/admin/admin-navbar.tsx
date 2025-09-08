"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from ".././ui/button";
import { logout } from "@/actions/logout";
import { getFormattedDateTime } from "@/lib/utils";

const AdminNavbar = () => {
  const [scrolled, setScrolled] = useState(false);

  const { date } = getFormattedDateTime();


  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50 transition-all duration-200 ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24 md:h-28">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center px-3">
              <Link href="/" className="flex items-center space-x-2">
                {/* <Image
                  src="/images/logo-50.png"
                  alt="FinTrust Credit Union Logo"
                  width={30}
                  height={30}
                  className="rounded-full"
                /> */}
                <span className="text-primary-600 text-xl font-bold uppercase -ml-1 font-sans">
                  BELIZEBANK
                </span>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="">
              <h6 className="text-primary-900 font-semibold">Admin Panel</h6>
              <p className="text-xs text-muted-foreground">{date}</p>
            </div>

            <Button
              variant={`destructive`}
              className="cursor-pointer"
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
