import { title } from 'node:process'
import {z} from 'zod'

export const addPlatSchema = z.object({
    title:   z.string().min(1, "Le titre est requis"),
    price:   z.number().min(1, "Le prix est requis").positive(),
    type:    z.enum(["FAST_FOOD", "PATISSERIE"], "Le type est requis"), 
    content: z.string('La description est requise'),
    quantie: z.number().int().min(0, 'La quantite esr requis')
})