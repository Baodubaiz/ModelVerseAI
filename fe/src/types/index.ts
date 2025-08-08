// src/types/index.ts

export type Role = "user" | "dev" | "admin";
export type PaymentMethod = "VND" | "ETH";
export type PaymentStatus = "pending" | "completed" | "failed";
export type ConfirmStatus = "waiting" | "confirmed" | "rejected";

export interface User {
    user_id: string;
    wallet_address?: string;
    email?: string;
    password?: string;
    full_name?: string;
    phone_number?: string;
    bank_account?: string;
    bank_name?: string;
    role: Role;
}

export interface Category {
    category_id: string;
    name: string;
    description: string;
}

export interface AI_Model {
    model_id: string;
    user_id: string;
    category_id: string;
    name: string;
    description: string;
    file_path: string;
    price_vnd: number;
    price_eth: number;
    input_type: string;
    output_type: string;
    created_at: string;
    user?: User;
    category?: Category;
}

export interface Transaction_VND {
    id: string;
    buyer_id: string;
    model_id: string;
    amount_vnd: number;
    proof_image?: string;
    status: PaymentStatus;
    created_at: string;
}

export interface Transaction_Blockchain {
    id: string;
    buyer_id: string;
    model_id: string;
    amount_eth: number;
    transaction_hash: string;
    status: PaymentStatus;
    created_at: string;
}

export interface Review {
    review_id: string;
    model_id: string;
    user_id: string;
    rating: number;
    comment: string;
    created_at: string;
}

export interface Demo_Usage {
    demo_id: string;
    model_id: string;
    user_id: string;
    input_file: string;
    output_file: string;
    created_at: string;
}


// Định nghĩa kiểu dữ liệu gửi lên khi login
export interface LoginInput {
    email: string;
    password: string;
}

// Định nghĩa kiểu dữ liệu gửi lên khi đăng ký
export interface RegisterInput {
    email: string;
    password: string;
    full_name: string;
    role: string;
    wallet_address?: string | null;     // optional nếu có thể null
    phone_number: string;
    bank_account: string;
    bank_name: string;
}
