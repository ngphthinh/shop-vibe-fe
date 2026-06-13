import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../../components/common/Input";
import { Button } from "../../../components/common/Button";
import {
  validateConfirmPassword,
  validateEmail,
  validateFullName,
  validatePassword,
} from "../../../utils/constants";
import { authService } from "../services/authService";
import { toast } from "react-toastify";

const RegisterForm: React.FC = () => {
  const { t } = useTranslation("", { keyPrefix: "auth.register" });

  // State quản lý dữ liệu form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // State mới cho confirm password

  // Trạng thái hệ thống
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateFullName(fullName)) {
      setErrorMessage(t("error.invalidFullName"));
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage(t("error.invalidEmail"));
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage(t("error.weakPassword"));
      return;
    }

    // 1. Kiểm tra logic so khớp mật khẩu ngay tại Client
    if (!validateConfirmPassword(password, confirmPassword)) {
      setErrorMessage(t("error.passwordMismatch")); // Hiển thị: Passwords do not match
      return; // Chặn không cho chạy tiếp xuống phần gọi API
    }

    setLoading(true);

    try {
      // Giả lập gọi API đăng ký (Chờ 1.5 giây)
      await authService.register({ fullName, email, phone, password });

      // Thông báo thành công
      toast.success(t("success"));

      // Xóa sạch dữ liệu form sau khi đăng ký thành công (Tùy chọn)
      setFullName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      navigate("/login"); // Điều hướng về trang đăng nhập sau khi đăng ký thành công
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t("error.generic");
      setErrorMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tiêu đề trang */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          {t("title")}
        </h2>
        <p className="text-xs text-slate-400 mt-1">{t("subtitle")}</p>
      </div>

      {/* Thông báo lỗi */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-lg flex items-center">
          <svg
            className="w-4 h-4 mr-2 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          {errorMessage}
        </div>
      )}

      {/* Form Đăng ký */}
      <form onSubmit={handleRegister} className="space-y-4">
        <Input
          label={t("fullName")}
          type="text"
          placeholder={t("fullNamePlaceholder")}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <Input
          label={t("email")}
          type="email"
          placeholder={t("emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label={t("phone")}
          type="tel"
          placeholder={t("phonePlaceholder")}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <Input
          label={t("password")}
          type="password"
          placeholder={t("passwordPlaceholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Trường Xác nhận mật khẩu mới bổ sung (Tự động có icon mắt ẩn/hiện) */}
        <Input
          label={t("confirmPassword")}
          type="password"
          placeholder={t("confirmPasswordPlaceholder")}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          variant="primary"
          className="mt-2"
          isLoading={loading}>
          {t("submit")}
        </Button>
      </form>

      {/* Điều hướng quay lại Đăng nhập */}
      <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
        {t("hasAccount")}{" "}
        <Link to="/login" className="text-slate-900 hover:underline font-bold">
          {t("loginLink")}
        </Link>
      </div>
    </div>
  );
};
export default RegisterForm;
