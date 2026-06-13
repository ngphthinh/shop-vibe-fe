import { useTranslation } from "react-i18next";
import { useCategories } from "../../../hooks/useCategory";
import Loading from "../../../components/common/Loading";

const CategorySelect = ({
  disabled,
  value,
  onChange,
}: {
  disabled?: boolean;
  value: string;
  onChange: (v: string) => void;
}) => {
  const { t } = useTranslation("", {
    keyPrefix: "products.admin.form",
  });

  const { data: categories, isLoading } = useCategories();
  if (isLoading || !categories) return <Loading />;
  return (
    <select
      disabled={disabled}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
      <option value="">-- {t("categoryPlaceholder")} --</option>
      {categories.map((cat) => (
        <optgroup key={cat.id} label={cat.name}>
          {cat.subCategories.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
};

export default CategorySelect;
