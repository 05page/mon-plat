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

router.get('/me/stats', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId
    const role = req.user!.role

    if (role === 'SELLER') {
      // Compter les posts (total et publiés séparément)
      const [totalPosts, publishedPosts] = await Promise.all([
        prisma.post.count({ where: { authorId: userId } }),
        prisma.post.count({ where: { authorId: userId, published: true } }),
      ])

      // Récupérer tous les OrderItems liés aux posts du vendeur avec statut PAID
      // On a besoin de quantity et unitPrice pour calculer le CA côté JS
      // car Prisma ne peut pas faire unitPrice * quantity dans un aggregate
      const paidItems = await prisma.orderItem.findMany({
        where: {
          post: { authorId: userId },
          order: { status: 'PAID' },
        },
        select: { quantity: true, unitPrice: true },
      })

      // Chiffre d'affaires = somme de (quantité × prix unitaire) sur chaque ligne
      const revenue = paidItems.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      )

      // Nombre de commandes reçues (distinctes) contenant au moins un de ses posts
      const totalOrdersReceived = await prisma.order.count({
        where: {
          items: { some: { post: { authorId: userId } } },
        },
      })

      return res.json({
        role: 'SELLER',
        totalPosts,
        publishedPosts,
        unpublishedPosts: totalPosts - publishedPosts,
        totalOrdersReceived,
        revenue, // en FCFA
      })
    }

    if (role === 'CLIENT') {
      // Compter les commandes par statut en une seule requête groupée
      const ordersByStatus = await prisma.order.groupBy({
        by: ['status'],
        where: { userId },
        _count: { status: true },
      })

      // Transformer le tableau en objet lisible : { PENDING: 2, PAID: 5, CANCELLED: 1 }
      const statusMap = ordersByStatus.reduce(
        (acc, group) => {
          acc[group.status] = group._count.status
          return acc
        },
        {} as Record<string, number>
      )

      // Total dépensé sur les commandes PAID uniquement
      const totalSpentResult = await prisma.order.aggregate({
        where: { userId, status: 'PAID' },
        _sum: { totalPrice: true },
      })

      return res.json({
        role: 'CLIENT',
        totalOrders: (statusMap.PENDING ?? 0) + (statusMap.PAID ?? 0) + (statusMap.CANCELLED ?? 0),
        pendingOrders: statusMap.PENDING ?? 0,
        paidOrders: statusMap.PAID ?? 0,
        cancelledOrders: statusMap.CANCELLED ?? 0,
        totalSpent: totalSpentResult._sum.totalPrice ?? 0, // en FCFA
      })
    }

    res.status(400).json({ error: 'Rôle non reconnu' })
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
router.put('/updateProfil', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { email, fullname } = req.body
    if (!email || !fullname) {
      res.status(400).json({
        error: 'Email et mot de passe sont requis'
      });
      return
    }
    const emailExisting = await prisma.user.findUnique({ where: { email } });
    if (emailExisting && emailExisting.id !== req.user!.userId) {
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
  } catch (error) {
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
router.post('/logout', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    blacklist.add(token);
    res.status(200).json({ message: 'Déconnexion réussie' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
