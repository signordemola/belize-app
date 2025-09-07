import { navItems } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const DesktopNavbar = () => {
  const pathname = usePathname();

  return (
    <nav
      className=" bg-foreground/70 flex items-center justify-between px-6 py-3"
      aria-label="Primary Header Navigation"
    >
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

      <div className="pr-8">
        <ul className="flex items-center gap-4 text-white">
          {navItems?.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className={`px-4 py-3 font-semibold transition-colors duration-300 ${
                  pathname === item.href ? "bg-danger-800" : "hover:underline"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default DesktopNavbar;
