const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Security Middlewares
app.use(helmet());

// CORS Configuration
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

// Body and Cookie Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use('/api/health', require('./routes/healthRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/checkins', require('./routes/checkInRoutes'));
app.use('/api/journal', require('./routes/journalRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/insights', require('./routes/insightRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/advanced-intelligence', require('./routes/advancedIntelligenceRoutes'));
app.use('/api/smallwins', require('./routes/smallWinRoutes'));
app.use('/api/privacy', require('./routes/privacyRoutes'));
app.use('/api/transparency', require('./routes/transparencyRoutes'));
app.use('/api/advanced-features', require('./routes/advancedFeaturesRoutes'));

// Error Middlewares
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`MindEase Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});
