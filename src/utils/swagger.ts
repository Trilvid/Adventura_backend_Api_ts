import { Express, Request, Response } from "express";

import swaggerJsDoc from'swagger-jsdoc' 
import swaggerUi from'swagger-ui-express' 
 

const options: swaggerJsDoc.Options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: "API Documentation for Adventura Backend App",
        version: '1.0.0'
      },
      components:{
        securitySchemas: {
            bearerAuth: {
                type: 'http',
                schema: "bearer",
                bearerFormat: "jwt",
            }
        }
      },
      security: [
        {
            bearerAuth: []
        }
      ],
    },
    apis: ['./src/routes/*.ts', './src/models/*.ts']
  }
  
  const swaggerSpec = swaggerJsDoc(options)

  function swaggerDocs (app:Express, port: number) {

    app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    app.get('docs.json', (req:Request, res:Response) => {
        res.setHeader("Content-Type", "application/json")
        res.send(swaggerSpec)
    })

    console.log(`Docs available at http://localhost:${port}/api/v1/docs`);

  }

  export default swaggerDocs; 