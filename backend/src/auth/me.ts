import { Router, Response } from "express";
import { prisma } from '../db/client'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     tags: [Profil]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Données du profil
 *       401:
 *         description: Token manquant ou invalide
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        email: true,
        fullname: true,
        role: true,
        email_verify: true,
        created_at: true,
      },
    })

    if (!user) {
      res.status(404).json({ error: 'Utilisateur non trouvé' })
      return
    }

    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

/**
 * @swagger
 * /updateProfil:
 *   put:
 *     summary: Mettre à jour le profil (email et nom)
 *     tags: [Profil]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, fullname]
 *             properties:
 *               email:
 *                 type: string
 *                 example: nouveau@example.com
 *               fullname:
 *                 type: string
 *                 example: Jean David Kouassi
 *     responses:
 *       200:
 *         description: Profil mis à jour
 *       400:
 *         description: Champs manquants ou email déjà utilisé
 *       401:
 *         description: Token manquant ou invalide
 */
router.put('/updateProfil', authMiddleware, async (req:AuthRequest, res:Response) => {
    try{
        const {email, fullname} = req.body
        if(!email || !fullname){
            res.status(400).json({
                error: 'Email et mot de passe sont requis'
            });
            return
        }
        const emailExisting = await prisma.user.findUnique({where: {email}});
        if(emailExisting && emailExisting.id !== req.user!.userId){
            res.status(400).json({
              error: "Ce mail est déjà utilisé"
            });
            return
        }

        const updateUser = await prisma.user.update({
          where: { id: req.user!.userId },
          data: {
            email,
            fullname
          }
        })

        res.json({ message: 'Profil mis à jour', user: updateUser })
    }catch(error){
        console.error(error)
        res.status(500).json({ error: 'Erreur serveur' })
    }
});

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Se déconnecter (invalide le token JWT)
 *     tags: [Profil]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *       401:
 *         description: Token manquant ou invalide
 */
export const blacklist = new Set()
router.post('/logout', authMiddleware, async(req:AuthRequest, res:Response) => {
  try{
      const token = req.headers.authorization?.split(' ')[1]
      blacklist.add(token);
      res.status(200).json({message : 'Déconnexion réussie'})
  }catch(error){
    console.log(error)
    res.status(500).json({error: 'Erreur serveur'})
  }   
})

export default router
