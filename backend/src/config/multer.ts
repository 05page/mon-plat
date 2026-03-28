// src/config/multer.ts

import multer from 'multer'

const storage = multer.memoryStorage()
// memoryStorage = l'image est gardée en mémoire RAM temporairement
// On ne la sauvegarde PAS sur le disque du serveur
// car on va l'envoyer directement à Cloudinary

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024  // 5 MB maximum
        // 5 * 1024 * 1024 = 5,242,880 bytes = 5 MB
    },
    fileFilter: (req, file, cb) => {
        // On vérifie que c'est bien une image
        if (file.mimetype.startsWith('image/')) {
            cb(null, true)   // ✅ Accepté
        } else {
            cb(new Error('Le fichier doit être une image'))  // ❌ Refusé
        }
    }
})

export default upload