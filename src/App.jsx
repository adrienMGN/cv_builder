import React, { useState, useRef, useEffect } from 'react'
import './App.css'
import CVEditor from './components/CVEditor'
import CVPreview from './components/CVPreview'
import CVStats from './components/CVStats'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import CVList from './components/CVList'
import html2pdf from 'html2pdf.js'
import { Download, Save, Upload, FileJson, Undo, Redo, Moon, Sun, FileText, Copy, LogOut, ArrowLeft } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

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
    photo: ''
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
    }
  ],
  education: [
    {
      id: 1,
      degree: 'Master Informatique',
      school: 'Université Paris-Saclay',
      location: 'Paris, France',
      year: '2019'
    }
  ],
  skills: [
    'JavaScript/TypeScript',
    'React.js',
    'Node.js',
    'Python',
    'Docker',
    'PostgreSQL'
  ],
  languages: [
    { name: 'Français', level: 'Natif' },
    { name: 'Anglais', level: 'Courant' }
  ],
  customSections: [],
  certifications: [],
  sectionOrder: ['summary', 'experience', 'education', 'skills', 'languages', 'certifications', 'customSections'],
  settings: {
    showPhoto: true,
    showSummary: true,
    showExperience: true,
    showEducation: true,
    showSkills: true,
    showLanguages: true,
    showCertifications: true,
    showCustomSections: true
  }
}

