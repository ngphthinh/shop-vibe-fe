import React, { useState } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, type = "text", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPasswordType = type === "password";

    // Khử cấu trúc type động: Nếu đang bật "show" thì chuyển thành "text", ngược lại giữ "password"
    const inputType = isPasswordType && showPassword ? "text" : type;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            {label}
          </label>
        )}

        {/* Bọc input vào khung relative để định vị nút con mắt ở góc phải */}
        <div className="relative flex items-center">
          <input
            id={id}
            ref={ref}
            type={inputType}
            className={`w-full pl-3.5 pr-10 py-2.5 bg-white border rounded-lg text-sm transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-slate-200 focus:border-slate-900 focus:ring-slate-900"
            } ${className}`}
            {...props}
          />

          {/* Chỉ hiển thị nút con mắt khi thuộc tính type truyền vào là "password" */}
          {isPasswordType && (
            <button
              type="button" // Bắt buộc phải là type="button" để tránh kích hoạt submit form ngoài ý muốn
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-slate-400 hover:text-slate-900 transition-colors focus:outline-none select-none">
              {showPassword ? (
                // Icon Con mắt gạch chéo (Ẩn mật khẩu)
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                  />
                </svg>
              ) : (
                // Icon Con mắt mở (Hiện mật khẩu)
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          )}
        </div>

        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
