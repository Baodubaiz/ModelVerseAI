import express from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { createToken } from '../utils/jwt'

const router = express.Router()
const prisma = new PrismaClient()

// Đăng nhập bằng email + password
router.post('/', async (req, res) => {
    const { email, password } = req.body

    try {
        // 1. Tìm user theo email
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            res.status(401).json({ error: 'Email không tồn tại' })
            return
        }

        // 2. So sánh mật khẩu
        const match = await bcrypt.compare(password, user.password!)
        if (!match) {
            res.status(401).json({ error: 'Sai mật khẩu' })
            return
        }
        // 3. Tạo token
        const token = createToken({
            user_id: user.user_id,
            role: user.role,
            wallet_address: user.wallet_address || undefined
        })

        // 4. Trả token về FE
        res.json({ token })
    } catch (err) {
        res.status(500).json({ error: 'Lỗi server' })
    }
})

export default router
