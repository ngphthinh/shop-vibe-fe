export interface Category {
  id: number;
  name: string;
}
export interface CategoryTreeData {
  id: number;
  name: string;
  subCategories: Category[];
}

// export interface CategoryListItemProps {
//   Categories: CategoryTreeData[];
// }

export interface CategoryTreeProps {
  categoryTree: CategoryTreeData;
  onSelectCategory?: (id: number, isSub: boolean) => void;
}

