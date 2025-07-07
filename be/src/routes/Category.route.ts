import express from 'express';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const router = express.Router();
const prisma = new PrismaClient();

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await prisma.aI_Category.findMany();
        res.json(categories);
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ error: err.message });
    }
});

// Get category by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const category = await prisma.aI_Category.findUnique({
            where: { category_id: req.params.id }
        });
        if (!category) {
            res.status(404).json({ error: 'Category not found' });
            return;
        }
        res.json(category);
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ error: err.message });
    }
});

// Create category
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
        const newCategory = await prisma.aI_Category.create({
            data: { name }
        });
        res.json(newCategory);
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }
});

// Update category
router.put('/:id', async (req, res) => {
    try {
        const { name } = req.body;
        const updatedCategory = await prisma.aI_Category.update({
            where: { category_id: req.params.id },
            data: { name }
        });
        res.json(updatedCategory);
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }
});

// Delete category
router.delete('/:id', async (req, res) => {
    try {
        await prisma.aI_Category.delete({
            where: { category_id: req.params.id }
        });
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }
});

export default router;
