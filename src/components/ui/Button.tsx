import { cn } from "@/lib/utils";
import Link from "next/link";
import { forwardRef } from "react";

const variantStyles = {
  primary: "bg-accent text-white hover:bg-accent/90",
  secondary: "bg-gray-100 text-text-primary hover:bg-gray-200",
  outline: "border border-gray-300 text-text-primary hover:bg-bg-secondary",
  ghost: "text-text-primary hover:bg-bg-secondary",
} as const;

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
} as const;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  href?: string;
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { children, variant = "primary", size = "md", href, className, ...props },
    ref
  ) {
    const classes = cn(
      "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      variantStyles[variant],
      sizeStyles[size],
      className
    );

    if (href) {
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

export default Button;
