import { Router, Response } from "express";
import { prisma } from '../db/client'
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { RoleMiddleware } from "../middleware/role";
import cloudinary from '../config/cloudinary'
import upload from '../config/multer'
import { addPlatSchema } from "../validator/validator";

const router = Router();

router.get('/catalogue', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const catalogue = await prisma.post.findMany({
            where: { published: true },
            include: {
                author: {
                    select: {
                        fullname: true,
                        role: true
                    }
                }
            }
            // take: 10,
            // skip: 5
        })
        if (catalogue.length === 0) {
            res.json({ data: "Aucun plat disponible" })
            return
        }
        res.json(catalogue)

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erreur serveur" })
    }
})

router.post("/addPlat", [authMiddleware, RoleMiddleware], async (req: AuthRequest, res: Response) => {
    try {
        const result = addPlatSchema.safeParse(req.body)
        if (!result.success) {
            return res.status(400).json({ error: result.error.issues })
        }
        const { title, price, type, content, quantie } = result.data
        const { image } = req.body

        if (!req.user) {
            res.status(401).json({ message: "Non autorisé" })
            return
        }
        const foods = await prisma.post.create({
            data: {
                type,
                title,
                content,
                price,
                image: image || null,
                quantie,
                published: true,
                authorId: req.user.userId
            }
        })
        res.status(201).json({
            message: `${foods.title} a été ajouté avec succès`
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: `Erreur serveur ${error}` })
    }
})

router.post('/upload', authMiddleware, RoleMiddleware, upload.single('image'), async (req: AuthRequest, res: Response) => {
    // upload.single('image') = on attend UN seul fichier
    // dont le champ s'appelle "image" dans le formulaire

    try {
        // Vérifier qu'un fichier a bien été envoyé
        if (!req.file) {
            res.status(400).json({ error: "Aucune image envoyée" })
            return
        }

        // Convertir l'image en base64 pour Cloudinary
        const base64 = req.file.buffer.toString('base64')
        const dataUri = `data:${req.file.mimetype};base64,${base64}`
        // ex: "data:image/jpeg;base64,/9j/4AAQSkZJRgAB..."

        // Envoyer l'image à Cloudinary
        const result = await cloudinary.uploader.upload(dataUri, {
            folder: 'catalogue'  // les images seront dans un dossier "catalogue"
        })

        // Retourner l'URL de l'image
        res.json({
            message: "Image uploadée avec succès",
            url: result.secure_url  // l'URL https de l'image sur Cloudinary
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erreur serveur" })
    }
})

router.put('/:id/update', [authMiddleware, RoleMiddleware], async (req: AuthRequest, res: Response) => {
    try {
        const { type, title, content, price, image, quantie } = req.body
        const id = parseInt(req.params.id as string)
        if (isNaN(id)) {
            res.status(400).json({ message: "Id invalide" })
        }
        const post = await prisma.post.findUnique({
            where: { id }
        })
        if (!post) {
            res.status(404).json({ message: "Post introuvable" })
            return
        }

        if (post.authorId !== req.user?.userId) {
            res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier ce post" })
            return
        }

        const updatedPost = await prisma.post.update({
            where: { id },
            data: { type, title, content, price, image, quantie }
        })

        res.json(updatedPost)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erreur serveur" })
    }
})

router.delete('/catlogue/:id', RoleMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const id = parseInt(req.params.id as string)
        if (isNaN(id)) {
            res.status(400).json({ error: "L'id doit être un nombre" })
            return
        }
        const plat = await prisma.post.findUnique({
            where: { id }
        })

        if (!plat) {
            res.status(404).json({ message: "Plat introuvable" })
        }

        if (req.user?.userId) {
            res.status(403).json({ message: "Vous n'avez pas l'autorisation de supprimer ce plat" })
        }

        await prisma.post.delete({
            where: { id }
        })

        res.json({ message: `Le plat ${plat?.title}` })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erreur serveur" })
    }
})

export default router