import dotenv from 'dotenv'
import mongoose from 'mongoose';

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});


dotenv.config({ path: './.env' });
const app = require('./app');

mongoose.set('strictQuery', false);

mongoose.connect(process.env.DATABASE as string).then(() => {
  console.log('Database is connected');
}).catch((error) => {
  console.error('Failed to connect to the database:', error);
  process.exit(1);
});


const port: number = 5000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});


process.on('unhandledRejection', (err:any) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});