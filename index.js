import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import mongoose from 'mongoose';
import {connectDB} from './config/db.js';
import userAuthRouter from './controllers/authControllers.js';
import userDataRouter from './controllers/userControllers.js';
import courseDataRouter from './controllers/courseControllers.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// Connect to MongoDB
connectDB();

// Handle MongoDB events
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected!');
});

mongoose.connection.on('error', (err) => {
    console.log('MongoDB connection error:', err);
});

// Routes
app.get('/', (req, res) => {
    res.json({ message: "Welcome to Express API" });
});

// Use the user authentication routes
app.use("/api", userAuthRouter);
app.use("/auth", userDataRouter);
app.use("/course", courseDataRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
