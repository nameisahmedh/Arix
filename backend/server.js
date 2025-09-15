/*
================================================================================
| FILE PATH: /backend/server.js                                                |
| ---                                                                          |
| KEY FIX:                                                                     |
| 1. Replaced the generic `app.use(cors())` with a specific configuration that |
|    explicitly allows your frontend at `http://localhost:5173` to make        |
|    authenticated requests. This will solve the 401/403 errors.               |
================================================================================
*/
import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express'; // Removed requireAuth as it's not used globally
import aiRouter from "./routes/aiRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import userRouter from "./routes/userRoutes.js";
import { errorHandler } from "./middleware/auth.js";

dotenv.config();

// Check for required environment variables
const requiredEnvVars = [
  'MONGO_URI',
  'CLERK_SECRET_KEY',
  'GEMINI_API_KEY',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Please check your .env file and ensure all required variables are set.');
  process.exit(1);
}

connectDB();
const app = express();

await connectCloudinary();

// ✅ THIS IS THE CORRECTED CORS CONFIGURATION
const allowedOrigins = [
  'http://localhost:5173', 
  'https://localhost:5173',
  'https://arix-ai.vercel.app',
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  process.env.VERCEL_BRANCH_URL ? `https://${process.env.VERCEL_BRANCH_URL}` : null
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());
app.use(clerkMiddleware());

app.get('/', (req, res) => res.send('Server is Live'));

// Your individual routes are already protected by the `auth` middleware,
// so a global `requireAuth()` is not needed here.
app.use('/api/ai', aiRouter);
app.use('/api/user', userRouter);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
    console.log('✅ All environment variables are configured');
});
