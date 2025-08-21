import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
} from "@/services/categoryService";
import { Category } from "@/types";

// 1. Lấy danh sách categories
export const useCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await getCategories();
            return res.data as Category[];
        },
    });
};

// 2. Lấy chi tiết 1 category
export const useCategory = (id: string) => {
    return useQuery({
        queryKey: ["categories", id],
        queryFn: async () => {
            const res = await getCategoryById(id);
            return res.data as Category;
        },
        enabled: !!id, // chỉ chạy khi có id
    });
};

// 3. Tạo mới category
export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
};

// 4. Cập nhật category
export const useUpdateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
            updateCategory(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["categories", variables.id] });
        },
    });
};

// 5. Xoá category
export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
};
