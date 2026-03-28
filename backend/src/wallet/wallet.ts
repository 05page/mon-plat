import { Router, Response } from "express";
import { prisma } from '../db/client'
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { RoleMiddleware } from "../middleware/role";
import bcrypt from 'bcrypt'
import { error } from "node:console";

const router = Router()

router.get('/my-wallet', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {

        const wallet = await prisma.wallet.findUnique(
            {
                where: { userId: req.user!.userId },
                select: {
                    balance: true
                }
            }
        )
        if (!wallet) {
            res.status(404).json({ message: "Vous n'avez pas de compte wallet veuillez en créer un" })
            return
        }

        res.json(wallet)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erreur du serveur" })
    }
})

router.post('/create-wallet', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { pin, confirmPin } = req.body
        if (!pin || pin.length !== 4 || isNaN(Number(pin))) {
            res.status(400).json({ error: "Le PIN doit contenir exactement 4 chiffres" })
            return
        }

        if (confirmPin !== pin) {
            res.status(400).json({ error: "Les PIN ne correspondent pas" })
            return
        }

        const wallet = await prisma.wallet.findUnique(
            {
                where: { userId: req.user!.userId }
            }
        )

        if (wallet) {
            res.status(400).json({ message: "Impossible de créer deux compte wallet" })
            return
        }

        const hasheCodePin = await bcrypt.hash(pin, 4)
        const createWallet = await prisma.wallet.create({
            data: {
                userId: req.user!.userId,
                pin: hasheCodePin,
                pinAttemps: 0
            }
        })
        res.json({ message: "Compte wallet créé" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erreur du serveur" })
    }
})

router.post('/recharge-wallet', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { amount, pin } = req.body
        if (!amount || amount <= 0) {
            res.json({ error: "Le montant doit être positif" })
            return
        }
        if (!pin || pin.length !== 4 || isNaN(Number(pin))) {
            res.status(400).json({ error: "Le PIN doit contenir exactement 4 chiffres" })
            return
        }

        const wallet = await prisma.wallet.findUnique({
            where: { userId: req.user?.userId }
        })

        if (!wallet) {
            return res.status(404).json({ error: "Vous n'avez pas de compte wallet" })
        }
        const codePin = await bcrypt.compare(pin, wallet.pin)

        if (!codePin) {
            return res.status(400).json({ error: "PIN incorrect" })
        }
        const [recharge] = await prisma.$transaction([
            prisma.transaction.create({
                data: {
                    amount: amount,
                    type: "CREDIT",
                    walletId: wallet.id
                }
            }),

            prisma.wallet.update({
                where: { id: wallet.id },
                data: {
                    balance: { increment: amount }
                }
            })
        ])

        res.status(201).json({
            message: "Recharge  effectué avec succès !",
            recharge
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erreur du serveur" })
    }
})

router.get('/transactions', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const wallet = await prisma.wallet.findUnique({
            where: { userId: req.user?.userId }
        })

        if (!wallet) {
            return res.status(404).json({ message: "Wallet introuvable" })
        }

        const historiques = await prisma.transaction.findMany({
            where: { walletId: wallet.id },
            orderBy: { createdAt: "desc" }
        })

        return res.json(historiques)

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erreur du serveur" })
    }
})

router.post('/transfert', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {

        const { amount, pin, receiverId } = req.body
        const wallet = await prisma.wallet.findUnique({
            where: { userId: req.user!.userId }
        })

        if (!wallet) {
            return res.status(400).json({ error: "Vous n'avez pas de compte wallet" });
        }

        // Ajoute avant tout le reste
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: "Le montant doit être positif" })
        }
        if (!pin || pin.length !== 4 || isNaN(Number(pin))) {
            return res.status(400).json({ error: "Le PIN doit contenir 4 chiffres" })
        }
        if (!receiverId) {
            return res.status(400).json({ error: "Le destinataire est requis" })
        }
        const codePin = await bcrypt.compare(pin, wallet.pin)
        if (!codePin) {
            return res.status(400).json({ error: "PIN incorrect" })
        }

        if (amount > wallet.balance) {
            return res.status(400).json({ error: "Solde insuffisant. Veuillez vous recharger!!!" })
        }

        if (receiverId === req.user?.userId) {
            return res.status(400).json({ error: "Vous ne pouvez pas vous envoyer de l'argent à vous-même" })
        }

        const receiverWallet = await prisma.wallet.findFirst({
            where: { userId: receiverId }
        })

        if (!receiverWallet) {
            return res.status(404).json({ error: "Ce destinataire n'a pas de compte wallet" })
        }


        const [transfert] = await prisma.$transaction([
            prisma.wallet.update({
                where: { id: wallet.id },
                data: {
                    balance: { decrement: amount }
                }
            }),
            prisma.wallet.update({
                where: { id: receiverWallet.id },
                data: { balance: { increment: amount } }
            }),
            prisma.transaction.create({
                data: {
                    amount,
                    type: "DEBIT",
                    walletId: wallet.id
                }
            })
        ])

        res.json({
            message: "Transfert effectué avec succès",
            transfert
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erreur du serveur" })
    }
})
export default router