import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all Blockchain transactions
router.get('/', async (req, res) => {
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

// Get Blockchain transaction by ID
router.get('/:id', async (req, res) => {
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
router.post('/', async (req, res) => {
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
