"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";

import { ChevronDown, LogOut, Menu, X, Shield, Landmark } from "lucide-react";
import { logout } from "@/actions/logout";
import { formatDistanceToNowStrict } from "date-fns";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import SecuritySettingsModal from "../modals/security-settings";
import AccountManagementModal from "../modals/account-management";

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: Date;
  priority: string;
}

interface CustomerNavBarProps {
  profile: {
    email: string;
    firstName: string;
    lastName: string;
    username: string | null;
    imageUrl: string | null;
  };
  hasPin: boolean;
  initialNotifications: Notification[];
  userBeneficiaries: {
    id: string;
    name: string;
    type: "BANK_ACCOUNT" | "UTILITY";
    accountNumber?: string | null;
    utilityId?: string | null;
  }[];
}

const navItems = [
  { icon: "🏠", title: "Dashboard", url: "/dashboard" },
  { icon: "↔️", title: "Transfers", url: "#transfer-section" },
  { icon: "⚡", title: "Quick Actions", url: "#quick-actions" },
];

const CustomerNavBar = ({
  profile: { email, firstName, lastName, username, imageUrl },
  hasPin,
  initialNotifications,
  userBeneficiaries,
}: CustomerNavBarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications] = useState<Notification[]>(initialNotifications);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isAccountManagementModalOpen, setIsAccountManagementModalOpen] =
    useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!hasPin) {
      setIsSecurityModalOpen(true);
    }
  }, [hasPin]);

  const handleLogout = async () => {
    await logout();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50 transition-all duration-200 ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24 md:h-28">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center px-3">
              <Link href="/" className="flex items-center space-x-2">
                {/* <Image
                  src="/images/logo-50.png"
                  alt="Bank Logo"
                  width={30}
                  height={30}
                  className="rounded-full"
                /> */}
                <span className="text-primary-600 text-xl font-bold uppercase -ml-1 font-sans">
                  Belize Bank Inc.
                </span>
              </Link>
            </div>
            <div className="hidden md:ml-12 md:flex md:items-center md:space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.url}
                  className="px-3 py-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 flex items-center space-x-2 group"
                >
                  <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.title}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="p-2 text-gray-500 hover:text-gray-600 hover:bg-gray-50"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    {notifications.length > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-white-500 rounded-full"></span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-80 rounded-md shadow-lg"
                  align="end"
                >
                  <DropdownMenuLabel className="px-4 py-2 font-semibold flex justify-between items-center">
                    Notifications
                    <span className="ml-2 px-2 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">
                      last {notifications.length}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className={`block px-4 py-2 text-sm cursor-pointer rounded-lg whitespace-normal ${
                          notification.read
                            ? "text-gray-500 bg-gray-50"
                            : "text-gray-700 hover:bg-primary-50"
                        }`}
                      >
                        <p
                          className={`font-medium ${
                            notification.read
                              ? "text-gray-400"
                              : "text-gray-900"
                          }`}
                        >
                          {notification.type}
                        </p>
                        <p
                          className={`text-xs ${
                            notification.read
                              ? "text-gray-400"
                              : "text-gray-600"
                          }`}
                        >
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDistanceToNowStrict(
                            new Date(notification.createdAt),
                            { addSuffix: true }
                          )}
                        </p>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem className="px-4 py-2 text-sm text-gray-500 cursor-default">
                      No recent notifications.
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="px-4 py-2 text-sm text-center text-primary-600 hover:text-primary-700 cursor-pointer rounded-lg">
                    <Link href="/notifications" className="block w-full">
                      View All Notifications
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-3 px-4 py-8 text-gray-700 bg-primary-50 hover:bg-primary-100"
                >
                  <Image
                    src={imageUrl || "/images/default-avatar.png"}
                    alt={`${firstName} ${lastName}`}
                    width={1000}
                    height={1000}
                    className="rounded-full object-cover h-12 w-12"
                  />
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium capitalize">
                      {username || `${firstName} ${lastName}`}
                    </p>
                    <p className="text-xs text-gray-500">Customer Portal</p>
                  </div>
                  <ChevronDown className="hidden md:block w-5 h-5 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-64 rounded-md shadow-md"
                align="end"
              >
                <DropdownMenuLabel className="px-4 py-2">
                  <p className="text-sm font-medium text-gray-900">{email}</p>
                  <p className="text-xs text-gray-500">Personal Banking</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 cursor-pointer rounded-lg"
                  onClick={() => setIsSecurityModalOpen(true)}
                >
                  <Shield className="w-5 h-5 mr-2 text-gray-500" />
                  Security Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 cursor-pointer rounded-lg"
                  onClick={() => setIsAccountManagementModalOpen(true)}
                >
                  <Landmark className="w-5 h-5 mr-2 text-gray-500" />
                  Account Management
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center px-4 py-2 text-sm hover:bg-red-50 cursor-pointer rounded-lg">
                  <Button variant={`destructive`} onClick={handleLogout}>
                    <LogOut className="w-5 h-5 mr-1 text-white" />
                    Sign Out
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="md:hidden">
              <Button
                variant="ghost"
                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="flex flex-col space-y-2 px-4 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.url}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
                  onClick={toggleMobileMenu}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <SecuritySettingsModal
        isOpen={isSecurityModalOpen}
        hasPin={hasPin}
        onOpenChange={setIsSecurityModalOpen}
      />
      <AccountManagementModal
        isOpen={isAccountManagementModalOpen}
        onOpenChange={setIsAccountManagementModalOpen}
        beneficiaries={userBeneficiaries}
        username={username}
      />
    </nav>
  );
};

export default CustomerNavBar;
