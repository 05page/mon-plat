import 'dotenv/config'
import bcrypt from 'bcrypt'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

// On recrée le client ici car le seed s'exécute en dehors d'Express
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Nettoyer les données existantes (ordre important : enfants avant parents)
  await prisma.transaction.deleteMany()
  await prisma.wallet.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.post.deleteMany()
  await prisma.user.deleteMany()

  console.log('Base nettoyée.')

  // Créer le vendeur (email déjà vérifié, pas besoin de passer par l'OTP)
  const hashedPassword = await bcrypt.hash('Test1234', 10)

  const seller = await prisma.user.create({
    data: {
      email: 'vendeur@test.com',
      fullname: 'Kouamé Brice',
      role: 'SELLER',
      password: hashedPassword,
      telephone: '0712345678',
      email_verify: new Date(), // compte déjà activé
      code_otp: null,
    },
  })

  console.log(`Vendeur créé : ${seller.email}`)

  // Ajouter des produits (Posts) liés à ce vendeur
  await prisma.post.createMany({
    data: [
      {
        title: 'Attiéké poulet',
        type: 'FAST_FOOD',
        content: 'Attiéké frais avec poulet braisé et sauce tomate',
        price: 1500,
        quantie: 20,
        published: true,
        authorId: seller.id,
      },
      {
        title: 'Aloco poisson',
        type: 'FAST_FOOD',
        content: 'Banane plantain frite accompagnée de poisson braisé',
        price: 1000,
        quantie: 15,
        published: true,
        authorId: seller.id,
      },
      {
        title: 'Tarte au chocolat',
        type: 'PATISSERIE',
        content: 'Tarte maison au chocolat noir 70%',
        price: 2500,
        quantie: 8,
        published: false, // non publiée
        authorId: seller.id,
      },
    ],
  })

  console.log('3 produits créés pour Kouamé Brice.')

  // --- Vendeur 2 : Aya Fatou (PATISSERIE) ---
  const seller2 = await prisma.user.create({
    data: {
      email: 'aya@test.com',
      fullname: 'Aya Fatou',
      role: 'SELLER',
      password: hashedPassword,
      telephone: '0708765432',
      email_verify: new Date(),
      code_otp: null,
    },
  })

  await prisma.post.createMany({
    data: [
      {
        title: 'Croissant beurre',
        type: 'PATISSERIE',
        content: 'Croissant pur beurre feuilleté',
        price: 500,
        quantie: 30,
        published: true,
        authorId: seller2.id,
      },
      {
        title: 'Pain au chocolat',
        type: 'PATISSERIE',
        content: 'Viennoiserie fourrée au chocolat noir',
        price: 600,
        quantie: 25,
        published: true,
        authorId: seller2.id,
      },
      {
        title: 'Gâteau de mariage',
        type: 'PATISSERIE',
        content: 'Sur commande uniquement — vanille et fraise',
        price: 35000,
        quantie: 2,
        published: false,
        authorId: seller2.id,
      },
    ],
  })

  console.log('3 produits créés pour Aya Fatou.')

  // --- Vendeur 3 : Diallo Seydou (FAST_FOOD) ---
  const seller3 = await prisma.user.create({
    data: {
      email: 'diallo@test.com',
      fullname: 'Diallo Seydou',
      role: 'SELLER',
      password: hashedPassword,
      telephone: '0505556677',
      email_verify: new Date(),
      code_otp: null,
    },
  })

  await prisma.post.createMany({
    data: [
      {
        title: 'Riz sauce graine',
        type: 'FAST_FOOD',
        content: 'Riz blanc avec sauce graine de palme et poisson fumé',
        price: 1200,
        quantie: 40,
        published: true,
        authorId: seller3.id,
      },
      {
        title: 'Kedjenou poulet',
        type: 'FAST_FOOD',
        content: 'Poulet mijoté aux légumes, spécialité ivoirienne',
        price: 2000,
        quantie: 10,
        published: true,
        authorId: seller3.id,
      },
      {
        title: 'Foutou banane',
        type: 'FAST_FOOD',
        content: 'Foutou banane accompagné de soupe de légumes',
        price: 1000,
        quantie: 18,
        published: true,
        authorId: seller3.id,
      },
    ],
  })

  console.log('3 produits créés pour Diallo Seydou.')

  // --- Vendeur 4 : Traoré Aminata (mixte) ---
  const seller4 = await prisma.user.create({
    data: {
      email: 'aminata@test.com',
      fullname: 'Traoré Aminata',
      role: 'SELLER',
      password: hashedPassword,
      telephone: '0102233445',
      email_verify: new Date(),
      code_otp: null,
    },
  })

  await prisma.post.createMany({
    data: [
      {
        title: 'Sandwich thon mayo',
        type: 'FAST_FOOD',
        content: 'Baguette garnie thon, mayonnaise, tomates',
        price: 800,
        quantie: 35,
        published: true,
        authorId: seller4.id,
      },
      {
        title: 'Mille-feuille vanille',
        type: 'PATISSERIE',
        content: 'Pâte feuilletée, crème pâtissière vanille',
        price: 1500,
        quantie: 12,
        published: true,
        authorId: seller4.id,
      },
      {
        title: 'Jus de gingembre',
        type: 'FAST_FOOD',
        content: 'Jus frais maison au gingembre et citron',
        price: 500,
        quantie: 50,
        published: true,
        authorId: seller4.id,
      },
    ],
  })

  console.log('3 produits créés pour Traoré Aminata.')

  // --- Clients ---
  const hashedPasswordClient = await bcrypt.hash('Client1234', 10)

  const client1 = await prisma.user.create({
    data: {
      email: 'client@test.com',
      fullname: 'Adjoua Marie',
      role: 'CLIENT',
      password: hashedPasswordClient,
      telephone: '0101234567',
      email_verify: new Date(),
      code_otp: null,
    },
  })

  const client2 = await prisma.user.create({
    data: {
      email: 'koffi@test.com',
      fullname: 'Koffi Ange',
      role: 'CLIENT',
      password: hashedPasswordClient,
      telephone: '0778899001',
      email_verify: new Date(),
      code_otp: null,
    },
  })

  const client3 = await prisma.user.create({
    data: {
      email: 'nadia@test.com',
      fullname: 'Nadia Coulibaly',
      role: 'CLIENT',
      password: hashedPasswordClient,
      telephone: '0512348765',
      email_verify: new Date(),
      code_otp: null,
    },
  })

  console.log(`3 clients créés : ${client1.email}, ${client2.email}, ${client3.email}`)

  console.log('\n--- Comptes de test ---')
  console.log('SELLER — vendeur@test.com  | Test1234   (Kouamé Brice)')
  console.log('SELLER — aya@test.com      | Test1234   (Aya Fatou)')
  console.log('SELLER — diallo@test.com   | Test1234   (Diallo Seydou)')
  console.log('SELLER — aminata@test.com  | Test1234   (Traoré Aminata)')
  console.log('CLIENT — client@test.com   | Client1234 (Adjoua Marie)')
  console.log('CLIENT — koffi@test.com    | Client1234 (Koffi Ange)')
  console.log('CLIENT — nadia@test.com    | Client1234 (Nadia Coulibaly)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
