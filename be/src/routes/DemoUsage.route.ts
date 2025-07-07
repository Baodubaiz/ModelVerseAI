import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all demos
router.get('/', async (req, res) => {
    const demos = await prisma.demo_Usage.findMany();
    res.json(demos);
});

// Get demo by ID
router.get('/:id', async (req, res) => {
    const demo = await prisma.demo_Usage.findUnique({
        where: { demo_id: req.params.id }
    });
    res.json(demo);
});

// Create demo
router.post('/', async (req, res) => {
    const { model_id, user_id, input_file, output_file } = req.body;
    const newDemo = await prisma.demo_Usage.create({
        data: { model_id, user_id, input_file, output_file }
    });
    res.json(newDemo);
});

// Update demo
router.put('/:id', async (req, res) => {
    const { input_file, output_file } = req.body;
    const updated = await prisma.demo_Usage.update({
        where: { demo_id: req.params.id },
        data: { input_file, output_file }
    });
    res.json(updated);
});

// Delete demo
router.delete('/:id', async (req, res) => {
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
