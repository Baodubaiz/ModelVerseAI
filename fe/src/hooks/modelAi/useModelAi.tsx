import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createModel,
    getModels,
    getModelById,
    updateModel,
    deleteModel,
    getModelByUserId,
    getModelsByCategoryId,
} from "@/services/AIModelService";
import { AI_Model } from "@/types";

// 1. Lấy tất cả models
export const useModels = () => {
    return useQuery({
        queryKey: ["models"],
        queryFn: async () => {
            const res = await getModels();
            return res.data as AI_Model[];
        },
    });
};

// 2. Lấy model theo id
export const useModel = (id: string) => {
    return useQuery({
        queryKey: ["models", id],
        queryFn: async () => {
            const res = await getModelById(id);
            return res.data as AI_Model;
        },
        enabled: !!id,
    });
};

// 3. Lấy models theo userId
export const useModelsByUser = (userId: string) => {
    return useQuery({
        queryKey: ["models", "user", userId],
        queryFn: async () => {
            const res = await getModelByUserId(userId);
            return res.data as AI_Model[];
        },
        enabled: !!userId,
    });
};

// 4. Lấy models theo categoryId
export const useModelsByCategory = (categoryId: string) => {
    return useQuery({
        queryKey: ["models", "category", categoryId],
        queryFn: async () => {
            const res = await getModelsByCategoryId(categoryId);
            return res.data as AI_Model[];
        },
        enabled: !!categoryId,
    });
};

// 5. Tạo model
export const useCreateModel = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createModel,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["models"] });
        },
    });
};

// 6. Cập nhật model
export const useUpdateModel = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<AI_Model> }) =>
            updateModel(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["models"] });
            queryClient.invalidateQueries({ queryKey: ["models", variables.id] });
        },
    });
};

// 7. Xoá model
export const useDeleteModel = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteModel,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["models"] });
        },
    });
};
