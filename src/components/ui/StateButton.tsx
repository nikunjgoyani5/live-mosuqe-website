import React, { ReactNode } from "react";

interface IProps {
  children: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  variant?: string;
  onClick?: () => void;
  type?: "submit" | "button";
  id?: string;
}

function StateButton({
  children,
  loading,
  className,
  variant = "primary",
  type = "submit",
  ...props
}: IProps) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className}`}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}

export default StateButton;
