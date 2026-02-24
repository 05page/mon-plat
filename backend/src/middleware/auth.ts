import { Request, Response, NextFunction } from 'express'
import { blacklist } from '../auth/me';
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  user?: { userId: number; email: string; role: string }
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token manquant' })
    return
  }

  const token = authHeader.split(' ')[1]

  if (blacklist.has(token)) {
    res.status(401).json({ message: 'Token révoqué' })
    return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number
      email: string
      role: string
    }
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ error: 'Token invalide ou expiré' })
  }
}
