"use client";

import { logout } from "@/actions/logout";
import { LogOut, Mail, RefreshCw, ShieldAlert } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const DeactivatedScreen = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleLogout = async () => {
    await logout();
  };
  return (
    <section className="h-[68dvh] w-full bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 shadow-sm">
          <ShieldAlert className="h-8 w-8 text-red-600" aria-hidden="true" />
        </div>

        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">
          Account Deactivated
        </h1>
        <p className="mt-2 text-gray-600">
          Your account has been deactivated. If you think this is a mistake or
          you need help restoring access, please contact support.
        </p>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          Inactive
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleRefresh}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium border border-gray-300 hover:bg-gray-50 transition"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>

          <Link
            href="mailto:support@belizebank.com?subject=Account%20Deactivated"
            className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium bg-gray-900 text-white hover:bg-black transition"
          >
            <Mail className="h-4 w-4" />
            Contact support
          </Link>

          <Button onClick={handleLogout} variant={`destructive`}>
            <LogOut className="h-4 w-4" />
            Log Out
          </Button>
        </div>

        <p className="mt-6 text-xs text-gray-500">
          If your status was updated by an administrator, access will be
          restored as soon as your account is reactivated.
        </p>
      </div>
    </section>
  );
};

export default DeactivatedScreen;
