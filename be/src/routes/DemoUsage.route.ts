import express from 'express';
import { PrismaClient, Role } from '@prisma/client';
import { verifyToken, AuthRequest } from '../middleware/VerifyToken';

const router = express.Router();
const prisma = new PrismaClient();

// Get all demos
router.get('/', verifyToken, async (req: AuthRequest, res) => {
    if (!req.user) {
        res.status(401).json({ error: 'Unauthorized: Please login first' });
        return;
    }
    const demos = await prisma.demo_Usage.findMany();
    res.json(demos);
});

// Get demo by ID
router.get('/:id', verifyToken, async (req: AuthRequest, res) => {
    if (!req.user) {
        res.status(401).json({ error: 'Unauthorized: Please login first' });
        return;
    }
    const demo = await prisma.demo_Usage.findUnique({
        where: { demo_id: req.params.id }
    });
    res.json(demo);
});



/* GET /api/demousage/user/:userId */
router.get("/user/:userId", verifyToken, async (req: AuthRequest, res) => {
    if (!req.user) {
        res.status(401).json({ error: "Unauthorized: Please login first" });
        return;
    }

    try {
        const { userId } = req.params;

        // Nếu muốn giới hạn: chỉ cho user tự xem hoặc admin
        if (req.user.user_id !== userId && req.user.role !== "admin") {
            res.status(403).json({ error: "Access denied" });
            return;
        }

        const usages = await prisma.demo_Usage.findMany({
            where: { user_id: userId },
            include: {
                model: {
                    include: {
                        categories: { include: { category: true } },
                        user: true,
                    },
                },
            },
            orderBy: { created_at: "desc" },
        });

        res.json(usages);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});


// Create demo
router.post('/', verifyToken, async (req: AuthRequest, res) => {
    if (!req.user) {
        res.status(401).json({ error: 'Unauthorized: Please login first' });
        return;
    }
    const { model_id, user_id, input_file, output_file } = req.body;
    const newDemo = await prisma.demo_Usage.create({
        data: { model_id, user_id, input_file, output_file }
    });
    res.json(newDemo);
});

// Update demo
router.put('/:id', verifyToken, async (req: AuthRequest, res) => {
    const { role } = req.user!;
    if (role !== 'admin') {
        res.status(401).json({ error: 'access denied' });
        return;
    }
    const { input_file, output_file } = req.body;
    const updated = await prisma.demo_Usage.update({
        where: { demo_id: req.params.id },
        data: { input_file, output_file }
    });
    res.json(updated);
});

// Delete demo
router.delete('/:id', verifyToken, async (req: AuthRequest, res) => {
    const { role } = req.user!;
    if (role !== 'admin') {
        res.status(401).json({ error: 'access denied' });
        return;
    }
    try {
        await prisma.demo_Usage.delete({
            where: { demo_id: req.params.id }
        });
        res.json({ message: 'Demo Usage deleted successfully' });
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }
});


export default router;
