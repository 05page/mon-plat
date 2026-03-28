import { Router, Response } from "express";
import { prisma } from '../db/client'
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { RoleMiddleware } from "../middleware/role";
import bcrypt from 'bcrypt'

const router = Router();

router.get('/mes-commandes', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const myOrders = await prisma.order.findMany({
            where: {
                userId: req.user?.userId
            },

            orderBy: {
                created_at: "desc"
            },

            include: {
                items: {
                    include: {
                        post: {
                            select: {
                                title: true,
                                image: true,
                                price: true
                            }
                        }

                    }
                },
                payment: {                 // les infos de paiement
                    select: {
                        method: true,
                        status: true,
                        paidAt: true
                    }
                }
            }
        })
        if (!req.user?.userId) {
            res.status(403).json({ message: "Vous n'êtes pas autorisé à voir ce contenu" })
        }
        if (myOrders.length === 0) {
            res.json({ data: "Aucune commande" })
            return
        }
        res.json(myOrders)
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" })
    }
})

router.get('/orders/sales', [authMiddleware, RoleMiddleware], async (req: AuthRequest, res: Response) => {
    try {

        const sales = await prisma.orderItem.findMany({
            where: {
                post: {
                    authorId: req.user!.userId
                }
            },
            include: {
                post: {
                    select: {
                        title: true,
                        price: true,
                        image: true,
                    }
                },
                order: {
                    select: {
                        status: true,
                        created_at: true,
                        user: {
                            select: {
                                fullname: true  // nom du client
                            }
                        }
                    }
                }
            },
            orderBy: {
                order: {
                    created_at: 'desc'  // les plus récentes en premier
                }
            }
        })

        if (sales.length === 0) {
            res.json({ message: "Aucune vente pour l'instant" })
            return
        }

        res.json(sales)

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erreur serveur" })
    }
})

router.get('/orders/stats', [authMiddleware, RoleMiddleware], async (req: AuthRequest, res: Response) => {
    try {

        // Calcule le nombre de ventes et le total des revenus
        const stats = await prisma.orderItem.aggregate({
            where: {
                post: {
                    authorId: req.user!.userId  // seulement SES plats
                },
                order: {
                    status: "PAID"  // seulement les commandes payées
                }
            },
            _count: {
                id: true      // nombre total d'items vendus
            },
            _sum: {
                unitPrice: true,  // somme des prix unitaires
                quantity: true    // somme des quantités
            }
        })

        res.json({
            totalVentes: stats._count.id,
            chiffreAffaires: stats._sum.unitPrice ?? 0,
            quantiteTotale: stats._sum.quantity ?? 0
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erreur serveur" })
    }
})

router.post('/add-orders', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { items } = req.body

        // ✅ Bug 2 corrigé
        if (!items || !Array.isArray(items) || items.length === 0) {
            res.status(400).json({ error: "La commande doit au moins contenir un article" })
            return
        }

        for (const item of items) {
            if (!item.postId || !item.quantity || item.quantity < 1) {
                res.status(400).json({ error: "Chaque article doit avoir un postId et une quantity valide" })
                return
            }
        }

        const postIds = items.map((item: any) => item.postId)

        const postOrders = await prisma.post.findMany({
            where: {
                id: { in: postIds },
                published: true
            },
            select: { id: true, price: true, title: true }
        })

        if (postOrders.length !== postIds.length) {
            res.status(404).json({ error: "Un ou plusieurs articles sont introuvables" })
            return
        }

        const totalPrice = items.reduce((total: number, item: any) => {
            const post = postOrders.find((p: { id: any; }) => p.id === item.postId)
            return total + (item.quantity * post!.price)  // ✅ Bug 3 corrigé
        }, 0)

        // ✅ Bug 3 corrigé — une seule réponse à la fin
        const order = await prisma.order.create({
            data: {
                userId: req.user!.userId,
                totalPrice,
                items: {
                    create: items.map((item: any) => {
                        const post = postOrders.find((p: { id: any; }) => p.id === item.postId)
                        return {
                            postId: item.postId,
                            quantity: item.quantity,
                            unitPrice: post!.price
                        }
                    })
                }
            },
            include: {
                items: {
                    include: {
                        post: { select: { title: true, price: true } }
                    }
                }
            }
        })

        res.status(201).json({
            message: "Commande créée avec succès",
            order
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erreur serveur" })
    }
})

router.post('cancel-order/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        //Récupérer la commande
        const id = parseInt(req.params.id as string)
        if (isNaN(id)) {
            res.status(400).json({ error: "Id invalide" })
            return
        }
        const myOrder = await prisma.order.findUnique({
            where: { id: id }
        })

        if (!myOrder) {
            res.status(404).json({ erreur: "Commande introuvable" });
            return
        }

        if (myOrder.userId !== req.user?.userId) {
            res.status(403).json({ erreur: "Cette commande ne vous appartient pas" });
            return
        }

        if (myOrder.status === "CANCELLED" || myOrder.status === "PAID") {
            return res.status(400).json({ error: "Impossible d'annuler une commnde déjà payé ou annulé" })
        }

        const cancelledMyOrder = await prisma.order.update({
            where: { id },
            data: {
                status: "CANCELLED"
            }
        })

        res.json({
            message: "Commande annulée avec succès",
            order: cancelledMyOrder
        })

    } catch (error) {
        res.status(500).json({ error: "Erreur du serveur" })
    }
})

router.post('/orders-pay/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const id = parseInt(req.params.id as string)
        const { pin } = req.body

        if (isNaN(id)) {
            return res.status(400).json({ error: "Id invalide" })
        }

        if (!pin || pin.length !== 4 || isNaN(Number(pin))) {
            return res.status(400).json({ error: "Le PIN doit contenir exactement 4 chiffres" })
        }

        const order = await prisma.order.findUnique({
            where: { id }
        })

        if (!order) {
            return res.status(404).json({ error: "Commande introuvable" })
        }

        if (order.userId !== req.user!.userId) {
            return res.status(403).json({ error: "Cette commande ne vous appartient pas" })
        }

        if (order.status === "PAID" || order.status === "CANCELLED") {
            return res.status(400).json({ error: "Commande déjà payée ou annulée" })
        }

        const wallet = await prisma.wallet.findUnique({
            where: { userId: req.user!.userId }
        })

        if (!wallet) {
            return res.status(404).json({ error: "Vous n'avez pas de compte wallet" })
        }

        const codePin = await bcrypt.compare(pin, wallet.pin)
        if (!codePin) {
            return res.status(400).json({ error: "PIN incorrect" })
        }

        if (wallet.balance < order.totalPrice) {
            return res.status(400).json({ error: "Solde insuffisant" })
        }

        const [transaction] = await prisma.$transaction([
            prisma.transaction.create({
                data: {
                    amount: order.totalPrice,
                    type: "DEBIT",
                    walletId: wallet.id
                }
            }),
            prisma.wallet.update({
                where: { id: wallet.id },
                data: { balance: { decrement: order.totalPrice } }
            }),
            prisma.order.update({
                where: { id },
                data: { status: "PAID" }
            })
        ])

        res.status(201).json({
            message: "Paiement effectué avec succès !",
            transaction
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erreur du serveur" })
    }
})
export default router