import { useState } from "react";
import { Search } from "../../components/common/Search";
import CategoryListTree from "../../features/categories/components/CetegoryListTree";
import { ProductGrid } from "../../features/products/components/ProductGrid";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { t } = useTranslation("");

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50/50 px-4 py-6 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Left Side: Sidebar / Category Container */}
        <aside className="w-full md:w-[280px] lg:w-[300px] shrink-0">
          <CategoryListTree onSelect={setSelectedCategory} />
        </aside>

        {/* Right Side: Product Grid Display */}
        <main className="flex-1 min-w-0">
          <Search
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={t("products.searchPlaceholder")}></Search>

          <ProductGrid search={searchTerm} category={selectedCategory} />
        </main>
      </div>
    </div>
  );
};

export default HomePage;
