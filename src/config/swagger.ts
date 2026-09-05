import swaggerJSDoc from 'swagger-jsdoc'

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'e-commerce-api',
      version: '1.0.0',
      description: 'REST API for an e-commerce application',
    },

    servers: [
      {
        url: '/',
        description: 'Current server',
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },

  apis: ['./src/modules/**/*.ts'],
}

export const swaggerSpec = swaggerJSDoc(options)
