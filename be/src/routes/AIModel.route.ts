import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken, AuthRequest } from '../middleware/VerifyToken'

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

// GET /api/models/user/:userId
router.get('/user/:userId', verifyToken, async (req: AuthRequest, res) => {
    if (!req.user) {
        res.status(401).json({ error: 'Unauthorized: Please login first' });
        return;
    }
    try {

        const { userId } = req.params;

        const models = await prisma.aI_Model.findMany({
            where: {
                user_id: userId,
                is_active: true, // 👈 tuỳ chọn: chỉ hiện model đã active / đang bán
            },
            include: {
                categories: {
                    include: { category: true }
                },
                user: true // tuỳ chọn: hiển thị thông tin chủ sở hữu
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
// POST /ai-model (Tạo AI Model mới, cần đăng nhập)
router.post('/', verifyToken, async (req: AuthRequest, res) => {
    const {
        name,
        description,
        file_path,
        price_vnd,
        price_eth,
        input_type,
        output_type,
        categoryIds,
        thumbnail_url,
        is_active = true,
        demo_available = false,
        tags = []
    } = req.body;


    const { user_id, role } = req.user!; // <- dấu ! khẳng định không undefined

    if (role !== 'dev' && role !== 'admin') {
        res.status(403).json({ error: 'Access denied: Devs only' });
        return;
    }


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
                thumbnail_url,
                is_active,
                demo_available,
                tags,
                categories: {
                    create: categoryIds.map((category_id: string) => ({
                        category: { connect: { category_id } }
                    }))
                }
            },

            include: {
                categories: {
                    include: { category: true }
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
router.put('/:id', verifyToken, async (req: AuthRequest, res) => {
    const {
        name,
        description,
        file_path,
        price_vnd,
        price_eth,
        input_type,
        output_type,
        categoryIds,
        thumbnail_url,
        is_active,
        demo_available,
        tags
    } = req.body;

    // Chỉ cho phép DEV hoặc ADMIN sửa
    const { user_id, role } = req.user!; // <- dấu ! khẳng định không undefined

    const model = await prisma.aI_Model.findUnique({
        where: { model_id: req.params.id }
    });

    if (!model) {
        res.status(404).json({ error: 'Model not found' });
        return;
    }

    if (role !== 'admin' && (role !== 'dev' || model.user_id !== user_id)) {
        res.status(403).json({ error: 'Access denied' });
        return;
    }

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
                thumbnail_url,
                is_active,
                demo_available,
                tags,
                categories: categoryIds
                    ? {
                        deleteMany: {},
                        create: categoryIds.map((category_id: string) => ({
                            category: { connect: { category_id } }
                        }))
                    }
                    : undefined
            },
            include: {
                categories: { include: { category: true } }
            }
        });


        res.json(updatedModel);
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }
});




// Delete AI Model
router.delete('/:id', verifyToken, async (req: AuthRequest, res) => {
    // Chỉ cho phép DEV hoặc ADMIN sửa
    const { user_id: user_id, role } = req.user!;

    const model = await prisma.aI_Model.findUnique({
        where: { model_id: req.params.id }
    });

    if (!model) {
        res.status(404).json({ error: 'Model not found' });
        return;
    }
    if (role !== 'admin' && (role !== 'dev' || model.user_id !== user_id)) {
        res.status(403).json({ error: 'Access denied' });
        return;
    }

    try {
        const model = await prisma.aI_Model.findUnique({
            where: { model_id: req.params.id }
        });

        if (!model) {
            res.status(404).json({ error: 'AI Model not found' });
            return;
        }

        // Xóa category liên quan
        await prisma.aI_Model_Category.deleteMany({
            where: { model_id: req.params.id }
        });

        // Xóa model
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
