"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
// process.on('uncaughtException', err => {
//   console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
//   console.log(err.name, err.message);
//   process.exit(1);
// });
dotenv_1.default.config({ path: './.env' });
const app = require('./app');
mongoose_1.default.set('strictQuery', false);
mongoose_1.default.connect(process.env.DATABASE).then(() => {
    console.log('Database is connected');
}).catch((error) => {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
});
const port = 5000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
// process.on('unhandledRejection', (err:any) => {
//   console.log('UNHANDLED REJECTION! 💥 Shutting down...');
//   console.log(err.name, err.message);
//   server.close(() => {
//     process.exit(1);
//   });
// });
// process.on('SIGTERM', () => {
//   console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
//   server.close(() => {
//     console.log('💥 Process terminated!');
//   });
// });
