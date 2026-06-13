import React, { useState } from "react";
import type { CategoryTreeProps } from "../types/category.type";

export const CategoryTree: React.FC<CategoryTreeProps> = ({
  categoryTree,
  onSelectCategory,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full lg:w-[280px] shrink-0 bg-white rounded-lg border border-gray-200 shadow-sm p-3">
      {/* Header Container */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 gap-2">
        {/* Left Side: Parent Category Selection */}
        <button
          onClick={() => {
            onSelectCategory?.(categoryTree.id, false);
            setExpanded((prev) => !prev); // Toggle dropdown on parent click as well
          }}
          className="flex items-center gap-2 text-base sm:text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors text-left min-w-0 flex-1 group"
          aria-label={`Select ${categoryTree.name}`}>
          <span className="w-1 h-4 bg-gray-800 rounded-full shrink-0 group-hover:bg-gray-500 transition-colors"></span>
          <span className="truncate">{categoryTree.name}</span>
        </button>

        {/* Right Side: Toggle Dropdown Button */}
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="flex items-center justify-center w-8 h-8 text-lg sm:text-base text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors shrink-0"
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse categories" : "Expand categories"}>
          {expanded ? "−" : "+"}
        </button>
      </div>

      {/* Subcategories List */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          expanded
            ? "max-h-[400px] opacity-100 overflow-y-auto"
            : "max-h-0 opacity-0"
        }`}>
        <ul className="space-y-1 pr-1">
          {" "}
          {/* Added minor right padding for scrollbar aesthetics */}
          {categoryTree.subCategories.map((sub) => (
            <li key={sub.id}>
              <button
                onClick={() => onSelectCategory?.(sub.id, true)}
                className="w-full flex items-center justify-between px-3 py-2.5 sm:py-2 text-sm sm:text-xs text-left text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-all group">
                <span className="truncate mr-2">{sub.name}</span>
                <span className="opacity-0 group-hover:opacity-100 md:group-hover:opacity-100 transition-opacity text-xs text-gray-400 shrink-0">
                  ➜
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
