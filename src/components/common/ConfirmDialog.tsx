import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./Button";

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = "Confirm",
  message = "Are you sure?",
  onConfirm,
  onCancel,
  loading,
}) => {
  const { t } = useTranslation();
  if (!open) return null;

  
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-md p-4 w-[300px] space-y-3">
        <h3 className="font-medium text-sm">{title}</h3>
        <p className="text-xs text-gray-600">{message}</p>

        <div className="flex justify-end gap-2">
          <Button onClick={onCancel} size="sx" variant="cancel_outline">
            {t("common.cancel")}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            isLoading={loading}
            size="sx"
            variant="error">
            {t("common.confirm")}
          </Button>
        </div>
      </div>
    </div>
  );
};
