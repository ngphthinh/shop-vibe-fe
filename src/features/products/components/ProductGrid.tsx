import { useEffect, useState } from "react";
import type { PaginationResponse } from "../../../types/api.type";
import type { Product } from "../types/product.type";
import { useFetch } from "../../../hooks/useFetch";
import { productService } from "../services/productService";
import Loading from "../../../components/common/Loading";
import { ProductCard } from "./ProductCard";
import Pagination from "../../../components/common/Pagination";
import { useTranslation } from "react-i18next";

const filterOptions = [
  { label: "sort.newest", value: "newest" },
  { label: "sort.oldest", value: "oldest" },
  { label: "sort.priceAsc", value: "price_asc" },
  { label: "sort.priceDesc", value: "price_desc" },
];

const PAGE_SIZE = 12;
interface ProductGridProps {
  search?: string | null;
  category?: number | null;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  search,
  category,
}) => {
  const { t } = useTranslation("", { keyPrefix: "products" });
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [sort, setSort] = useState("sort.oldest");
  const [paginate, setPaginate] = useState<PaginationResponse<Product> | null>(
    null,
  );

  const { data, loading, refetch } = useFetch<PaginationResponse<Product>>(
    () =>
      search?.trim() || category
        ? productService.searchProducts(
            search ?? null,
            currentPage,
            PAGE_SIZE,
            sort,
            category ?? null,
          )
        : productService.getProducts(currentPage, PAGE_SIZE, sort),
  );

  useEffect(() => {
    if (data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPaginate(data);
      setPageCount(data.totalPages); // hoặc data.totalPages tuỳ backend
    }
  }, [data]);
  useEffect(() => {
    refetch();
  }, [currentPage, refetch, sort, search, category]);
  if (loading || !paginate) {
    return <Loading />;
  }

  if (!paginate?.content || paginate.content.length === 0) {
    return (
      <div className="text-center py-10 md:py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <p className="text-sm md:text-base text-gray-500">{t("noProducts")}</p>
      </div>
    );
  }
  return (
    <>
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 pb-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
            {t("productList")}
          </h1>
        </div>
        <div>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setCurrentPage(0);
            }}
            className="border rounded px-2 py-1 text-sm">
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {t(opt.label)}
              </option>
            ))}
          </select>
          <span className="text-xs md:text-sm text-gray-500 font-medium bg-gray-100 px-2.5 py-1 rounded-full self-start sm:self-auto">
            {t("searchResult", { count: paginate?.totalElements ?? 0 })}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
        {paginate.content.map((product) => {
          return <ProductCard key={product.id} product={product} />;
        })}
      </div>
      {pageCount > 1 && paginate.totalElements > 0 && (
        <Pagination
          pageCount={pageCount}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
};
