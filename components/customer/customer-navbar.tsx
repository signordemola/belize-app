"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  LogOut,
  Menu,
  X,
  Shield,
  Landmark,
  Bell,
} from "lucide-react";
import { logout } from "@/actions/logout";
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
import { NotificationsModal } from "../modals/notifications";

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
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isAccountManagementModalOpen, setIsAccountManagementModalOpen] =
    useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
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
          {/* Left side */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center px-3">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-primary-600 text-xl font-bold uppercase -ml-1 font-sans">
                  Belize Bank Inc.
                </span>
              </Link>
            </div>
            <div className="hidden lg:ml-12 lg:flex lg:items-center lg:space-x-1">
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

          {/* Right side */}
          <div className="flex items-center space-x-5">
            {/* Notifications button */}
            <Button
              variant="ghost"
              className="p-2 text-gray-500 hover:text-gray-600 hover:bg-gray-50 relative"
              onClick={() => setIsNotificationsOpen(true)}
            >
              <Bell className="w-6 h-6" />
              {notifications.length > 0 && (
                <span className="absolute -top-1.5 -right-2 px-1.5 py-0.5 text-[10px] font-bold text-white bg-red-500 rounded-full shadow">
                  new
                </span>
              )}
            </Button>

            {/* Profile dropdown */}
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
                    className="rounded-full object-cover h-10 w-10"
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
                  <Button variant="destructive" onClick={handleLogout}>
                    <LogOut className="w-5 h-5 mr-1 text-white" />
                    Sign Out
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <div className="lg:hidden">
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

        {/* Mobile nav */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100">
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

      {/* Modals */}
      <NotificationsModal
        notifications={notifications}
        open={isNotificationsOpen}
        onOpenChange={setIsNotificationsOpen}
      />
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
