import React from 'react';
import { FileText, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import './CVStats.css';

const CVStats = ({ cvData }) => {
  const countWords = (text) => {
    if (!text) return 0;
    // Remove HTML tags and count words
    const plainText = text.replace(/<[^>]*>/g, '');
    return plainText.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getTotalWords = () => {
    let total = 0;
    total += countWords(cvData.summary);
    cvData.experience.forEach(exp => {
      total += countWords(exp.description);
    });
    cvData.customSections.forEach(section => {
      section.items.forEach(item => {
        total += countWords(item.description);
      });
    });
    return total;
  };

  const getCompletionScore = () => {
    let score = 0;
    let maxScore = 0;

    // Personal Info (20 points)
    maxScore += 20;
    if (cvData.personalInfo.name) score += 5;
    if (cvData.personalInfo.title) score += 5;
    if (cvData.personalInfo.email) score += 5;
    if (cvData.personalInfo.phone || cvData.personalInfo.location) score += 5;

    // Summary (15 points)
    maxScore += 15;
    const summaryWords = countWords(cvData.summary);
    if (summaryWords >= 30 && summaryWords <= 150) score += 15;
    else if (summaryWords > 0) score += 7;

    // Experience (25 points)
    maxScore += 25;
    if (cvData.experience.length > 0) score += 10;
    if (cvData.experience.length >= 2) score += 15;
    if (cvData.experience.length >= 3) score += 25;

    // Education (15 points)
    maxScore += 15;
    if (cvData.education.length > 0) score += 10;
    if (cvData.education.length >= 2) score += 15;

    // Skills (15 points)
    maxScore += 15;
    if (cvData.skills.length >= 3) score += 10;
    if (cvData.skills.length >= 5) score += 15;

    // Languages (5 points)
    maxScore += 5;
    if (cvData.languages.length > 0) score += 5;

    // Contact links (5 points)
    maxScore += 5;
    if (cvData.personalInfo.linkedin || cvData.personalInfo.website || cvData.personalInfo.github) score += 5;

    return Math.round((score / maxScore) * 100);
  };

  const getChecklist = () => {
    const items = [];
    
    // Must have
    if (!cvData.personalInfo.name || !cvData.personalInfo.title) {
      items.push({ type: 'error', text: 'Nom et titre professionnel requis' });
    }
    if (!cvData.personalInfo.email) {
      items.push({ type: 'error', text: 'Email requis' });
    }
    if (cvData.experience.length === 0) {
      items.push({ type: 'error', text: 'Ajoutez au moins une expérience' });
    }
    
    // Should have
    const summaryWords = countWords(cvData.summary);
    if (summaryWords === 0) {
      items.push({ type: 'warning', text: 'Ajoutez un résumé professionnel' });
    } else if (summaryWords < 30) {
      items.push({ type: 'warning', text: 'Résumé trop court (min 30 mots)' });
    } else if (summaryWords > 150) {
      items.push({ type: 'warning', text: 'Résumé trop long (max 150 mots)' });
    }
    
    if (cvData.education.length === 0) {
      items.push({ type: 'warning', text: 'Ajoutez votre formation' });
    }
    if (cvData.skills.length < 3) {
      items.push({ type: 'warning', text: 'Ajoutez plus de compétences (min 3)' });
    }
    
    // Nice to have
    if (!cvData.personalInfo.linkedin && !cvData.personalInfo.website) {
      items.push({ type: 'info', text: 'Ajoutez LinkedIn ou site web' });
    }
    if (cvData.languages.length === 0) {
      items.push({ type: 'info', text: 'Ajoutez vos langues' });
    }
    
    if (items.length === 0) {
      items.push({ type: 'success', text: 'CV complet ! Prêt à envoyer 🎉' });
    }
    
    return items;
  };

  const totalWords = getTotalWords();
  const completionScore = getCompletionScore();
  const checklist = getChecklist();
  const summaryWords = countWords(cvData.summary);

  const getWordCountColor = (words) => {
    if (words >= 400 && words <= 600) return 'good';
    if (words >= 300 && words < 800) return 'ok';
    return 'warning';
  };

  const getSummaryColor = (words) => {
    if (words >= 30 && words <= 150) return 'good';
    if (words > 0 && words < 30) return 'warning';
    if (words > 150) return 'warning';
    return 'error';
  };

  return (
    <div className="cv-stats">
      <h3>📊 Statistiques & Checklist</h3>
      
      <div className="stats-grid">
        <div className="stat-card">
          <FileText size={20} />
          <div className="stat-content">
            <div className="stat-value">{totalWords} mots</div>
            <div className={`stat-label ${getWordCountColor(totalWords)}`}>
              {totalWords < 400 ? 'Trop court' : totalWords > 600 ? 'Un peu long' : 'Optimal'}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <FileText size={20} />
          <div className="stat-content">
            <div className="stat-value">{summaryWords} mots</div>
            <div className={`stat-label ${getSummaryColor(summaryWords)}`}>
              Résumé
            </div>
          </div>
        </div>

        <div className="stat-card completion">
          <div className="completion-circle">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path
                className="circle-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="circle"
                strokeDasharray={`${completionScore}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="completion-text">{completionScore}%</div>
          </div>
          <div className="stat-label">Complétude</div>
        </div>
      </div>

      <div className="checklist">
        <h4>✓ Checklist</h4>
        <div className="checklist-items">
          {checklist.map((item, index) => (
            <div key={index} className={`checklist-item ${item.type}`}>
              {item.type === 'error' && <XCircle size={16} />}
              {item.type === 'warning' && <AlertCircle size={16} />}
              {item.type === 'info' && <AlertCircle size={16} />}
              {item.type === 'success' && <CheckCircle size={16} />}
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="stats-tips">
        <strong>💡 Conseils :</strong>
        <ul>
          <li>Longueur idéale : 400-600 mots</li>
          <li>Résumé : 30-150 mots</li>
          <li>2-4 expériences récentes</li>
          <li>5-10 compétences clés</li>
        </ul>
      </div>
    </div>
  );
};

export default CVStats;
