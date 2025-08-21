import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken, AuthRequest } from '../middleware/VerifyToken';

const router = express.Router();
const prisma = new PrismaClient();

// Get all Blockchain transactions
router.get('/', verifyToken, async (req: AuthRequest, res) => {
    if (!req.user) {
        res.status(401).json({ error: 'Unauthorized: Please log in first' });
        return;
    }
    try {
        const transactions = await prisma.transaction_Blockchain.findMany({
            include: {
                buyer: true,
                model: true
            }
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

/**
 * GET /api/transaction_blockchain/user/:userId
 * Lấy danh sách giao dịch blockchain của một user
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

        const transactions = await prisma.transaction_Blockchain.findMany({
            where: { buyer_id: userId },
            include: {
                model: {
                    include: {
                        categories: { include: { category: true } },
                        user: true, // Chủ model
                    },
                },
            },
            orderBy: { created_at: "desc" },
        });

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});


// Get Blockchain transaction by ID
router.get('/:id', verifyToken, async (req: AuthRequest, res) => {
    if (!req.user) {
        res.status(401).json({ error: 'Unauthorized: Please log in first' });
        return;
    }
    try {
        const transaction = await prisma.transaction_Blockchain.findUnique({
            where: { id: req.params.id },
            include: {
                buyer: true,
                model: true
            }
        });

        if (!transaction) {
            res.status(404).json({ message: 'Transaction not found' });
            return;
        }

        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch transaction' });
    }
});

// Create Blockchain transaction
router.post('/', verifyToken, async (req: AuthRequest, res) => {
    if (!req.user) {
        res.status(401).json({ error: 'Unauthorized: Please log in first' });
        return;
    }
    const { buyer_id, model_id, amount_eth, transaction_hash, status } = req.body;

    if (!buyer_id || !model_id || !amount_eth || !transaction_hash || !status) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    try {
        const transaction = await prisma.transaction_Blockchain.create({
            data: { buyer_id, model_id, amount_eth, transaction_hash, status }
        });
        res.json(transaction);
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }
});

// Update Blockchain transaction
router.put('/:id', async (req, res) => {
    const { amount_eth, transaction_hash, status } = req.body;

    try {
        const updated = await prisma.transaction_Blockchain.update({
            where: { id: req.params.id },
            data: { amount_eth, transaction_hash, status }
        });
        res.json(updated);
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }
});

// Delete Blockchain transaction
router.delete('/:id', async (req, res) => {
    try {
        await prisma.transaction_Blockchain.delete({
            where: { id: req.params.id }
        });
        res.json({ message: 'Blockchain Transaction deleted successfully' });
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }
});

export default router;
