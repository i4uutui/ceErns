const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'ERP API',
      version: '1.0.0',
      description: 'ERP 项目接口文档',
      contact: {
        name: '开发者'
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: '开发服务器'
        }
      ]
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  // 匹配项目中所有路由文件
  apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerDocs;