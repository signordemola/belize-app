import React from "react";

interface CustomButtonProps {
  text: string;
}

const CustomButton = ({ text }: CustomButtonProps) => {
  return (
    <button className="themeBtn">
      <svg
        className={`buttonArrow`}
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M9 18L15 12L9 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{text}</span>
    </button>
  );
};

export default CustomButton;
