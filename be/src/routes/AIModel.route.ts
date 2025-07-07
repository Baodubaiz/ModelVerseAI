import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all AI Models
router.get('/', async (req, res) => {
    try {
        const models = await prisma.aI_Model.findMany({
            include: {
                categories: {
                    include: { category: true } // Lấy thông tin chi tiết category
                },
                user: true // Lấy thông tin user tạo model
            }
        });
        res.json(models);
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ error: err.message });
    }
});

// Get AI Model by ID
router.get('/:id', async (req, res) => {
    try {
        const model = await prisma.aI_Model.findUnique({
            where: { model_id: req.params.id },
            include: {
                categories: {
                    include: { category: true } // Lấy chi tiết category
                },
                user: true // Lấy thông tin user tạo model
            }
        });

        if (!model) {
            res.status(404).json({ error: 'Model not found' });
            return;
        }

        res.json(model);
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ error: err.message });
    }
});


// Create AI Model
router.post('/', async (req, res) => {
    const { user_id, name, description, file_path, price_vnd, price_eth, input_type, output_type, categoryIds } = req.body;

    try {
        const newModel = await prisma.aI_Model.create({
            data: {
                user_id,
                name,
                description,
                file_path,
                price_vnd,
                price_eth,
                input_type,
                output_type,
                categories: {
                    create: categoryIds.map((category_id: string) => ({
                        category: {
                            connect: { category_id }
                        }
                    }))
                }
            },
            include: {
                categories: {
                    include: { category: true } // trả về luôn chi tiết category
                }
            }
        });

        res.status(201).json(newModel);
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }
});



// Update AI Model
router.put('/:id', async (req, res) => {
    const { name, description, file_path, price_vnd, price_eth, input_type, output_type, categoryIds } = req.body;

    try {
        const updatedModel = await prisma.aI_Model.update({
            where: { model_id: req.params.id },
            data: {
                name,
                description,
                file_path,
                price_vnd,
                price_eth,
                input_type,
                output_type,
                categories: {
                    deleteMany: {}, // ❗ Xóa hết liên kết cũ
                    create: categoryIds.map((category_id: string) => ({ // ❗ Thêm mới
                        category: {
                            connect: { category_id } // Kết nối đến category mới
                        }
                    }))
                }
            },
            include: {
                categories: {
                    include: { category: true } // Trả chi tiết category
                }
            }
        });

        res.json(updatedModel);
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }
});


// Delete AI Model
router.delete('/:id', async (req, res) => {
    try {
        // Check nếu model tồn tại
        const model = await prisma.aI_Model.findUnique({
            where: { model_id: req.params.id }
        });

        if (!model) {
            res.status(404).json({ error: 'AI Model not found' });
            return;
        }

        // Xóa bản ghi liên quan ở bảng pivot trước (nếu có)
        await prisma.aI_Model_Category.deleteMany({
            where: { model_id: req.params.id }
        });

        // Xóa AI_Model
        await prisma.aI_Model.delete({
            where: { model_id: req.params.id }
        });

        res.json({ message: 'AI Model deleted successfully' });
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }
});



export default router;
