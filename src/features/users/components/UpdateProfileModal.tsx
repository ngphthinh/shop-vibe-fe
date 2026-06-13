import { useState } from "react";
import { Button } from "../../../components/common/Button";
import { useTranslation } from "react-i18next";
import {
  validateFullName,
  validatePhoneNumber,
} from "../../../utils/constants";
import { toast } from "react-toastify";
import { Input } from "../../../components/common/Input";
import { userService } from "../services/userService";

interface Props {
  open: boolean;
  profile: {
    fullName: string;
    email: string;
    phone: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

export const UpdateProfileModal = ({
  open,
  profile,
  onClose,
  onSuccess,
}: Props) => {
  const [fullName, setFullName] = useState(profile.fullName);
  const [phone, setPhone] = useState(profile.phone);

  const { t } = useTranslation("", { keyPrefix: "profile" });

  const [loading, setLoading] = useState<boolean>(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!validateFullName(fullName)) {
      toast.error(t("invalidFullName"));
      return;
    }
    if (!validatePhoneNumber(phone)) {
      toast.error(t("invalidPhone"));
      return;
    }

    try {
      setLoading(true);
      await userService.updateProfile({ fullName, phone });
      toast.success(t("updateSuccess"));
      onSuccess();
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t("updateError");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="font-semibold text-lg mb-4">{t("updateInfo")}</h2>

        <div className="space-y-3">
          <Input
            disabled={loading}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={t("fullNamePlaceholder")}
            className="w-full border rounded-lg p-2"
          />

          <Input
            disabled={loading}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t("phonePlaceholder")}
            className="w-full border rounded-lg p-2"
          />

          <Input
            disabled
            value={profile.email}
            className="w-full border rounded-lg p-2 bg-gray-100"
          />
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <Button variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>

          <Button onClick={handleSubmit} isLoading={loading}>
            {!loading ? t("saveChanges") : t("saving")}
          </Button>
        </div>
      </div>
    </div>
  );
};
