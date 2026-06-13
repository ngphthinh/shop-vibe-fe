interface Props {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const getPageRange = (current: number, total: number): (number | "...")[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);

  const pages: (number | "...")[] = [0];

  if (current > 3) pages.push("...");

  const start = Math.max(1, current - 1);
  const end = Math.min(total - 2, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 4) pages.push("...");

  pages.push(total - 1);
  return pages;
};

const Pagination = ({ pageCount, currentPage, onPageChange }: Props) => {
  if (pageCount <= 1) return null;

  const pages = getPageRange(currentPage, pageCount);

  return (
    <div className="flex items-center gap-1 justify-center mt-4">
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Trang trước">
        ←
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="px-2 py-1.5 text-sm text-gray-400 select-none">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={p === currentPage ? "page" : undefined}
            className={`min-w-[34px] px-3 py-1.5 text-sm border rounded-lg transition-colors ${
              p === currentPage
                ? "bg-gray-800 text-white border-gray-800 font-medium"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}>
            {p + 1}
          </button>
        ),
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === pageCount - 1}
        className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Trang sau">
        →
      </button>
    </div>
  );
};

export default Pagination;
