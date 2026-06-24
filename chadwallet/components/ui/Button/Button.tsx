// components/ui/Button/Button.tsx
import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

export function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps): React.JSX.Element {
  const baseStyle = "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none";
  const variantStyles = {
    primary: "bg-accent text-white hover:bg-opacity-90",
    secondary: "bg-bg-surface border border-border text-text-primary hover:bg-opacity-85",
    danger: "bg-sell text-white hover:bg-opacity-90",
  };

  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
export default Button;
