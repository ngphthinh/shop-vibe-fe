// import { useMutation } from "@tanstack/react-query";
// import { queryClient } from "../../../lib/queryClient";
// import { categoryService } from "./categoryService";

// const createCategoryMutation = useMutation({
//   mutationFn: categoryService.createCategory,
//   onSuccess: () => {
//     queryClient.invalidateQueries({
//       queryKey: ["categories"],
//     });
//   },
// });

// const handleSave = async (form: CategoryForm) => {
//   await createCategoryMutation.mutateAsync(form);

//   toast.success("Tạo danh mục thành công");
//   closeModal();
// };

// const updateCategoryMutation = useMutation({
//   mutationFn: categoryService.updateCategory,
//   onSuccess: () => {
//     queryClient.invalidateQueries({
//       queryKey: ["categories"],
//     });
//   },
// });

// const deleteCategoryMutation = useMutation({
//   mutationFn: categoryService.deleteCategory,
//   onSuccess: () => {
//     queryClient.invalidateQueries({
//       queryKey: ["categories"],
//     });
//   },
// });