// components/ui/Button/Button.tsx
import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps): React.JSX.Element {
  const baseStyle = "inline-flex items-center justify-center font-semibold transition-all rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed select-none";
  
  const variantStyles = {
    primary: "bg-accent text-foreground hover:brightness-110 active:scale-[0.98]",
    secondary: "bg-bg-surface border border-border text-foreground hover:bg-opacity-80 active:scale-[0.98]",
    ghost: "bg-transparent text-foreground hover:bg-bg-surface hover:bg-opacity-55 active:scale-[0.98]",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  };

  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
export default Button;
