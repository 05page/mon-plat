import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Express } from 'express'

/**
 * Configuration de base de l'API Swagger (OpenAPI 3.0).
 * C'est ici qu'on définit les métadonnées globales de l'API :
 * le titre, la version, les serveurs disponibles et le schéma
 * de sécurité (JWT Bearer token).
 */
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mon-Plat API',
      version: '1.0.0',
      description: 'API du marketplace alimentaire Mon-Plat (Côte d\'Ivoire)',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement',
      },
    ],
    components: {
      // Définit le schéma d'authentification global utilisé par les routes protégées.
      // "bearerAuth" est le nom qu'on référencera dans chaque route avec security: [{ bearerAuth: [] }]
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  // Indique à swagger-jsdoc où chercher les commentaires @swagger dans le code
  apis: ['./src/auth/*.ts'],
}

// Génère la spec OpenAPI à partir des commentaires JSDoc trouvés dans "apis"
const swaggerSpec = swaggerJsdoc(options)

/**
 * Monte Swagger UI sur la route /api-docs de l'application Express.
 * @param app - L'instance Express
 */
export function setupSwagger(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  console.log('📄 Swagger disponible sur http://localhost:3000/api-docs')
}
