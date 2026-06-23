/**
 * This is a user authentication API route demo.
 * Handle user registration, login, token management, etc.
 */
import { Router, type Request, type Response } from 'express'

const router = Router()

/**
 * User Login
 * POST /api/auth/register
 */
router.post('/register', async (_req: Request, res: Response): Promise<void> => {
  res.status(501).json({ message: 'Kayıt akışı demo sürümde henüz hazır değil.' })
})

/**
 * User Login
 * POST /api/auth/login
 */
router.post('/login', async (_req: Request, res: Response): Promise<void> => {
  res.status(501).json({ message: 'Giriş akışı demo sürümde henüz hazır değil.' })
})

/**
 * User Logout
 * POST /api/auth/logout
 */
router.post('/logout', async (_req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: 'Çıkış demo sürümde yerel olarak tamamlandı.' })
})

export default router
