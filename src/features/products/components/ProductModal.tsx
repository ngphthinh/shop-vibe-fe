import { useState } from "react";
import type { Product, ProductForm } from "../types/product.type";
import { EMPTY_FORM } from "../services/constants";
import ImageUploader from "./ImageUploader";
import CategorySelect from "./CategorySelect";
import { Button } from "../../../components/common/Button";
import { Input } from "../../../components/common/Input";
import { useTranslation } from "react-i18next";

const ProductModal = ({
  product,
  loading,
  onClose,
  onSave,
}: {
  product: Product | null;
  loading?: boolean;
  onClose: () => void;
  onSave: (
    form: ProductForm,
    images: File[],
    existingImageUrl: string | null,
  ) => void;
}) => {
  const isEdit = !!product;
  const [form, setForm] = useState<ProductForm>(
    product
      ? {
          name: product.name,
          description: product.description,
          price: String(product.price),
          stockQuantity: String(product.stockQuantity),
          categoryId: String(product.category.id),
        }
      : EMPTY_FORM,
  );

  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(
    product?.primaryImageUrl ?? null,
  );
  const [images, setImages] = useState<File[]>([]);

  const { t } = useTranslation("", { keyPrefix: "products.admin" });
  const [errors, setErrors] = useState<Partial<ProductForm>>({});
  const [imageError, setImageError] = useState("");
  const set =
    (k: keyof ProductForm) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e: Partial<ProductForm> = {};
    if (!form.name.trim()) e.name = t("errors.nameRequired");
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      e.price = t("errors.priceInvalid");
    if (
      !form.stockQuantity ||
      isNaN(Number(form.stockQuantity)) ||
      Number(form.stockQuantity) < 0
    )
      e.stockQuantity = t("errors.stockInvalid");
    if (!form.categoryId) e.categoryId = t("errors.categoryRequired");
    setErrors(e);
    if (!existingImageUrl && images.length === 0) {
      setImageError(t("errors.imageRequired"));
      return false;
    }
    if (images.length > 5) {
      setImageError(t("errors.imageLimit"));
    }

    setImageError("");
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSave(form, images, existingImageUrl);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            {isEdit ? t("editProductLabel") : t("addNew")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="close">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {t("form.name")} <span className="text-red-500">*</span>
            </label>
            <Input
              disabled={loading}
              value={form.name}
              onChange={set("name")}
              placeholder={t("form.namePlaceholder")}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {t("form.description")}
            </label>
            <textarea
              disabled={loading}
              value={form.description}
              onChange={set("description")}
              rows={3}
              placeholder={t("form.descriptionPlaceholder")}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t("form.price")} <span className="text-red-500">*</span>
              </label>
              <Input
                disabled={loading}
                value={form.price}
                onChange={set("price")}
                type="number"
                min="0"
                placeholder={t("form.pricePlaceholder")}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.price && (
                <p className="text-xs text-red-500 mt-1">{errors.price}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t("form.stock")} <span className="text-red-500">*</span>
              </label>
              <Input
                disabled={loading}
                value={form.stockQuantity}
                onChange={set("stockQuantity")}
                type="number"
                min="0"
                placeholder={t("form.stockPlaceholder")}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.stockQuantity && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.stockQuantity}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {t("form.category")} <span className="text-red-500">*</span>
            </label>
            <CategorySelect
              disabled={loading}
              value={form.categoryId}
              onChange={(v) => setForm((f) => ({ ...f, categoryId: v }))}
            />
            {errors.categoryId && (
              <p className="text-xs text-red-500 mt-1">{errors.categoryId}</p>
            )}
          </div>

          {/* Images */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              {t("form.images")} <span className="text-red-500">*</span>
            </label>

            {existingImageUrl && (
              <div className="relative inline-block mb-2">
                <img
                  src={existingImageUrl}
                  alt="Existing product"
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => setExistingImageUrl(null)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                  aria-label="Remove existing image">
                  ×
                </button>
              </div>
            )}

            {/* ✅ Upload ảnh mới */}
            <ImageUploader
              disabled={loading}
              images={images}
              onAdd={(files) => setImages((prev) => [...prev, ...files])}
              onRemove={(i) =>
                setImages((prev) => prev.filter((_, idx) => idx !== i))
              }
            />
            {imageError && (
              <p className="text-xs text-red-500 mt-1">{imageError}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <Button variant="secondary" onClick={onClose}>
            {t("form.cancel")}
          </Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={loading}>
            {t("form.saveProduct")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
