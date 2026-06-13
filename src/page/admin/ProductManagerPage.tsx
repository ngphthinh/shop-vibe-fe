import { useState, useEffect } from "react";
import { Button } from "../../components/common/Button";
import DeleteModal from "../../features/products/components/DeleteModal";
import ProductModal from "../../features/products/components/ProductModal";
import ReviewModal from "../../features/products/components/ReviewModal";
import ProductTable from "../../features/products/components/ProductTable";
import Pagination from "../../components/common/Pagination";
import ProductFilters from "../../features/products/components/ProductFilter";
import type {
  Product,
  ProductForm,
  SortOption,
} from "../../features/products/types/product.type";
import { productService } from "../../features/products/services/productService";
import type { PaginationResponse } from "../../types/api.type";
import Loading from "../../components/common/Loading";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

type ModalType = "add" | "edit" | "delete" | "review" | null;

const ProductManagerPage = () => {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 15;

  const { t } = useTranslation("", { keyPrefix: "products.admin" });

  const [modal, setModal] = useState<ModalType>(null);
  const [selected, setSelected] = useState<Product | null>(null);

  const [paginate, setPaginate] = useState<PaginationResponse<Product> | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false); // Dùng để quản lý loading khi thêm/sửa/xóa

  const [fetchTrigger, setFetchTrigger] = useState(0);

  const refetch = () => setFetchTrigger((n) => n + 1);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const data =
          search.trim() || filterCategory.trim()
            ? await productService.searchProducts(
                search,
                currentPage,
                itemsPerPage,
                sort,
                filterCategory,
              )
            : await productService.getProducts(currentPage, itemsPerPage, sort);

        if (!cancelled) {
          setPaginate(data);
        }
        if (!cancelled) setPaginate(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [currentPage, sort, fetchTrigger, search, filterCategory]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(0);
  };

  const handleCategoryChange = (value: string) => {
    setFilterCategory(value);
    setCurrentPage(0);
  };

  const handleSortChange = (value: SortOption) => {
    setSort(value);
    setCurrentPage(0);
  };

  const handleClearFilters = () => {
    setSearch("");
    setFilterCategory("");
    setSort("newest");
    setCurrentPage(0);
  };

  const openModal = (type: ModalType, product: Product | null = null) => {
    setModal(type);
    setSelected(product);
  };

  const closeModal = () => {
    setModal(null);
    setSelected(null);
  };

  const handleSave = async (form: ProductForm, images: File[]) => {
    try {
      setLoadingAction(true);

      if (modal === "add") {
        await productService.createProduct(form, images);

        toast.success(t("message.created"));
      }

      if (modal === "edit" && selected) {
        await productService.updateProductById(selected.id, form, images);

        toast.success(t("message.updated"));
      }

      closeModal();

      refetch();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save product";
      toast.error(errorMessage);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;

    if (modal !== "delete") {
      return;
    }

    try {
      setLoadingAction(true);

      await productService.deleteProductById(selected.id);

      toast.success(t("message.deleted"));
      closeModal();
      refetch();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete product";
      toast.error(errorMessage);
    } finally {
      setLoadingAction(false);
    }
  };

  if (loading || !paginate) return <Loading />;

  const totalCount = paginate.totalElements;
  const pageCount = paginate.totalPages;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {t("title")}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {t("totalProduct", { count: totalCount })}
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => openModal("add")}>
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
            {t("createProduct")}
          </Button>
        </div>

        <ProductFilters
          search={search}
          filterCategory={filterCategory}
          sort={sort}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
          onClear={handleClearFilters}
        />

        <div className={loading ? "opacity-50 pointer-events-none" : ""}>
          <ProductTable
            products={paginate.content}
            onEdit={(p) => openModal("edit", p)}
            onDelete={(p) => openModal("delete", p)}
            onReview={(p) => openModal("review", p)}
          />

          <Pagination
            pageCount={pageCount}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {(modal === "add" || modal === "edit") && (
        <ProductModal
          loading={loadingAction}
          product={modal === "edit" ? selected : null}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
      {modal === "delete" && selected && (
        <DeleteModal
          product={selected}
          onClose={closeModal}
          onConfirm={handleDelete}
        />
      )}
      {modal === "review" && selected && (
        <ReviewModal product={selected} onClose={closeModal} />
      )}
    </div>
  );
};

export default ProductManagerPage;
