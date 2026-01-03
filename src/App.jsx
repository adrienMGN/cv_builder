import React, { useState, useRef, useEffect } from 'react'
import './App.css'
import CVEditor from './components/CVEditor'
import CVPreview from './components/CVPreview'
import CVStats from './components/CVStats'
import { Download, Printer, Save, Upload, FileJson, Undo, Redo, Moon, Sun, FileText, Copy } from 'lucide-react'

const initialData = {
  personalInfo: {
    name: 'Jean Dupont',
    title: 'Développeur Full Stack',
    email: 'jean.dupont@email.com',
    phone: '+33 6 12 34 56 78',
    location: 'Paris, France',
    linkedin: 'linkedin.com/in/jeandupont',
    website: 'jeandupont.dev',
    github: '',
    photo: '' // URL de la photo
  },
  summary: 'Développeur Full Stack passionné avec 5+ années d\'expérience dans la création d\'applications web modernes. Expert en React, Node.js et architectures cloud.',
  experience: [
    {
      id: 1,
      title: 'Développeur Full Stack Senior',
      company: 'TechCorp',
      location: 'Paris, France',
      startDate: '2021',
      endDate: 'Présent',
      description: '• Développement d\'applications React/Node.js\n• Architecture microservices\n• Leadership technique d\'une équipe de 4 développeurs'
    },
    {
      id: 2,
      title: 'Développeur Frontend',
      company: 'WebAgency',
      location: 'Lyon, France',
      startDate: '2019',
      endDate: '2021',
      description: '• Création d\'interfaces utilisateur modernes\n• Optimisation des performances web\n• Collaboration avec les équipes design'
    }
  ],
  education: [
    {
      id: 1,
      degree: 'Master Informatique',
      school: 'Université Paris-Saclay',
      location: 'Paris, France',
      year: '2019'
    },
    {
      id: 2,
      degree: 'Licence Informatique',
      school: 'Université Lyon 1',
      location: 'Lyon, France',
      year: '2017'
    }
  ],
  skills: [
    'JavaScript/TypeScript',
    'React.js',
    'Node.js',
    'Python',
    'Docker',
    'PostgreSQL',
    'MongoDB',
    'Git',
    'AWS',
    'CI/CD'
  ],
  languages: [
    { name: 'Français', level: 'Natif' },
    { name: 'Anglais', level: 'Courant' },
    { name: 'Espagnol', level: 'Intermédiaire' }
  ],
  customSections: [
    {
      id: 1,
      title: 'Projets',
      items: [
        {
          id: 1,
          title: 'E-commerce Platform',
          description: 'Plateforme de vente en ligne avec React et Node.js',
          link: 'https://github.com/exemple'
        }
      ]
    }
  ],
  certifications: [
    {
      id: 1,
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      year: '2023',
      link: ''
    }
  ],
  sectionOrder: [
    'summary',
    'experience',
    'education',
    'skills',
    'languages',
    'certifications',
    'customSections'
  ],
  settings: {
    showPhoto: true,
    showSummary: true,
    showExperience: true,
    showEducation: true,
    showSkills: true,
    showLanguages: true,
    showCertifications: true,
    showCustomSections: true,
    layout: 'modern' // modern, classic, minimal
  }
}

