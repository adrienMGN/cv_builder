const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const CV = require('../models/CV');
const { Resend } = require('resend');
const multer = require('multer');
const User = require('../models/User');

const resend = new Resend(process.env.RESEND_API_KEY);
const upload = multer();


const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware pour vérifier le token
const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Accès refusé' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide' });
  }
};

// @route   GET /api/cv
router.get('/', auth, async (req, res) => {
  try {
    const cvs = await CV.find({ userId: req.userId }).sort({ updatedAt: -1 });
    res.json(cvs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/cv/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const cv = await CV.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!cv) {
      return res.status(404).json({ message: 'CV non trouvé' });
    }

    res.json(cv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   POST /api/cv
router.post('/', auth, async (req, res) => {
  try {
    const { name, data } = req.body;

    const cv = new CV({
      userId: req.userId,
      name: name || 'Mon CV',
      data
    });

    await cv.save();
    res.status(201).json(cv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   PUT /api/cv/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, data } = req.body;

    let cv = await CV.findOne({ _id: req.params.id, userId: req.userId });

    if (!cv) {
      return res.status(404).json({ message: 'CV non trouvé' });
    }

    cv.name = name || cv.name;
    cv.data = data || cv.data;
    cv.updatedAt = Date.now();

    await cv.save();
    res.json(cv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   DELETE /api/cv/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const cv = await CV.findOneAndDelete({ _id: req.params.id, userId: req.userId });

    if (!cv) {
      return res.status(404).json({ message: 'CV non trouvé' });
    }

    res.json({ message: 'CV supprimé' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/send-cv', auth, upload.single('pdf'), async (req, res) => {
  try {
    const pdfBuffer = req.file?.buffer;

    if (!pdfBuffer) {
      return res.status(400).json({ message: 'PDF manquant' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const { data, error } = await resend.emails.send({
      from: 'CV Builder <onboarding@resend.dev>',
      to: user.email,
      subject: 'Votre CV en PDF',
      html: `
        <p>Bonjour ${user.name || ''},</p>
        <p>Voici votre CV généré depuis <b>CV Builder</b>.</p>
      `,
      attachments: [
        {
          filename: 'cv.pdf',
          content: pdfBuffer.toString('base64'),
        },
      ],
    });

    if (error) {
      console.error('RESEND ERROR:', error);
      return res.status(500).json({ error });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'envoi du CV" });
  }
});


module.exports = router;
