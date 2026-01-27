import { useState, useEffect } from 'react';
import './CVList.css';

const API_URL = 'http://localhost:5001';

export default function CVList({ onSelectCV, onCreateNew, user }) {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCVs();
  }, []);

  const fetchCVs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/cv`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Erreur lors du chargement');

      const data = await response.json();
      setCvs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();

    if (!confirm('Êtes-vous sûr de vouloir supprimer ce CV ?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/cv/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');

      setCvs(cvs.filter(cv => cv._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="cv-list-loading">
        <div className="spinner"></div>
        <p>Chargement de vos CVs...</p>
      </div>
    );
  }

  return (
    <div className="cv-list-container">
      <div className="cv-list-header">
        <div>
          <h2>Mes CV</h2>
          <p className="cv-list-subtitle">Bienvenue {user?.name} 👋</p>
        </div>
        <button onClick={onCreateNew} className="btn-new-cv">
          ➕ Nouveau CV
        </button>
      </div>

      {error && <div className="cv-list-error">❌ {error}</div>}

      {cvs.length === 0 ? (
        <div className="cv-list-empty">
          <div className="empty-icon">📄</div>
          <h3>Aucun CV enregistré</h3>
          <p>Commencez par créer votre premier CV professionnel</p>
          <button onClick={onCreateNew} className="btn-new-cv-large">
            ✨ Créer mon premier CV
          </button>
        </div>
      ) : (
        <div className="cv-grid">
          {cvs.map(cv => (
            <div key={cv._id} className="cv-card" onClick={() => onSelectCV(cv)}>
              <div className="cv-card-icon">📄</div>
              <div className="cv-card-content">
                <div className="cv-card-header">
                  <h3>{cv.name}</h3>
                  <button
                    onClick={(e) => handleDelete(cv._id, e)}
                    className="btn-delete"
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
                <p className="cv-card-info">
                  {cv.data.personalInfo?.name || 'Sans nom'}
                </p>
                <p className="cv-card-date">
                  📅 Modifié le {new Date(cv.updatedAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
