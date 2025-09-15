import Link from "next/link";
import React from "react";

interface PageHeaderProps {
  title: string;
}

const PageHeader = ({ title }: PageHeaderProps) => {
  return (
    <div className="flex items-center gap-4">
      <Link
        href={`/`}
        className="flex items-center text-gray-900 font-semibold hover:underline"
      >
        <span>Home</span>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-inherit"
            fill="none"
            viewBox="0 0 24 16"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </Link>

      <div className="flex items-center text-primary-600 font-semibold">
        <span>{title}</span>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-inherit"
            fill="none"
            viewBox="0 0 24 16"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default PageHeader;
