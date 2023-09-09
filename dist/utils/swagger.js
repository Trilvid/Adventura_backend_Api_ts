"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: "API Documentation for Adventura Backend App",
            version: '1.0.0'
        },
        components: {
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
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
function swaggerDocs(app, port) {
    app.use('/api/v1/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    app.get('docs.json', (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });
    console.log(`Docs available at http://localhost:${port}/api/v1/docs`);
}
exports.default = swaggerDocs;
