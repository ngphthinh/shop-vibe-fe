import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "error"
    | "blue"
    | "cancel_outline"
    | "save";
  size?: "sm" | "md" | "sx";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 text-sm focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-slate-900 hover:bg-slate-800 text-white shadow-sm",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-800",
    outline:
      "border border-slate-200 hover:border-slate-900 hover:bg-slate-50 text-slate-700",
    error: "bg-red-500 hover:bg-red-600 text-white shadow-sm",
    blue: "bg-blue-500 hover:bg-blue-600 text-white shadow-sm",
    cancel_outline:
      "border border-gray-300 hover:border-gray-900 hover:bg-gray-50 text-gray-700",
    save: "bg-green-500 hover:bg-green-600 text-white shadow-sm",
  };

  const sizes = {
    sx: "px-2 py-1 text-xs",
    sm: "px-3 py-2 text-xs",
    md: "px-4 py-2.5 w-full",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}>
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <svg
            className="animate-spin h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      ) : (
        children
      )}
    </button>
  );
};
