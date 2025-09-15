import { fullNavItems } from "@/constants";
import Link from "next/link";
import React from "react";
import {
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoLinkedin,
  IoLogoTwitter,
  IoLogoYoutube,
} from "react-icons/io5";

const FooterBottom = () => {
  const now = new Date();
  const fullYear = now.getFullYear();
  return (
    <div className="bg-gray-800 text-white py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Navigation Links */}
        <ul className="flex flex-wrap items-center justify-center lg:justify-start gap-6 lg:gap-10 mb-6 text-sm">
          {fullNavItems?.map((item, index) => (
            <li key={index}>
              <Link href={item.href} className="hover:text-gray-300 underline">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Social Media Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <span className="text-sm font-medium">Connect With Us</span>
            <div className="flex gap-3">
              <p className="hover:text-gray-300">
                <IoLogoFacebook className="w-5 h-5" />
              </p>
              <p className="hover:text-gray-300">
                <IoLogoInstagram className="w-5 h-5" />
              </p>
              <p className="hover:text-gray-300">
                <IoLogoLinkedin className="w-5 h-5" />
              </p>
              <p className="hover:text-gray-300">
                <IoLogoTwitter className="w-5 h-5" />
              </p>
              <p className="hover:text-gray-300">
                <IoLogoYoutube className="w-5 h-5" />
              </p>
            </div>
          </div>

          {/* Logos placeholder */}
          <div className="flex items-center gap-4">
            <div className="bg-white text-gray-800 px-3 py-1 rounded text-xs font-bold">
              EQUAL HOUSING LENDER
            </div>
            <div className="bg-white text-gray-800 px-3 py-1 rounded text-xs font-bold">
              Member FDIC
            </div>
          </div>
        </div>

        {/* Legal Links and Copyright */}
        <div className="border-t border-gray-500 mt-6 pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between text-xs">
            <div className="flex flex-wrap gap-4 mb-4 md:mb-0">
              <p className="hover:text-gray-300 underline">User Agreement</p>
              <span className="text-gray-400">|</span>
              <p className="hover:text-gray-300 underline">
                Online Privacy Statement
              </p>
              <span className="text-gray-400">|</span>
              <p className="hover:text-gray-300 underline">
                Your Privacy & Security
              </p>
            </div>
            <div className="text-gray-300">
              ©{fullYear} KeyCorp<span className="align-super">®</span>. All
              rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
