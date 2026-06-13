import { useRef } from "react";
import { useTranslation } from "react-i18next";

const ImageUploader = ({
  disabled,
  images,
  onAdd,
  onRemove,
}: {
  disabled?: boolean;
  images: File[];
  onAdd: (files: File[]) => void;
  onRemove: (i: number) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    onAdd(Array.from(files));
  };
  const { t } = useTranslation("", { keyPrefix: "products.admin.form" });
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {images.map((file, i) => (
          <div
            key={i}
            className="relative group w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
            <img
              src={URL.createObjectURL(file)}
              alt={`preview-${i}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
              aria-label="Xóa hình">
              <svg
                className="w-5 h-5 text-white"
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
            {i === 0 && (
              <span className="absolute bottom-0 left-0 right-0 text-[9px] text-center bg-blue-600 text-white py-0.5">
                Chính
              </span>
            )}
          </div>
        ))}
        <button
          disabled={disabled}
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors">
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span className="text-[10px]">{t("addImage")}</span>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="text-[11px] text-gray-400">{t("imagesHint")}</p>
    </div>
  );
};

export default ImageUploader;