function App() {
  const [cvData, setCvData] = useState(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('cvData');
    return saved ? JSON.parse(saved) : initialData;
  })
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'blue';
  })
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  })
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [showTemplates, setShowTemplates] = useState(false)
  const fileInputRef = useRef(null)
  const isUndoRedoAction = useRef(false)
  const [saveIndicator, setSaveIndicator] = useState(false)
  const [copyIndicator, setCopyIndicator] = useState(false)

  // Auto-save to localStorage
  useEffect(() => {
    if (!isUndoRedoAction.current) {
      localStorage.setItem('cvData', JSON.stringify(cvData));
      
      // Show save indicator
      setSaveIndicator(true);
      const timer = setTimeout(() => setSaveIndicator(false), 2000);
      
      // Add to history for undo/redo
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(cvData)));
      if (newHistory.length > 50) newHistory.shift(); // Keep last 50 states
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      
      return () => clearTimeout(timer);
    }
    isUndoRedoAction.current = false;
  }, [cvData]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e) => {
      // Ctrl/Cmd + S: Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveData();
      }
      // Ctrl/Cmd + P: Print
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        handlePrint();
      }
      // Ctrl/Cmd + Z: Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y: Redo
      if ((e.ctrlKey || e.metaKey) && (e.shiftKey && e.key === 'z' || e.key === 'y')) {
        e.preventDefault();
        handleRedo();
      }
      // Ctrl/Cmd + D: Toggle dark mode
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        setDarkMode(!darkMode);
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [darkMode, historyIndex, history]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      isUndoRedoAction.current = true;
      setHistoryIndex(historyIndex - 1);
      setCvData(JSON.parse(JSON.stringify(history[historyIndex - 1])));
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      isUndoRedoAction.current = true;
      setHistoryIndex(historyIndex + 1);
      setCvData(JSON.parse(JSON.stringify(history[historyIndex + 1])));
    }
  };

  const loadTemplate = (templateName) => {
    const templates = {
      tech: {
        ...initialData,
        personalInfo: {
          ...initialData.personalInfo,
          name: 'Votre Nom',
          title: 'Développeur Full Stack',
        },
        summary: 'Développeur passionné avec expertise en <b>React</b>, <b>Node.js</b> et <span style="color:#1a73e8">architectures cloud</span>.',
        sectionOrder: ['skills', 'experience', 'education', 'certifications', 'customSections', 'languages', 'summary']
      },
      creative: {
        ...initialData,
        personalInfo: {
          ...initialData.personalInfo,
          name: 'Votre Nom',
          title: 'Designer UI/UX',
        },
        summary: 'Designer créatif spécialisé en <i>expérience utilisateur</i> et <b>interfaces modernes</b>.',
        sectionOrder: ['customSections', 'experience', 'skills', 'education', 'summary', 'languages', 'certifications']
      },
      manager: {
        ...initialData,
        personalInfo: {
          ...initialData.personalInfo,
          name: 'Votre Nom',
          title: 'Manager / Chef de Projet',
        },
        summary: 'Manager expérimenté avec <b>10+ ans</b> de <u>leadership</u> et gestion d\'équipes techniques.',
        sectionOrder: ['summary', 'experience', 'education', 'skills', 'languages', 'certifications', 'customSections']
      },
      minimal: {
        personalInfo: {
          name: 'Votre Nom',
          title: 'Votre Titre',
          email: 'email@exemple.com',
          phone: '',
          location: '',
          linkedin: '',
          website: '',
          github: '',
          photo: ''
        },
        summary: '',
        experience: [],
        education: [],
        skills: [],
        languages: [],
        certifications: [],
        customSections: [],
        sectionOrder: ['summary', 'experience', 'education', 'skills', 'languages', 'certifications', 'customSections'],
        settings: {
          showPhoto: false,
          showSummary: true,
          showExperience: true,
          showEducation: true,
          showSkills: true,
          showLanguages: false,
          showCertifications: false,
          showCustomSections: false,
          layout: 'modern'
        }
      }
    };
    
    setCvData(templates[templateName]);
    setShowTemplates(false);
  };

  const copyAsPlainText = () => {
    const removeHTML = (text) => text ? text.replace(/<[^>]*>/g, '').replace(/\n\n+/g, '\n') : '';
    
    let plainText = '';
    
    // Header
    plainText += `${cvData.personalInfo.name}\n`;
    plainText += `${cvData.personalInfo.title}\n\n`;
    
    // Contact
    if (cvData.personalInfo.email) plainText += `Email: ${cvData.personalInfo.email}\n`;
    if (cvData.personalInfo.phone) plainText += `Téléphone: ${cvData.personalInfo.phone}\n`;
    if (cvData.personalInfo.location) plainText += `Localisation: ${cvData.personalInfo.location}\n`;
    if (cvData.personalInfo.linkedin) plainText += `LinkedIn: ${cvData.personalInfo.linkedin}\n`;
    if (cvData.personalInfo.website) plainText += `Site web: ${cvData.personalInfo.website}\n`;
    if (cvData.personalInfo.github) plainText += `GitHub: ${cvData.personalInfo.github}\n`;
    plainText += '\n';
    
    // Summary
    if (cvData.settings.showSummary && cvData.summary) {
      plainText += `RÉSUMÉ PROFESSIONNEL\n`;
      plainText += `${removeHTML(cvData.summary)}\n\n`;
    }
    
    // Experience
    if (cvData.settings.showExperience && cvData.experience.length > 0) {
      plainText += `EXPÉRIENCE PROFESSIONNELLE\n\n`;
      cvData.experience.forEach(exp => {
        plainText += `${exp.title} - ${exp.company}\n`;
        plainText += `${exp.startDate} - ${exp.endDate} | ${exp.location}\n`;
        plainText += `${removeHTML(exp.description)}\n\n`;
      });
    }
    
    // Education
    if (cvData.settings.showEducation && cvData.education.length > 0) {
      plainText += `FORMATION\n\n`;
      cvData.education.forEach(edu => {
        plainText += `${edu.degree} - ${edu.school}\n`;
        plainText += `${edu.year} | ${edu.location}\n\n`;
      });
    }
    
    // Skills
    if (cvData.settings.showSkills && cvData.skills.length > 0) {
      plainText += `COMPÉTENCES\n`;
      plainText += cvData.skills.join(' • ') + '\n\n';
    }
    
    // Languages
    if (cvData.settings.showLanguages && cvData.languages.length > 0) {
      plainText += `LANGUES\n`;
      cvData.languages.forEach(lang => {
        plainText += `${lang.name}: ${lang.level}\n`;
      });
      plainText += '\n';
    }
    
    // Certifications
    if (cvData.settings.showCertifications && cvData.certifications.length > 0) {
      plainText += `CERTIFICATIONS\n`;
      cvData.certifications.forEach(cert => {
        plainText += `${cert.name} - ${cert.issuer} (${cert.year})\n`;
        if (cert.link) plainText += `Lien: ${cert.link}\n`;
      });
      plainText += '\n';
    }
    
    // Custom Sections
    if (cvData.settings.showCustomSections && cvData.customSections.length > 0) {
      cvData.customSections.forEach(section => {
        plainText += `${section.title.toUpperCase()}\n\n`;
        section.items.forEach(item => {
          plainText += `${item.title}\n`;
          if (item.description) plainText += `${removeHTML(item.description)}\n`;
          if (item.link) plainText += `Lien: ${item.link}\n`;
          plainText += '\n';
        });
      });
    }
    
    navigator.clipboard.writeText(plainText).then(() => {
      setCopyIndicator(true);
      setTimeout(() => setCopyIndicator(false), 2000);
    });
  };

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = () => {
    // Ouvrir la boîte de dialogue d'impression
    window.print()
  }

  const handleSaveData = () => {
    const dataStr = JSON.stringify(cvData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `cv-${cvData.personalInfo.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleLoadData = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          setCvData(data)
        } catch (error) {
          alert('Erreur lors du chargement du fichier. Assurez-vous qu\'il s\'agit d\'un fichier JSON valide.')
        }
      }
      reader.readAsText(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <header className="app-header no-print">
        <h1>📄 CV Builder Pro</h1>
        <p>Créez votre CV professionnel en quelques minutes</p>
        <div className="header-actions">
          <button 
            onClick={() => setShowTemplates(!showTemplates)} 
            className="btn-action"
            title="Choisir un template (Ctrl+T)"
          >
            <FileText size={20} />
            Templates
          </button>
          <button 
            onClick={handleUndo} 
            className="btn-action"
            disabled={historyIndex <= 0}
            title="Annuler (Ctrl+Z)"
          >
            <Undo size={20} />
          </button>
          <button 
            onClick={handleRedo} 
            className="btn-action"
            disabled={historyIndex >= history.length - 1}
            title="Refaire (Ctrl+Shift+Z)"
          >
            <Redo size={20} />
          </button>
          <button 
            onClick={copyAsPlainText} 
            className="btn-action"
            title="Copier en texte brut"
          >
            <Copy size={20} />
            Copier
          </button>
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className="btn-action"
            title="Mode sombre (Ctrl+D)"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <select 
            value={theme} 
            onChange={(e) => setTheme(e.target.value)}
            className="theme-selector"
          >
            <option value="blue">Thème Bleu</option>
            <option value="green">Thème Vert</option>
            <option value="purple">Thème Violet</option>
            <option value="dark">Thème Sombre</option>
          </select>
          <button onClick={triggerFileInput} className="btn-action" title="Charger un CV existant">
            <Upload size={20} />
            Charger
          </button>
          <input 
            ref={fileInputRef}
            type="file" 
            accept=".json"
            onChange={handleLoadData}
            style={{ display: 'none' }}
          />
          <button onClick={handleSaveData} className="btn-action" title="Sauvegarder le CV (Ctrl+S)">
            <Save size={20} />
            Sauvegarder
          </button>
          <button onClick={handlePrint} className="btn-action" title="Imprimer (Ctrl+P)">
            <Printer size={20} />
            Imprimer
          </button>
          <button onClick={handleDownloadPDF} className="btn-action btn-primary">
            <Download size={20} />
            Télécharger PDF
          </button>
        </div>
      </header>

      {showTemplates && (
        <div className="templates-modal no-print">
          <div className="templates-content">
            <h2>Choisir un Template</h2>
            <p className="templates-description">Démarrez rapidement avec un modèle prédéfini</p>
            <div className="templates-grid">
              <div className="template-card" onClick={() => loadTemplate('tech')}>
                <div className="template-icon">💻</div>
                <h3>Tech / Développeur</h3>
                <p>Compétences en avant, parfait pour développeurs</p>
              </div>
              <div className="template-card" onClick={() => loadTemplate('creative')}>
                <div className="template-icon">🎨</div>
                <h3>Créatif / Designer</h3>
                <p>Portfolio et projets en vedette</p>
              </div>
              <div className="template-card" onClick={() => loadTemplate('manager')}>
                <div className="template-icon">👔</div>
                <h3>Manager / Chef de Projet</h3>
                <p>Expérience et leadership mis en valeur</p>
              </div>
              <div className="template-card" onClick={() => loadTemplate('minimal')}>
                <div className="template-icon">📄</div>
                <h3>Minimaliste</h3>
                <p>Commencer avec une base vide</p>
              </div>
            </div>
            <button onClick={() => setShowTemplates(false)} className="btn-close-templates">
              Fermer
            </button>
          </div>
        </div>
      )}


      <div className="app-content">
        <div className="editor-section no-print">
          <CVEditor cvData={cvData} setCvData={setCvData} />
          <CVStats cvData={cvData} />
        </div>
        <div className="preview-section">
          <CVPreview cvData={cvData} theme={theme} />
        </div>
      </div>

      {saveIndicator && (
        <div className="save-indicator">
          ✓ Sauvegarde automatique
        </div>
      )}

      {copyIndicator && (
        <div className="copy-indicator">
          ✓ Copié dans le presse-papier !
        </div>
      )}
    </div>
  )
}

export default App
