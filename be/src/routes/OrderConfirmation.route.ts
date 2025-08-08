import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken, AuthRequest } from '../middleware/VerifyToken';

const router = express.Router();
const prisma = new PrismaClient();

// Create confirmation
router.post('/', verifyToken, async (req: AuthRequest, res) => {
    if (!req.user) {
        res.status(401).json({ error: 'Unauthorized: Please login first' });
        return;
    }
    const { transaction_id, dev_id, status } = req.body;

    try {
        const newConfirm = await prisma.order_Confirmation.create({
            data: { transaction_id, dev_id, status }
        });
        res.json(newConfirm);
    } catch (err) {
        res.status(400).json({ error: 'Create failed', detail: err });
    }
});

// Update confirmation status
router.put('/:id', async (req, res) => {
    const { status } = req.body;
    try {
        const updated = await prisma.order_Confirmation.update({
            where: { confirm_id: req.params.id },
            data: { status }
        });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: 'Update failed', detail: err });
    }
});

// Get all confirmations
router.get('/', async (req, res) => {
    try {
        const confirms = await prisma.order_Confirmation.findMany();
        res.json(confirms);
    } catch (err) {
        res.status(400).json({ error: 'Get all failed', detail: err });
    }
});

// Get one confirmation
router.get('/:id', async (req, res) => {
    try {
        const confirm = await prisma.order_Confirmation.findUnique({
            where: { confirm_id: req.params.id }
        });
        if (!confirm) {
            res.status(404).json({ message: 'Not found' });
            return;
        }

        res.json(confirm);
    } catch (err) {
        res.status(400).json({ error: 'Get failed', detail: err });
    }
});

export default router;
