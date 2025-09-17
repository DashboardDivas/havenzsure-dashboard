"use client";

import React from "react";
import MuiButton from "@mui/material/Button";


type ButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
};

export default function Button({ children, disabled, onClick }: ButtonProps) {
  return (
    <MuiButton
      onClick={onClick}
      disabled={disabled}
      variant="contained"
      className={`
        px-5 py-2 rounded-lg font-semibold shadow-md transition-all
        bg-gradient-to-r from-blue-500 to-blue-600 text-white
        hover:from-green-500 hover:to-green-600 hover:shadow-lg
        active:from-purple-600 active:to-purple-700 active:scale-95
        disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-600 disabled:shadow-none
      `}
    >
      {children}
    </MuiButton>
  );
}
