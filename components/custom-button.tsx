import { ArrowRight } from "lucide-react";
import React from "react";

interface CustomButtonProps {
  text: string;
}

const CustomButton = ({ text }: CustomButtonProps) => {
  return (
    <button className="themeBtn inline-flex items-center gap-2">
      <span>{text}</span>
      <ArrowRight className="buttonArrow w-5 h-5" />
    </button>
  );
};

export default CustomButton;
