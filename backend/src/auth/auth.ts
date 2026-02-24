import { Router, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../db/client'

const router = Router()

// POST /auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, fullname, role, password } = req.body

    // Validation des champs requis
    if (!email || !password) {
      res.status(400).json({ error: 'Email et mot de passe sont requis' })
      return
    }

    if (role && role !== 'CLIENT' && role !== 'SELLER') {
      res.status(400).json({ error: 'Le rôle doit être CLIENT ou SELLER' })
      return
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      res.status(400).json({ error: 'Cet email est déjà utilisé' })
      return
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Générer un code OTP (6 chiffres)
    const code_otp = Math.floor(100000 + Math.random() * 900000)

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        fullname,
        role,
        password: hashedPassword,
        code_otp,
      },
    })

    // TODO: envoyer le code OTP par email ici

    res.status(201).json({
      message: 'Utilisateur créé. Vérifiez votre email pour le code OTP.',
      userId: user.id,
      code_otp, // À retirer en production — affiché ici pour tester avec Postman
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// POST /auth/verify-email
router.post('/verify-email', async (req: Request, res: Response) => {
  try {
    const { email, code_otp } = req.body

    if (!email || !code_otp) {
      res.status(400).json({ error: 'Email et code OTP sont requis' })
      return
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      res.status(404).json({ error: 'Utilisateur non trouvé' })
      return
    }

    if (user.email_verify) {
      res.status(400).json({ error: 'Email déjà vérifié' })
      return
    }

    if (user.code_otp !== code_otp) {
      res.status(400).json({ error: 'Code OTP invalide' })
      return
    }

    // Mettre à jour : email vérifié + supprimer le code OTP
    await prisma.user.update({
      where: { email },
      data: {
        email_verify: new Date(),
        code_otp: null,
      },
    })

    res.json({ message: 'Email vérifié avec succès' })
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// POST /auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ error: 'Email et mot de passe sont requis' })
      return
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      res.status(401).json({ error: 'Email ou mot de passe incorrect' })
      return
    }

    // Vérifier si l'email est vérifié
    if (!user.email_verify) {
      res.status(403).json({ error: 'Veuillez vérifier votre email avant de vous connecter' })
      return
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      res.status(401).json({ error: 'Email ou mot de passe incorrect' })
      return
    }

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    )

    res.json({
      message: 'Connexion réussie',
      token,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
