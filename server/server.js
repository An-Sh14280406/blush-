require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { ensureDemoAccount } = require('./services/demoSeedService');

// Route imports
const path = require('path');
const fs = require('fs');
const authRoutes = require('./routes/authRoutes');
const periodRoutes = require('./routes/periodRoutes');
const moodRoutes = require('./routes/moodRoutes');
const symptomRoutes = require('./routes/symptomRoutes');
const wellnessRoutes = require('./routes/wellnessRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'blush. ♡ A little world for Ananya',
    time: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/periods', periodRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/wellness', wellnessRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);

// Serve frontend static build when deployed as a unified service
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Error handling middleware
app.use(errorHandler);

// Start Server
const startServer = async () => {
  try {
    await connectDB();
    // Pre-populate Ananya's demo account and historical data
    await ensureDemoAccount();

    app.listen(PORT, () => {
      console.log(`\n🌸 blush. backend server running on http://localhost:${PORT}`);
      console.log(`♡ Ready for Ananya\n`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
