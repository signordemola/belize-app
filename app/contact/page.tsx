import FooterBottom from "@/components/footer/footer-bottom";
import Header from "@/components/header";
import PageHeader from "@/components/page-header";
import { getUserSession } from "@/lib/session";
import {
  DollarSign,
  MapPin,
  MessageCircle,
  Monitor,
  Phone,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Contact Us",
};

const ContactPage = async () => {
  const session = await getUserSession();
  return (
    <>
      <Header session={session} />
      <div className="mt-26"></div>
      <section className="container mx-auto p-12">
        <PageHeader title="Contact Us" />

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

          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto mt-20">
            {/* MyBelize Virtual Assistant Card */}
            <div className="bg-gray-100 p-8 rounded-md relative">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="bg-danger-600 rounded-full p-4 shadow-md">
                  <MessageCircle className="w-6 h-6 text-white fill-white" />
                </div>
              </div>

              <div className="pt-8 text-center">
                <h2 className="text-xl font-semibold text-danger-600 mb-6">
                  MyBelize Virtual Assistant
                </h2>

                <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
                  <p>
                    Use MyBelize 24/7 in online banking and the mobile app to
                    make transactions, ask questions, and more. Plus, weekdays,
                    7:00 a.m – Midnight, and weekends, 8:00 am – 9:00 p.m. ET,
                    MyBelize can connect you directly with a client service
                    professional.
                  </p>
                </div>

                <div className="mt-8">
                  <Link
                    className="bg-danger-600 hover:bg-danger-800 text-white px-8 py-2 rounded-md"
                    href={`/sign-in`}
                  >
                    Sign On
                  </Link>
                </div>
              </div>
            </div>

            {/* Locations Card */}
            <div className="bg-gray-100 p-8 rounded-md relative">
              {/* Red location icon */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="bg-danger-600 rounded-full p-4 shadow-md">
                  <MapPin className="w-6 h-6 text-white fill-white" />
                </div>
              </div>

              <div className="pt-8 text-center">
                <h2 className="text-xl font-semibold text-danger-600 mb-6">
                  Locations
                </h2>

                <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
                  <p>
                    {
                      "We're serving clients at all our ATMs, most drive-thrus, and by appointment at most branches. For safe deposit box access, contact us."
                    }
                  </p>
                </div>

                <div className="mt-8 space-y-3">
                  <div>
                    <Link
                      href="/locations"
                      className="text-blue-600 hover:text-blue-800 underline text-sm"
                    >
                      Find locations
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Online and Mobile Banking Card */}
            <div className="bg-gray-100 p-8 rounded-md relative">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="bg-danger-600 rounded-full p-4 shadow-md">
                  <Monitor className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="pt-8 text-center">
                <h2 className="text-xl font-semibold text-danger-600 mb-6">
                  Online and Mobile Banking
                </h2>

                <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
                  <p>
                    Check balances, deposit checks, pay bills, and more — easily
                    and securely, without leaving home.
                  </p>

                  <div className="space-y-1 text-xs">
                    <p>Monday – Friday, 7:00 a.m. – Midnight ET</p>
                    <p>Saturday – Sunday, 8:00 a.m. – 9:00 p.m. ET</p>
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    className="bg-danger-600 hover:bg-danger-800 text-white px-8 py-2 rounded-md"
                    href={`/sign-in`}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>

            {/* Call Us Card */}
            <div className="bg-gray-100 p-8 rounded-md relative">
              {/* Red phone icon */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="bg-danger-600 rounded-full p-4 shadow-md">
                  <Phone className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="pt-8 text-center">
                <h2 className="text-xl font-semibold text-danger-600 mb-4">
                  Call Us
                </h2>
                <h3 className="text-md font-medium text-danger-600 mb-6">
                  24/7 customer service
                </h3>

                <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
                  <div>
                    <Link
                      href="tel:+12123636418"
                      className="text-secondary-600 hover:text-secondary-800 underline"
                    >
                      (212) 363-6418
                    </Link>
                    <span className="text-xs align-super">®</span>
                  </div>

                  <p className="text-xs">Dial 711 for TTY/TRS</p>

                  <p className="text-xs">
                    Clients using a relay service: 1-212-363-6418
                  </p>
                </div>
              </div>
            </div>

            {/* Mortgage Customer Service Card */}
            <div className="bg-gray-100 p-8 rounded-md relative">
              {/* Red message icon */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="bg-danger-600 rounded-full p-4 shadow-md">
                  <MessageCircle className="w-6 h-6 text-white fill-white" />
                </div>
              </div>

              <div className="pt-8 text-center">
                <h2 className="text-xl font-semibold text-danger-600 mb-6">
                  Mortgage Customer Service
                </h2>

                <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
                  <div>
                    <Link
                      href="tel:+12123636418"
                      className="text-secondary-600 hover:text-secondary-800 underline"
                    >
                      (212) 363-6418
                    </Link>
                  </div>

                  <p className="text-xs">Dial 711 for TTY/TRS</p>

                  <p className="text-xs">
                    Monday – Friday, 8:30 a.m. – 8:00 p.m. ET
                  </p>
                </div>
              </div>
            </div>

            {/* Make a Payment Card */}
            <div className="bg-gray-100 p-8 rounded-md relative">
              {/* Red dollar sign icon */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="bg-danger-600 rounded-full p-4 shadow-md">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="pt-8 text-center">
                <h2 className="text-xl font-semibold text-danger-600 mb-6">
                  Make a Payment
                </h2>

                <div className="space-y-3 text-sm">
                  <div>
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Make a Mortgage Payment
                    </a>
                  </div>
                  <div>
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Make a Credit Card Payment
                    </a>
                  </div>
                  <div>
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Make a Consumer Loan or Line of Credit Payment
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterBottom />
    </>
  );
};

export default ContactPage;
