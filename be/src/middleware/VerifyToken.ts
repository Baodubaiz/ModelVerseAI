// middleware/verifyToken.ts

import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey'

export interface AuthRequest extends Request {
    user?: any // bạn có thể typing kỹ hơn nếu muốn
}

export function verifyToken(req: AuthRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Thiếu token' })
        return
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.user = decoded // Gán thông tin user vào req.user
        next()
    } catch (err) {
        res.status(403).json({ error: 'Token không hợp lệ hoặc hết hạn' })
        return
    }
}
