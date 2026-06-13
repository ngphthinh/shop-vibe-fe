import { Search } from "../../../components/common/Search";
import { Button } from "../../../components/common/Button";
import Loading from "../../../components/common/Loading";
import { SORT_OPTIONS, type SortOption } from "../types/product.type";
import { useCategories } from "../../../hooks/useCategory";
import { useTranslation } from "react-i18next";

interface Props {
  search: string;
  filterCategory?: string;
  sort: SortOption;
  onSearchChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onSortChange: (v: SortOption) => void;
  onClear: () => void;
}

const ProductFilters = ({
  search,
  filterCategory,
  sort,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onClear,
}: Props) => {
  const isFiltered = search || filterCategory || sort !== "newest";
  const { t } = useTranslation("", { keyPrefix: "products.admin" });

  const { data, isLoading } = useCategories();
  if (isLoading || !data) return <Loading />;

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-5 flex-wrap">
      <Search value={search} placeholder={t("searchPlaceholder")} onChange={onSearchChange} />

      <select
        value={filterCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
        <option value="">{t("categoriesAll")}</option>
        {data.map((cat) => (
          <optgroup key={cat.id} label={cat.name}>
            {cat.subCategories.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {t("sort." + o.label)}
          </option>
        ))}
      </select>

      {isFiltered && (
        <Button variant="save" size="sm" onClick={onClear}>
          {t("deleteFilter")}
        </Button>
      )}
    </div>
  );
};

export default ProductFilters;
