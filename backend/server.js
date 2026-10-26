import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import feedbackRoutes from './routes/feedbackRoutes.js';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Configuration
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sreenandha_feedback';

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing for React frontend
app.use(express.json()); // Parse incoming JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Database connection readiness check middleware for API routes
app.use('/api', (req, res, next) => {
  // readyState 1 means connected, 2 means connecting
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database is currently not connected. Please verify your MONGO_URI in backend/.env and ensure MongoDB Atlas IP access is enabled.',
      dbState: mongoose.connection.readyState,
    });
  }
  next();
});

// Welcome / Health check route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Sreenandha Feedback Admin API',
    status: 'Server is running smoothly',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected / Not configured',
    timestamp: new Date().toISOString(),
  });
});

// Mount Feedback CRUD API Routes
app.use('/api/feedback', feedbackRoutes);

// 404 Route Handler for undefined endpoints
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Endpoint not found`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Database Connection & Server Initialization
const startServer = async () => {
  console.log('Connecting to MongoDB...');
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // 5-second timeout for quick feedback
    });
    console.log('✅ Successfully connected to MongoDB Database');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.log('ℹ️ Tip: Check backend/.env MONGO_URI and ensure MongoDB Atlas Network Access allows 0.0.0.0/0');
  }

  // Start Express listener
  app.listen(PORT, () => {
    console.log(`🚀 Sreenandha Feedback Admin Backend running on http://localhost:${PORT}`);
    console.log(`📡 Feedback API Base Endpoint: http://localhost:${PORT}/api/feedback`);
  });
};

// Listen to Mongoose connection lifecycle events
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ Mongoose disconnected from MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err.message);
});

startServer();

export default app;