function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [showCVList, setShowCVList] = useState(false);
  const [currentCVId, setCurrentCVId] = useState(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState('');

  const [cvData, setCvData] = useState(() => {
    const saved = localStorage.getItem('cvData');
    return saved ? JSON.parse(saved) : initialData;
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'blue';
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [showTemplates, setShowTemplates] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [saveIndicator, setSaveIndicator] = useState(false);
  const [copyIndicator, setCopyIndicator] = useState(false);
  const isUndoRedoAction = useRef(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setShowCVList(true);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  useEffect(() => {
    if (!isUndoRedoAction.current && historyIndex >= 0) {
      localStorage.setItem('cvData', JSON.stringify(cvData));

      setSaveIndicator(true);
      const timer = setTimeout(() => setSaveIndicator(false), 2000);

      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(cvData)));
      if (newHistory.length > 50) newHistory.shift();
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);

      return () => clearTimeout(timer);
    }
    isUndoRedoAction.current = false;
  }, [cvData]);

  useEffect(() => {
    if (!user || !currentCVId) return;

    const timer = setTimeout(async () => {
      await saveToCloud();
    }, 5000);

    return () => clearTimeout(timer);
  }, [cvData, user, currentCVId]);

  const saveToCloud = async () => {
    if (!user || !currentCVId) return;

    try {
      setAutoSaveStatus('💾 Sauvegarde...');
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/cv/${currentCVId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: cvData.personalInfo?.name || 'Mon CV',
          data: cvData
        })
      });

      if (!response.ok) throw new Error('Erreur de sauvegarde');

      setAutoSaveStatus('✓ Sauvegardé');
      setTimeout(() => setAutoSaveStatus(''), 2000);
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      setAutoSaveStatus('❌ Erreur');
      setTimeout(() => setAutoSaveStatus(''), 3000);
    }
  };

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

  const handleLogin = (userData) => {
    setUser(userData);
    setShowCVList(true);
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setShowCVList(true);
  };

  const handleLogout = () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setCurrentCVId(null);
      setShowCVList(false);
      setCvData(initialData);
    }
  };

  const handleSelectCV = (cv) => {
    setCvData(cv.data);
    setCurrentCVId(cv._id);
    setShowCVList(false);
    setHistory([cv.data]);
    setHistoryIndex(0);
  };

  const handleCreateNew = async () => {
    const newCVData = { ...initialData };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/cv`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: 'Nouveau CV',
          data: newCVData
        })
      });

      if (!response.ok) throw new Error('Erreur de création');

      const cv = await response.json();
      setCurrentCVId(cv._id);
      setCvData(newCVData);
      setShowCVList(false);
      setHistory([newCVData]);
      setHistoryIndex(0);
    } catch (error) {
      console.error('Erreur création CV:', error);
      alert('Erreur lors de la création du CV');
    }
  };

  const handleBackToCVList = () => {
    if (confirm('Retourner à la liste des CVs ?')) {
      setShowCVList(true);
      setCurrentCVId(null);
    }
  };

 const notifyDiscordDownload = async ({ name, email, error = null }) => {
  try {
    const success = !error

    await fetch(
      'https://discord.com/api/webhooks/1364376230127734855/An0edU1gXPoDB463kx4EcosWjqGuoKPSEyTr_4aOBvy6aUDzh1bgQ3lvNePZ9YaEdhzs',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'CV Builder',
          embeds: [
            {
              title: success
                ? 'CV téléchargé avec succès'
                : 'Erreur lors du téléchargement du CV',
              color: success ? 0x2ecc71 : 0xe74c3c,
              fields: [
                {
                  name: 'Nom',
                  value: name || 'Inconnu',
                  inline: true,
                },
                {
                  name: 'Email',
                  value: email || 'Non renseigné',
                  inline: true,
                },
                ...(success
                  ? []
                  : [
                      {
                        name: 'Erreur',
                        value: error?.message || error || 'Erreur inconnue',
                        inline: false,
                      },
                    ]),
              ],
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      }
    )
  } catch (err) {
    console.warn('Discord webhook error:', err)
  }
}



  const previewRef = useRef(null)

  const handleDownloadPDF = async () => {
  if (!previewRef.current) return

  try {
    const element = previewRef.current

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `${cvData.personalInfo?.name || 'cv'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }

    const pdfBlob = await html2pdf()
      .set(opt)
      .from(element)
      .outputPdf('blob')

    const url = URL.createObjectURL(pdfBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = opt.filename
    a.click()
    URL.revokeObjectURL(url)

    const formData = new FormData()
    formData.append('pdf', pdfBlob, 'cv.pdf')

    const token = localStorage.getItem('token')

    const res = await fetch(`${API_URL}/api/cv/send-cv`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    })

    if (!res.ok) {
      throw new Error('Erreur envoi mail')
    }

    await notifyDiscordDownload({
      name: cvData.personalInfo?.name,
      email: user?.email,
    })

    alert('PDF téléchargé et envoyé par mail')

  } catch (err) {
    console.error(err)

    await notifyDiscordDownload({
      name: cvData.personalInfo?.name,
      email: user?.email,
      error: err,
    })

    alert('PDF téléchargé mais erreur lors de l\'envoi par mail')
  }
}


  if (!user) {
    return authMode === 'login' ? (
      <Login
        onLogin={handleLogin}
        onSwitchToRegister={() => setAuthMode('register')}
      />
    ) : (
      <Register
        onRegister={handleRegister}
        onSwitchToLogin={() => setAuthMode('login')}
      />
    );
  }

  if (showCVList) {
    return (
      <div className={darkMode ? 'dark-mode' : ''}>
        <div className="app-header no-print" style={{ padding: '20px', background: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ margin: 0, fontSize: '28px' }}>📄 CV Builder Pro</h1>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setDarkMode(!darkMode)} className="btn-action">
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button onClick={handleLogout} className="btn-action">
                <LogOut size={20} /> Déconnexion
              </button>
            </div>
          </div>
        </div>
        <CVList user={user} onSelectCV={handleSelectCV} onCreateNew={handleCreateNew} />
      </div>
    );
  }

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <header className="app-header no-print">
        <div className="header-left">
          <button onClick={handleBackToCVList} className="btn-action">
            <ArrowLeft size={20} /> Mes CVs
          </button>
          <h1>📄 CV Builder Pro</h1>
          {autoSaveStatus && <span className="auto-save-status">{autoSaveStatus}</span>}
        </div>
        <div className="header-actions">
          <button onClick={() => setDarkMode(!darkMode)} className="btn-action">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <select value={theme} onChange={(e) => setTheme(e.target.value)} className="theme-selector">
            <option value="blue">Bleu</option>
            <option value="green">Vert</option>
            <option value="purple">Violet</option>
            <option value="dark">Sombre</option>
          </select>
          <button onClick={handleDownloadPDF} className="btn-action">
            <Download size={20} /> Télécharger PDF
          </button>
          <button onClick={handleLogout} className="btn-action">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <div className="main-container">
        <div className="editor-container">
          <CVStats cvData={cvData} />
          <CVEditor cvData={cvData} setCvData={setCvData} />
        </div>
        <div className="preview-container">
          <CVPreview  ref={previewRef} cvData={cvData} theme={theme} />
        </div>
      </div>
    </div>
  )
}

export default App
