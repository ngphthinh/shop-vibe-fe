import { useTranslation } from "react-i18next";
import { Button } from "../../../components/common/Button";
import type { Product } from "../types/product.type";

const DeleteModal = ({
  product,
  onClose,
  onConfirm,
}: {
  product: Product;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const { t } = useTranslation("", { keyPrefix: "products.admin" });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mx-auto mb-4">
          <svg
            className="w-6 h-6 text-red-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
        </div>
        <h3 className="text-center text-base font-semibold text-gray-900 mb-1">
          {t("deleteConfirm", { name: product.name })}
        </h3>
        <p className="text-center text-sm text-gray-500 mb-5">
          {t("deleteForm.title")}{" "}
          <span className="font-medium text-gray-700">"{product.name}"</span>?
          {t("deleteForm.message")}
        </p>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1 justify-center">
            {t("form.cancel")}
          </Button>
          <Button
            variant="error"
            onClick={onConfirm}
            className="flex-1 justify-center">
            {t("deleteProduct")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
