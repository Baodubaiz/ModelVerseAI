import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { verifyToken, AuthRequest } from '../middleware/VerifyToken';

const router = express.Router();
const prisma = new PrismaClient();

// GET all users (không trả về password)
router.get('/', async (req, res) => {
    const users = await prisma.user.findMany({
        select: {
            user_id: true,
            wallet_address: true,
            email: true,
            phone_number: true,
            bank_account: true,
            bank_name: true,
            role: true,
            full_name: true,
        }
    });
    res.json(users);
});

// GET user by ID (ẩn password)
router.get('/:id', verifyToken, async (req: AuthRequest, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized: Please log in first' });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { user_id: req.params.id },
            select: {
                user_id: true,
                wallet_address: true,
                email: true,
                phone_number: true,
                bank_account: true,
                bank_name: true,
                role: true,
                full_name: true,
            }
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST create user (có thể có password, sẽ hash nếu có)
router.post('/', async (req, res) => {
    const { wallet_address, email, password, phone_number, bank_account, bank_name, role, full_name } = req.body;

    try {
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

        const newUser = await prisma.user.create({
            data: {
                wallet_address,
                email,
                password: hashedPassword,
                phone_number,
                bank_account,
                bank_name,
                role,
                full_name
            }
        });

        // Trả về user nhưng ẩn password
        const { password: _, ...userWithoutPassword } = newUser;
        res.json(userWithoutPassword);
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }
});

// PUT update user (nếu có password mới thì hash)
router.put('/:id', verifyToken, async (req: AuthRequest, res) => {
    const { wallet_address, email, password, phone_number, bank_account, bank_name, role, full_name } = req.body;
    if (!req.user) {
        res.status(401).json({ error: 'Unauthorized: Please log in first' });
        return;
    }
    try {
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

        const updatedUser = await prisma.user.update({
            where: { user_id: req.params.id },
            data: {
                wallet_address,
                email,
                password: hashedPassword, // sẽ null nếu không có password mới
                phone_number,
                bank_account,
                bank_name,
                role,
                full_name
            }
        });

        const { password: _, ...userWithoutPassword } = updatedUser;
        res.json(userWithoutPassword);
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }
});

// DELETE user
router.delete('/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        // Kiểm tra xem user có model AI nào không
        const modelCount = await prisma.aI_Model.count({
            where: { user_id: userId }
        });

        if (modelCount > 0) {
            res.status(400).json({
                error: 'Cannot delete user. This user still has AI models associated.'
            });
            return;
        }

        // Nếu không có model thì xóa user
        await prisma.user.delete({
            where: { user_id: userId }
        });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }
});


export default router;
