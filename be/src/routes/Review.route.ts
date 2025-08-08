import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken, AuthRequest } from '../middleware/VerifyToken';

const router = express.Router();
const prisma = new PrismaClient();

// Get all reviews
router.get('/', async (req, res) => {
    const reviews = await prisma.review.findMany();
    res.json(reviews);
});

// Get review by ID
router.get('/:id', async (req, res) => {
    const review = await prisma.review.findUnique({
        where: { review_id: req.params.id }
    });
    res.json(review);
});

// Create Review (Chỉ cho phép nếu user đã mua model qua VND hoặc Blockchain)
router.post('/', verifyToken, async (req: AuthRequest, res) => {
    const { role } = req.user!;
    if (!req.user && role !== 'user') {
        res.status(401).json({ error: 'Unauthorized: Please login first' });
        return;
    }
    const { user_id, model_id, rating, comment } = req.body;

    try {
        // Kiểm tra đã mua bằng VNĐ chưa
        const hasPurchasedVND = await prisma.transaction_VND.findFirst({
            where: {
                buyer_id: user_id,
                model_id: model_id,
                status: 'completed'
            }
        });

        // Kiểm tra đã mua bằng Blockchain chưa
        const hasPurchasedBlockchain = await prisma.transaction_Blockchain.findFirst({
            where: {
                buyer_id: user_id,
                model_id: model_id,
                status: 'completed'
            }
        });

        if (!hasPurchasedVND && !hasPurchasedBlockchain) {
            res.status(403).json({ error: 'Bạn chưa mua model này, không thể đánh giá.' });
            return;
        }

        // Tạo review mới
        const newReview = await prisma.review.create({
            data: { user_id, model_id, rating, comment }
        });

        res.json(newReview);
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ error: err.message });
    }
});


// Update review
router.put('/:id', verifyToken, async (req: AuthRequest, res) => {
    const { user_id } = req.user!;
    if (user_id !== req.user?.user_id) {
        res.status(401).json({ error: 'you are not authorized to update this review' });
        return;
    }
    const { rating, comment } = req.body;
    const updated = await prisma.review.update({
        where: { review_id: req.params.id },
        data: { rating, comment }
    });
    res.json(updated);
});

// Delete review
router.delete('/:id', verifyToken, async (req: AuthRequest, res) => {
    const { user_id } = req.user!;
    if (user_id !== req.user?.user_id) {
        res.status(401).json({ error: 'you are not authorized to delete this review' });
        return;
    }
    try {
        await prisma.review.delete({
            where: { review_id: req.params.id }
        });
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }
});


export default router;
