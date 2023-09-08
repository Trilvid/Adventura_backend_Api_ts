"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const helmet_1 = __importDefault(require("helmet"));
const http_errors_1 = __importDefault(require("http-errors"));
const path_1 = __importDefault(require("path"));
const auth = require("./routes/authRoute");
const story = require("./routes/storyRoute");
const comment = require("./routes/commentRoute");
const errorHandeler = require("./controllers/errorHandler");
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const limiter = rateLimit({
    max: 10,
    windowMs: 60 * 60 * 1000,
    message: 'Too Many requests form this Ip, please try again in an hour!'
});
const app = (0, express_1.default)();
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.static('public'));
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use('/api', limiter);
app.use(express_1.default.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());
app.set('view engine', 'pug');
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: "API Documentation for Adventura Backend App",
            version: '1.0.0'
        },
        servers: [
            {
                url: 'http://localhost:5000/api/v1'
            }
        ]
    },
    apis: ['./routes/*.ts']
};
const swaggerSpec = swaggerJsDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
/**
 * @swagger
 * /auth/allUsers:
 * get:
 *    summary: This route is used to get all the users on this app
 *    description: This route is used to get all the users on this app
 *    responses:
 *      200:
 *        description: To Get All Users
 */
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// 2) Routes
app.use('/api/v1/auth', auth);
app.use('/api/v1/stories', story);
app.use('/api/v1/comment', comment);
// 3) Error handler middleware - Place after route definitions
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send(err.message);
    next((0, http_errors_1.default)(404));
});
app.all('*', (req, res, next) => {
    res.status(404).send(`Can't find ${req.originalUrl} on this server!`);
    return next();
});
app.use(errorHandeler);
module.exports = app;
