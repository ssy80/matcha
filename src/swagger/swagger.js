import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Express API with Swagger',
        version: '1.0.0',
        description: 'CRUD API application made with Express and documented with Swagger',
        contact: {
          name: 'API Support',
          email: 'ssian@42mail.sutd.edu.sg',
      },
      license: {
          name: 'MIT',
          url: 'https://spdx.org/licenses/MIT.html',
      },
    },
    servers: [
      {
          url: 'http://localhost:3000',
          description: 'Development server',
      },
      {
          url: 'http://localhost:3000',
          description: 'Production server',
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
    security: [{
        bearerAuth: [],
    }],
};

// Options for the swagger docs
const options = {
    swaggerDefinition,
    apis: [
        join(__dirname, '../swagger/**/*.js'),    // All JS files in swagger folder
    ],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

// Custom Swagger UI options
const swaggerOptions = {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Documentation',
};

export { swaggerUi, swaggerSpec };
