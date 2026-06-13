import { useState } from "react";
import { Button } from "../../../components/common/Button";
import { useTranslation } from "react-i18next";
import { Input } from "../../../components/common/Input";
import { toast } from "react-toastify";
import { validatePassword } from "../../../utils/constants";
import { authService } from "../../auth/services/authService";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const ChangePasswordModal = ({ open, onClose }: Props) => {
  const { t } = useTranslation("", { keyPrefix: "profile.changePassword" });
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!validatePassword(newPassword)) {
      toast.error(t("error.invalidNewPassword"));
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(t("error.invalidConfirmPassword"));
      return;
    }
    try {
      setLoading(true);

      await authService.changePassword({ oldPassword, newPassword });

      toast.success(t("success"));
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t("error.generic");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }

    // await authService.changePassword(...)
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="font-semibold text-lg mb-4">{t("title")}</h2>

        <div className="space-y-3">
          <Input
            type="password"
            disabled={loading}
            placeholder={t("oldPasswordPlaceholder")}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full border rounded-lg p-2"
          />

          <Input
            type="password"
            placeholder={t("newPasswordPlaceholder")}
            value={newPassword}
            disabled={loading}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border rounded-lg p-2"
          />

          <Input
            type="password"
            placeholder={t("confirmNewPasswordPlaceholder")}
            disabled={loading}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <Button variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>

          <Button isLoading={loading} onClick={handleSubmit}>
            {t("submit")}
          </Button>
        </div>
      </div>
    </div>
  );
};
