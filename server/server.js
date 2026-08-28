const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
// app.use('/api/moods', require('./src/routes/moodRoutes'));
// app.use('/api/journals', require('./src/routes/journalRoutes'));
// app.use('/api/ai', require('./src/routes/aiRoutes'));

app.get('/', (req, res) => {
  res.send('MindEase API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
