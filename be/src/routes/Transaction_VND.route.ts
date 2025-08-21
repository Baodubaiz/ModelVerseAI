import express from 'express';
import { PrismaClient, Role } from '@prisma/client';
import { verifyToken, AuthRequest } from '../middleware/VerifyToken';

const router = express.Router();
const prisma = new PrismaClient();

// Get all VND transactions
router.get('/', verifyToken, async (req: AuthRequest, res) => {
    if (!req.user) {
        res.status(401).json({ error: 'Unauthorized: Please log in first' });
        return;
    }
    const transactions = await prisma.transaction_VND.findMany();
    res.json(transactions);
});


/**
 * GET /api/transaction_vnd/user/:userId
 * Lấy danh sách giao dịch VNĐ của một user
*/
router.get("/user/:userId", verifyToken, async (req: AuthRequest, res) => {
    if (!req.user) {
        res.status(401).json({ error: "Unauthorized: Please login first" });
        return;
    }

    try {
        const { userId } = req.params;

        // Chỉ cho phép xem nếu là chính user hoặc admin
        if (req.user.user_id !== userId && req.user.role !== "admin") {
            res.status(403).json({ error: "Access denied" });
            return;
        }

        const transactions = await prisma.transaction_VND.findMany({
            where: { buyer_id: userId },
            include: {
                model: {
                    include: {
                        categories: { include: { category: true } },
                        user: true, // Chủ model
                    },
                },
                confirmation: true, // Xác nhận đơn hàng (nếu có)
            },
            orderBy: { created_at: "desc" },
        });

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// Get VND transaction by ID
router.get('/:id', verifyToken, async (req: AuthRequest, res) => {
    if (!req.user) {
        res.status(401).json({ error: 'Unauthorized: Please log in first' });
        return;
    }
    const transaction = await prisma.transaction_VND.findUnique({
        where: { id: req.params.id }
    });
    res.json(transaction);
});

// Create VND transaction
router.post('/', verifyToken, async (req: AuthRequest, res) => {
    if (!req.user) {
        res.status(401).json({ error: 'Unauthorized: Please log in first' });
        return;
    }
    const { buyer_id, model_id, amount_vnd, proof_image, status } = req.body;

    try {
        const transaction = await prisma.transaction_VND.create({
            data: { buyer_id, model_id, amount_vnd, proof_image, status }
        });
        res.json(transaction);
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }
});

// Update VND transaction
router.put('/:id', verifyToken, async (req: AuthRequest, res) => {
    const { user_id, role } = req.user!;
    if (req.user?.role !== 'admin') {
        res.status(401).json({ error: 'access denied' });
        return;
    }
    const { amount_vnd, proof_image, status } = req.body;

    try {
        const updated = await prisma.transaction_VND.update({
            where: { id: req.params.id },
            data: { amount_vnd, proof_image, status }
        });
        res.json(updated);
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }
});

// Delete VND transaction
router.delete('/:id', verifyToken, async (req: AuthRequest, res) => {
    const { user_id, role } = req.user!;
    if (req.user?.role !== 'admin') {
        res.status(401).json({ error: 'access denied' });
        return;
    }
    const transactionId = req.params.id;
    try {
        // Xóa Order_Confirmation nếu có
        await prisma.order_Confirmation.deleteMany({
            where: { transaction_id: transactionId }
        });

        // Xóa Transaction_VND
        await prisma.transaction_VND.delete({
            where: { id: transactionId }
        });

        res.json({ message: 'VND Transaction and related Order Confirmation deleted successfully' });
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }
});


export default router;
