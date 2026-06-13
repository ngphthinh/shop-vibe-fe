import { CategoryTree } from "./CategoryTree";
import Loading from "../../../components/common/Loading";
import { useTranslation } from "react-i18next";
import { useCategories } from "../../../hooks/useCategory";

interface Props {
  onSelect: (id: number) => void;
}

const CategoryListTree: React.FC<Props> = ({ onSelect }) => {
  const { t } = useTranslation("", { keyPrefix: "categories" });

  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return <Loading />;
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-10 md:py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <p className="text-sm md:text-base text-gray-500">
          {t("noCategories")}
        </p>
      </div>
    );
  }

  const handleSelect = (id: number, isSub: boolean) => {
    if (isSub) {
      onSelect(id);
    }
  };
  return (
    <div>
      <h2 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4 tracking-tight">
        {t("all")}
      </h2>
      {/* Responsive Layout for Categories: Stacks single on mobile, 2-columns on tablets, vertical block on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-col gap-3">
        {categories.map((cat) => (
          <CategoryTree
            key={cat.id}
            categoryTree={cat}
            onSelectCategory={handleSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryListTree;
