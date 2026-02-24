# mon-plat

Application mobile de marketplace alimentaire pour la Côte d'Ivoire, connectant vendeurs (Fast Food, Pâtisserie) et clients.

## Stack

- **Frontend** : Expo / React Native (Expo Router)
- **Backend** : Express.js + TypeScript
- **Base de données** : PostgreSQL via Supabase (Prisma ORM)
- **Auth** : JWT + vérification email par OTP

## Structure

```
mon-plat/    → Application mobile Expo
backend/     → API Express.js
```

## Démarrage rapide

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd mon-plat
npm install
npm start
```

## Variables d'environnement (backend)

Créer un fichier `.env` dans `backend/` :
```
DATABASE_URL=
DIRECT_URL=
JWT_SECRET=
```
