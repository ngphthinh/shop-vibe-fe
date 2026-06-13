import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/common/Button";

type Props = {
  open: boolean;
  loading: boolean;
  onCancel: (reason: string) => void;
  onClose: () => void;
};

export const CancelOrderBox = ({ open, loading, onCancel, onClose }: Props) => {
  const { t } = useTranslation();
  const [reason, setReason] = useState("");

  if (!open) return null;

  return (
    <div className="mt-3 p-3 border border-red-100 bg-red-50 rounded-lg space-y-2">
      {/* LABEL */}
      <div className="text-xs text-red-600 font-medium">
        {t("orders.detail.cancelReason")}
      </div>

      {/* INPUT */}
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder={t("orders.detail.cancelReasonPlaceholder")}
        className="w-full text-sm p-2 border rounded-md outline-none focus:ring-1 focus:ring-red-400"
        rows={3}
      />

      {/* ACTIONS */}
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setReason("");
            onClose();
          }}>
          {t("common.cancel")}
        </Button>

        <Button
          size="sm"
          variant="error"
          disabled={!reason.trim() || loading}
          onClick={() => onCancel(reason)}>
          {loading
            ? t("orders.detail.cancelling")
            : t("orders.detail.confirmCancel")}
        </Button>
      </div>
    </div>
  );
};
