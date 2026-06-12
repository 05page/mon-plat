export interface Foods {
    id: number          // identifiant unique retourné par l'API
    title: string
    type: string
    content: string
    price: number
    image?: string | null
    quantie: number
    authorId: number
    author?: {
        fullname: string
        role: string
    }
}