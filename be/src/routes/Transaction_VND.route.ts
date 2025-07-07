import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all VND transactions
router.get('/', async (req, res) => {
    const transactions = await prisma.transaction_VND.findMany();
    res.json(transactions);
});

// Get VND transaction by ID
router.get('/:id', async (req, res) => {
    const transaction = await prisma.transaction_VND.findUnique({
        where: { id: req.params.id }
    });
    res.json(transaction);
});

// Create VND transaction
router.post('/', async (req, res) => {
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
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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
