import express from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { createToken } from '../utils/jwt'

const router = express.Router()
const prisma = new PrismaClient()

// POST /register - người dùng tự đăng ký
router.post('/', async (req, res) => {
    const {
        wallet_address,
        email,
        password,
        phone_number,
        bank_account,
        bank_name,
        role,         // Có thể mặc định là "user" hoặc cho phép chọn "dev"
        full_name
    } = req.body

    try {
        // Kiểm tra trùng email hoặc wallet_address (nếu có)
        if (email) {
            const existingEmail = await prisma.user.findUnique({ where: { email } })
            if (existingEmail) {
                res.status(400).json({ error: 'Email đã tồn tại' })
                return;
            }
        }

        if (phone_number) {
            const existingPhone = await prisma.user.findUnique({ where: { phone_number } })
            if (existingPhone) {
                res.status(400).json({ error: 'Số điện thoại đã tồn tại' })
                return;
            }
        }

        if (bank_account) {
            const existingBankAccount = await prisma.user.findUnique({ where: { bank_account } })
            if (existingBankAccount) {
                res.status(400).json({ error: 'Tài khoản ngân hàng đã tồn tại' })
                return;
            }
        }

        if (wallet_address) {
            const existingWallet = await prisma.user.findUnique({ where: { wallet_address } })
            if (existingWallet) {
                res.status(400).json({ error: 'Ví đã được đăng ký' })
                return;
            }
        }

        // Hash password nếu có
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined

        // Tạo user
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
        })

        // Tạo token luôn sau khi đăng ký
        const token = createToken({
            user_id: newUser.user_id,
            role: newUser.role,
            wallet_address: newUser.wallet_address || undefined
        })

        res.status(201).json({
            message: 'Đăng ký thành công',
            token
        })
    } catch (error) {
        const err = error as Error
        res.status(400).json({ error: err.message })
    }
})

export default router
