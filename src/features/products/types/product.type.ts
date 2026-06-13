import type { Category } from "../../categories/types/category.type";
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stockQuantity: number;
  primaryImageUrl: string;
  category: Category;
  averageRating: number;
  totalReviews: number;
  images?: string[];
}

export interface ProductCardProps {
  product: Product;
}


export interface Image {
  id: number;
  imageUrl: string;
}

export interface ProductDetail {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stockQuantity: number;
  primaryImageUrl: string;
  imageUrls: Image[];
  category: Category;
  averageRating: number;
  totalReviews: number;
}

export interface ProductForm {
  name: string;
  description: string;
  price: string;
  stockQuantity: string;
  categoryId: string;
}

export type SortOption = "newest" | "oldest" | "price_asc" | "price_desc";
export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "newest" },
  { value: "oldest", label: "oldest" },
  { value: "price_asc", label: "priceAsc" },
  { value: "price_desc", label: "priceDesc" },
];
