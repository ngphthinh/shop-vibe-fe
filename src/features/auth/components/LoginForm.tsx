import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "../../../components/common/Input";
import { Button } from "../../../components/common/Button";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { useDispatch } from "react-redux";
import { setTokens, setUser } from "../store/authSlice";
import { toast } from "react-toastify";

export const LoginForm: React.FC = () => {
  const { t } = useTranslation("", { keyPrefix: "auth.login" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      setLoading(true);

      const response = await authService.login({ email, password });

      dispatch(
        setTokens({
          refreshToken: response.refreshToken,
          accessToken: response.accessToken,
        }),
      );
      dispatch(
        setUser({
          email: response.user.email,
          role: response.user.roles.includes("ROLE_ADMIN")
            ? "ROLE_ADMIN"
            : response.user.roles[0],
          fullName: response.user.fullName,
        }),
      );
      toast.success(t("success"));
      setEmail("");
      setPassword("");
      navigate("/");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t("error.generic");
      console.log("error", errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin} className="space-y-4">
        {/* Gọi Input cực gọn kèm Đa ngôn ngữ */}
        <Input
          label={t("email")}
          type="email"
          placeholder={t("emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

        {/* Nút bấm tự xử lý trạng thái Loading xoay tròn */}
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={loading}>
          {t("submit")}
        </Button>
      </form>
      <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-100 mt-6">
        {t("noAccount")}{" "}
        <Link
          to="/register"
          className="text-slate-900 hover:underline font-bold transition-colors">
          {t("registerLink")}
        </Link>
      </div>
    </div>
  );
};
