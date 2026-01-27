const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');
const CV = require('./models/CV');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongo:27017/cvbuilder';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connecté');
    startCleanupCron();
  })
  .catch(err => {
    console.error('❌ Erreur MongoDB:', err);
    process.exit(1);
  });

// Cleanup cron job
function startCleanupCron() {
  // Durée de vie des CVs en minutes (5 minutes pour test)
  const CV_LIFETIME_MINUTES = process.env.CV_LIFETIME_MINUTES || 5;

  // Exécuter toutes les minutes
  cron.schedule('* * * * *', async () => {
    try {
      const cutoffDate = new Date(Date.now() - CV_LIFETIME_MINUTES * 60 * 1000);
      const result = await CV.deleteMany({ updatedAt: { $lt: cutoffDate } });

      if (result.deletedCount > 0) {
        console.log(`Nettoyage: ${result.deletedCount} CV(s) supprimé(s) (plus vieux que ${CV_LIFETIME_MINUTES} min)`);
      }
    } catch (error) {
      console.error('Erreur lors du nettoyage:', error);
    }
  });

  console.log(`Cron de nettoyage activé (CVs > ${CV_LIFETIME_MINUTES} min seront supprimés)`);
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cv', require('./routes/cv'));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API CV Builder running',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur serveur interne' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
