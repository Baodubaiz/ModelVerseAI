import express from 'express';
import { PrismaClient } from '@prisma/client';

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
router.post('/', async (req, res) => {
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
router.put('/:id', async (req, res) => {
    const { rating, comment } = req.body;
    const updated = await prisma.review.update({
        where: { review_id: req.params.id },
        data: { rating, comment }
    });
    res.json(updated);
});

// Delete review
router.delete('/:id', async (req, res) => {
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
