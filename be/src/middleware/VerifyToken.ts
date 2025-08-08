// middleware/verifyToken.ts

import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey'

export interface UserPayload {
    user_id: string;
    role: string;
    wallet_address?: string;
}

export interface AuthRequest extends Request {
    user?: UserPayload;
}

export function verifyToken(req: AuthRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Thiếu token' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as UserPayload; // 👈 ép kiểu rõ ràng
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ error: 'Token không hợp lệ hoặc hết hạn' });
        return;
    }
}
