const swaggerJsdoc = require('swagger-jsdoc');
const options = {
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'Social Media API',
      version: '1.0.0',
    },

    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],

    //////////////////////////////////////////////////////
    // 🔐 GLOBAL AUTH
    //////////////////////////////////////////////////////
    security: [
      {
        bearerAuth: [],
      },
    ],

    //////////////////////////////////////////////////////
    // 🔧 COMPONENTS
    //////////////////////////////////////////////////////
    components: {

      //////////////////////////////////////////////////////
      // 🔐 AUTH
      //////////////////////////////////////////////////////
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },

      //////////////////////////////////////////////////////
      // 🔥 PARAMETERS
      //////////////////////////////////////////////////////
      parameters: {
        PostId: {
          in: 'path',
          name: 'postId',
          required: true,
          schema: {
            type: 'integer',
            example: 1,
          },
        },

        UserId: {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'integer',
            example: 1,
          },
        },

        CommentId: {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'integer',
            example: 1,
          },
        },
      },

      //////////////////////////////////////////////////////
      // 📦 SCHEMAS (🔥 FIXED POSITION)
      //////////////////////////////////////////////////////
      schemas: {

        // 🔐 LOGIN
        Login: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              example: 'user@test.com',
            },
            password: {
              type: 'string',
              example: 'NewPass@123',
            },
          },
        },

        // 🚨 REPORT POST
        ReportPost: {
          type: 'object',
          required: ['reason'],
          properties: {
            reason: {
              type: 'string',
              example: 'Spam',
            },
          },
        },

        // 📦 CREATE POST
        CreatePost: {
          type: 'object',
          properties: {
            content: {
              type: 'string',
              example: 'Hello world',
            },
            visibility: {
              type: 'string',
              example: 'public',
            },
          },
        },
      },
    },
  },

  apis: ['./routes/*.js', './routes/**/*.js'],
};

module.exports = swaggerJsdoc(options);