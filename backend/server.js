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

// Dynamic CORS Configuration for Local Network & Mobile Devices
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow local network IP addresses, localhost, and requests without origin header
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('10.192.254.186') || origin.startsWith('http://10.') || origin.startsWith('http://192.168.')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
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
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`MindEase Server running in ${process.env.NODE_ENV || 'development'} mode on http://${HOST}:${PORT}`);
});
