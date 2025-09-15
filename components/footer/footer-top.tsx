import Link from "next/link";
import React from "react";
import { Input } from "../ui/input";
import { HomeIcon, MapPin, Phone } from "lucide-react";

const FooterTop = () => {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-4">
              <Phone className="w-6 h-6 text-gray-800 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Call Us</h3>
            </div>

            <div className="space-y-2 text-sm text-gray-700">
              <div>
                <Link
                  href="tel:+12123636418"
                  className="text-primary-600 hover:text-primary-800 underline"
                >
                  (212) 363-6418
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center md:text-left border-l border-r border-gray-300 px-8">
            <div className="flex items-center justify-center md:justify-start mb-4">
              <HomeIcon className="w-6 h-6 text-gray-800 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Address</h3>
            </div>

            <div className="space-y-3 text-sm text-primary-600">
              <p>45 Broadway, New York, NY 10006</p>
            </div>
          </div>

          {/* Find Branch/ATM Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-4">
              <MapPin className="w-6 h-6 text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">
                Find a Branch or ATM
              </h3>
            </div>

            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="e.g. 44114"
                className="flex-1 bg-white border-gray-300"
              />
              <Link
                href={`\locations`}
                className="bg-danger-700 hover:bg-danger-800 text-white px-6 flex items-center justify-center rounded-md"
              >
                Go
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterTop;
