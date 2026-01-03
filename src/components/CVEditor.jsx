import React, { useRef, useState } from 'react'
import './CVEditor.css'
import { Plus, Trash2, Upload, X, Eye, EyeOff } from 'lucide-react'
import SectionManager from './SectionManager'
import RichTextEditor from './RichTextEditor'
import DraggableItem from './DraggableItem'

const CVEditor = ({ cvData, setCvData }) => {
  const photoInputRef = useRef(null)
  const [draggedExpIndex, setDraggedExpIndex] = useState(null);
  const [draggedEduIndex, setDraggedEduIndex] = useState(null);
  const [draggedCertIndex, setDraggedCertIndex] = useState(null);
  const [draggedCustomItemIndex, setDraggedCustomItemIndex] = useState(null);
  const [draggedCustomItemSection, setDraggedCustomItemSection] = useState(null);

  const updatePersonalInfo = (field, value) => {
    setCvData({
      ...cvData,
      personalInfo: { ...cvData.personalInfo, [field]: value }
    })
  }

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('La taille de l\'image ne doit pas dépasser 2 Mo')
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        updatePersonalInfo('photo', e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    updatePersonalInfo('photo', '')
  }

  const toggleSetting = (setting) => {
    setCvData({
      ...cvData,
      settings: { ...cvData.settings, [setting]: !cvData.settings[setting] }
    })
  }

  const updateSummary = (value) => {
    setCvData({ ...cvData, summary: value })
  }

  const addExperience = () => {
    const newExp = {
      id: Date.now(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    }
    setCvData({ ...cvData, experience: [...cvData.experience, newExp] })
  }

  const updateExperience = (id, field, value) => {
    setCvData({
      ...cvData,
      experience: cvData.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    })
  }

  const deleteExperience = (id) => {
    setCvData({
      ...cvData,
      experience: cvData.experience.filter(exp => exp.id !== id)
    })
  }

  const addEducation = () => {
    const newEdu = {
      id: Date.now(),
      degree: '',
      school: '',
      location: '',
      year: ''
    }
    setCvData({ ...cvData, education: [...cvData.education, newEdu] })
  }

  const updateEducation = (id, field, value) => {
    setCvData({
      ...cvData,
      education: cvData.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    })
  }

  const deleteEducation = (id) => {
    setCvData({
      ...cvData,
      education: cvData.education.filter(edu => edu.id !== id)
    })
  }

  const addSkill = () => {
    setCvData({ ...cvData, skills: [...cvData.skills, ''] })
  }

  const updateSkill = (index, value) => {
    const newSkills = [...cvData.skills]
    newSkills[index] = value
    setCvData({ ...cvData, skills: newSkills })
  }

  const deleteSkill = (index) => {
    setCvData({
      ...cvData,
      skills: cvData.skills.filter((_, i) => i !== index)
    })
  }

  const addLanguage = () => {
    setCvData({
      ...cvData,
      languages: [...cvData.languages, { name: '', level: '' }]
    })
  }

  const updateLanguage = (index, field, value) => {
    const newLanguages = [...cvData.languages]
    newLanguages[index] = { ...newLanguages[index], [field]: value }
    setCvData({ ...cvData, languages: newLanguages })
  }

  const deleteLanguage = (index) => {
    setCvData({
      ...cvData,
      languages: cvData.languages.filter((_, i) => i !== index)
    })
  }

  const addCertification = () => {
    const newCert = {
      id: Date.now(),
      name: '',
      issuer: '',
      year: '',
      link: ''
    }
    setCvData({ ...cvData, certifications: [...cvData.certifications, newCert] })
  }

  const updateCertification = (id, field, value) => {
    setCvData({
      ...cvData,
      certifications: cvData.certifications.map(cert =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    })
  }

  const deleteCertification = (id) => {
    setCvData({
      ...cvData,
      certifications: cvData.certifications.filter(cert => cert.id !== id)
    })
  }

  const addCustomSection = () => {
    const newSection = {
      id: Date.now(),
      title: 'Nouvelle Section',
      items: [{ id: Date.now(), title: '', description: '', link: '' }]
    }
    setCvData({ ...cvData, customSections: [...cvData.customSections, newSection] })
  }

  const updateCustomSection = (sectionId, field, value) => {
    setCvData({
      ...cvData,
      customSections: cvData.customSections.map(section =>
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    })
  }

  const deleteCustomSection = (sectionId) => {
    setCvData({
      ...cvData,
      customSections: cvData.customSections.filter(section => section.id !== sectionId)
    })
  }

  const addCustomSectionItem = (sectionId) => {
    setCvData({
      ...cvData,
      customSections: cvData.customSections.map(section =>
        section.id === sectionId
          ? { ...section, items: [...section.items, { id: Date.now(), title: '', description: '', link: '' }] }
          : section
      )
    })
  }

  const updateCustomSectionItem = (sectionId, itemId, field, value) => {
    setCvData({
      ...cvData,
      customSections: cvData.customSections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map(item =>
                item.id === itemId ? { ...item, [field]: value } : item
              )
            }
          : section
      )
    })
  }

  const deleteCustomSectionItem = (sectionId, itemId) => {
    setCvData({
      ...cvData,
      customSections: cvData.customSections.map(section =>
        section.id === sectionId
          ? { ...section, items: section.items.filter(item => item.id !== itemId) }
          : section
      )
    })
  }

  const handleSectionReorder = (newSections) => {
    const newOrder = newSections.map(s => s.key);
    setCvData({ ...cvData, sectionOrder: newOrder });
  };

  const getSectionsConfig = () => {
    const baseOrder = cvData.sectionOrder || [
      'summary', 'experience', 'education', 'skills', 'languages', 'certifications', 'customSections'
    ];
    
    return baseOrder.map(key => ({
      key,
      label: {
        summary: 'Résumé',
        experience: 'Expérience',
        education: 'Formation',
        skills: 'Compétences',
        languages: 'Langues',
        certifications: 'Certifications',
        customSections: 'Sections personnalisées'
      }[key],
      visible: cvData.settings[`show${key.charAt(0).toUpperCase() + key.slice(1)}`] !== false
    }));
  };

  const handleToggleSectionVisibility = (key) => {
    const settingKey = `show${key.charAt(0).toUpperCase() + key.slice(1)}`;
    toggleSetting(settingKey);
  };

  // Drag and drop handlers for Experience
  const handleExpDragStart = (e, index) => {
    setDraggedExpIndex(index);
  };

  const handleExpDragOver = (e, index) => {
    e.preventDefault();
    if (draggedExpIndex === null || draggedExpIndex === index) return;
    
    const items = [...cvData.experience];
    const draggedItem = items[draggedExpIndex];
    items.splice(draggedExpIndex, 1);
    items.splice(index, 0, draggedItem);
    
    setCvData({ ...cvData, experience: items });
    setDraggedExpIndex(index);
  };

  const handleExpDragEnd = () => {
    setDraggedExpIndex(null);
  };

  // Drag and drop handlers for Education
  const handleEduDragStart = (e, index) => {
    setDraggedEduIndex(index);
  };

  const handleEduDragOver = (e, index) => {
    e.preventDefault();
    if (draggedEduIndex === null || draggedEduIndex === index) return;
    
    const items = [...cvData.education];
    const draggedItem = items[draggedEduIndex];
    items.splice(draggedEduIndex, 1);
    items.splice(index, 0, draggedItem);
    
    setCvData({ ...cvData, education: items });
    setDraggedEduIndex(index);
  };

  const handleEduDragEnd = () => {
    setDraggedEduIndex(null);
  };

  // Drag and drop handlers for Certifications
  const handleCertDragStart = (e, index) => {
    setDraggedCertIndex(index);
  };

  const handleCertDragOver = (e, index) => {
    e.preventDefault();
    if (draggedCertIndex === null || draggedCertIndex === index) return;
    
    const items = [...cvData.certifications];
    const draggedItem = items[draggedCertIndex];
    items.splice(draggedCertIndex, 1);
    items.splice(index, 0, draggedItem);
    
    setCvData({ ...cvData, certifications: items });
    setDraggedCertIndex(index);
  };

  const handleCertDragEnd = () => {
    setDraggedCertIndex(null);
  };

  // Drag and drop handlers for Custom Section Items
  const handleCustomItemDragStart = (sectionId, index) => {
    setDraggedCustomItemSection(sectionId);
    setDraggedCustomItemIndex(index);
  };

  const handleCustomItemDragOver = (sectionId, index) => {
    if (draggedCustomItemIndex === null || draggedCustomItemIndex === index || draggedCustomItemSection !== sectionId) return;
    
    const sections = cvData.customSections.map(section => {
      if (section.id === sectionId) {
        const items = [...section.items];
        const draggedItem = items[draggedCustomItemIndex];
        items.splice(draggedCustomItemIndex, 1);
        items.splice(index, 0, draggedItem);
        setDraggedCustomItemIndex(index);
        return { ...section, items };
      }
      return section;
    });
    
    setCvData({ ...cvData, customSections: sections });
  };

  const handleCustomItemDragEnd = () => {
    setDraggedCustomItemIndex(null);
    setDraggedCustomItemSection(null);
  };

  return (
    <div className="cv-editor">
      <h2>✏️ Éditer votre CV</h2>

      <SectionManager
        sections={getSectionsConfig()}
        onReorder={handleSectionReorder}
        onToggleVisibility={handleToggleSectionVisibility}
      />

      <section className="editor-section">
        <h3>Paramètres d'affichage</h3>
        <div className="settings-grid">
          <label className="toggle-setting">
            <input
              type="checkbox"
              checked={cvData.settings.showPhoto}
              onChange={() => toggleSetting('showPhoto')}
            />
            <span>Afficher la photo</span>
          </label>
          <label className="toggle-setting">
            <input
              type="checkbox"
              checked={cvData.settings.showSummary}
              onChange={() => toggleSetting('showSummary')}
            />
            <span>Afficher le résumé</span>
          </label>
          <label className="toggle-setting">
            <input
              type="checkbox"
              checked={cvData.settings.showExperience}
              onChange={() => toggleSetting('showExperience')}
            />
            <span>Afficher l'expérience</span>
          </label>
          <label className="toggle-setting">
            <input
              type="checkbox"
              checked={cvData.settings.showEducation}
              onChange={() => toggleSetting('showEducation')}
            />
            <span>Afficher la formation</span>
          </label>
          <label className="toggle-setting">
            <input
              type="checkbox"
              checked={cvData.settings.showSkills}
              onChange={() => toggleSetting('showSkills')}
            />
            <span>Afficher les compétences</span>
          </label>
          <label className="toggle-setting">
            <input
              type="checkbox"
              checked={cvData.settings.showLanguages}
              onChange={() => toggleSetting('showLanguages')}
            />
            <span>Afficher les langues</span>
          </label>
        </div>
      </section>

      <section className="editor-section">
        <h3>Informations Personnelles</h3>
        
        <div className="photo-upload-section">
          <h4>Photo de profil</h4>
          {cvData.personalInfo.photo ? (
            <div className="photo-preview">
              <img src={cvData.personalInfo.photo} alt="Photo de profil" />
              <button onClick={removePhoto} className="btn-remove-photo">
                <X size={16} /> Retirer la photo
              </button>
            </div>
          ) : (
            <button 
              onClick={() => photoInputRef.current?.click()} 
              className="btn-upload-photo"
            >
              <Upload size={16} /> Ajouter une photo
            </button>
          )}
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{ display: 'none' }}
          />
          <p className="photo-hint">Format recommandé : carré, max 2 Mo</p>
        </div>

        <input
          type="text"
          placeholder="Nom complet"
          value={cvData.personalInfo.name}
          onChange={(e) => updatePersonalInfo('name', e.target.value)}
        />
        <input
          type="text"
          placeholder="Titre professionnel"
          value={cvData.personalInfo.title}
          onChange={(e) => updatePersonalInfo('title', e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={cvData.personalInfo.email}
          onChange={(e) => updatePersonalInfo('email', e.target.value)}
        />
        <input
          type="tel"
          placeholder="Téléphone"
          value={cvData.personalInfo.phone}
          onChange={(e) => updatePersonalInfo('phone', e.target.value)}
        />
        <input
          type="text"
          placeholder="Localisation"
          value={cvData.personalInfo.location}
          onChange={(e) => updatePersonalInfo('location', e.target.value)}
        />
        <input
          type="text"
          placeholder="LinkedIn (ex: linkedin.com/in/username)"
          value={cvData.personalInfo.linkedin}
          onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
        />
        <input
          type="text"
          placeholder="GitHub (ex: github.com/username)"
          value={cvData.personalInfo.github || ''}
          onChange={(e) => updatePersonalInfo('github', e.target.value)}
        />
        <input
          type="text"
          placeholder="Site web (ex: monsite.com)"
          value={cvData.personalInfo.website}
          onChange={(e) => updatePersonalInfo('website', e.target.value)}
        />
      </section>

      <section className="editor-section">
        <h3>Résumé Professionnel</h3>
        <RichTextEditor
          value={cvData.summary}
          onChange={updateSummary}
          placeholder="Résumé de votre profil professionnel..."
        />
      </section>

      <section className="editor-section">
        <div className="section-header">
          <h3>Expérience Professionnelle</h3>
          <button onClick={addExperience} className="btn-add">
            <Plus size={16} /> Ajouter
          </button>
        </div>
        {cvData.experience.map((exp, index) => (
          <DraggableItem
            key={exp.id}
            id={exp.id}
            index={index}
            onDelete={deleteExperience}
            onDragStart={handleExpDragStart}
            onDragOver={handleExpDragOver}
            onDragEnd={handleExpDragEnd}
            isDragging={draggedExpIndex === index}
          >
            <input
              type="text"
              placeholder="Titre du poste"
              value={exp.title}
              onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
            />
            <input
              type="text"
              placeholder="Entreprise"
              value={exp.company}
              onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
            />
            <input
              type="text"
              placeholder="Localisation"
              value={exp.location}
              onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
            />
            <div className="date-range">
              <input
                type="text"
                placeholder="Début"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
              />
              <input
                type="text"
                placeholder="Fin"
                value={exp.endDate}
                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
              />
            </div>
            <RichTextEditor
              value={exp.description}
              onChange={(value) => updateExperience(exp.id, 'description', value)}
              placeholder="Description (utilisez • pour les points)"
            />
          </DraggableItem>
        ))}
      </section>

      <section className="editor-section">
        <div className="section-header">
          <h3>Formation</h3>
          <button onClick={addEducation} className="btn-add">
            <Plus size={16} /> Ajouter
          </button>
        </div>
        {cvData.education.map((edu, index) => (
          <DraggableItem
            key={edu.id}
            id={edu.id}
            index={index}
            onDelete={deleteEducation}
            onDragStart={handleEduDragStart}
            onDragOver={handleEduDragOver}
            onDragEnd={handleEduDragEnd}
            isDragging={draggedEduIndex === index}
          >
            <input
              type="text"
              placeholder="Diplôme"
              value={edu.degree}
              onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
            />
            <input
              type="text"
              placeholder="École/Université"
              value={edu.school}
              onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
            />
            <input
              type="text"
              placeholder="Localisation"
              value={edu.location}
              onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
            />
            <input
              type="text"
              placeholder="Année"
              value={edu.year}
              onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
            />
          </DraggableItem>
        ))}
      </section>

      <section className="editor-section">
        <div className="section-header">
          <h3>Compétences</h3>
          <button onClick={addSkill} className="btn-add">
            <Plus size={16} /> Ajouter
          </button>
        </div>
        {cvData.skills.map((skill, index) => (
          <div key={index} className="skill-item">
            <input
              type="text"
              placeholder="Compétence"
              value={skill}
              onChange={(e) => updateSkill(index, e.target.value)}
            />
            <button
              onClick={() => deleteSkill(index)}
              className="btn-delete-inline"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </section>

      <section className="editor-section">
        <div className="section-header">
          <h3>Langues</h3>
          <button onClick={addLanguage} className="btn-add">
            <Plus size={16} /> Ajouter
          </button>
        </div>
        {cvData.languages.map((lang, index) => (
          <div key={index} className="item-card">
            <button
              onClick={() => deleteLanguage(index)}
              className="btn-delete"
            >
              <Trash2 size={16} />
            </button>
            <input
              type="text"
              placeholder="Langue"
              value={lang.name}
              onChange={(e) => updateLanguage(index, 'name', e.target.value)}
            />
            <input
              type="text"
              placeholder="Niveau"
              value={lang.level}
              onChange={(e) => updateLanguage(index, 'level', e.target.value)}
            />
          </div>
        ))}
      </section>

      <section className="editor-section">
        <div className="section-header">
          <h3>Certifications</h3>
          <button onClick={addCertification} className="btn-add">
            <Plus size={16} /> Ajouter
          </button>
        </div>
        {cvData.certifications.map((cert, index) => (
          <DraggableItem
            key={cert.id}
            id={cert.id}
            index={index}
            onDelete={deleteCertification}
            onDragStart={handleCertDragStart}
            onDragOver={handleCertDragOver}
            onDragEnd={handleCertDragEnd}
            isDragging={draggedCertIndex === index}
          >
            <input
              type="text"
              placeholder="Nom de la certification"
              value={cert.name}
              onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
            />
            <input
              type="text"
              placeholder="Organisme"
              value={cert.issuer}
              onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
            />
            <input
              type="text"
              placeholder="Année"
              value={cert.year}
              onChange={(e) => updateCertification(cert.id, 'year', e.target.value)}
            />
            <input
              type="url"
              placeholder="Lien de vérification (optionnel)"
              value={cert.link}
              onChange={(e) => updateCertification(cert.id, 'link', e.target.value)}
            />
          </DraggableItem>
        ))}
      </section>

      <section className="editor-section">
        <div className="section-header">
          <h3>Sections Personnalisées</h3>
          <button onClick={addCustomSection} className="btn-add">
            <Plus size={16} /> Ajouter Section
          </button>
        </div>
        {cvData.customSections.map((section) => (
          <div key={section.id} className="custom-section-card">
            <div className="custom-section-header">
              <input
                type="text"
                placeholder="Titre de la section (ex: Projets, Publications, Prix)"
                value={section.title}
                onChange={(e) => updateCustomSection(section.id, 'title', e.target.value)}
                className="section-title-input"
              />
              <button
                onClick={() => deleteCustomSection(section.id)}
                className="btn-delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="section-items">
              {section.items.map((item, itemIndex) => (
                <DraggableItem
                  key={item.id}
                  id={item.id}
                  index={itemIndex}
                  onDelete={() => deleteCustomSectionItem(section.id, item.id)}
                  onDragStart={(e, idx) => handleCustomItemDragStart(section.id, idx)}
                  onDragOver={(e, idx) => handleCustomItemDragOver(section.id, idx)}
                  onDragEnd={handleCustomItemDragEnd}
                  isDragging={draggedCustomItemSection === section.id && draggedCustomItemIndex === itemIndex}
                >
                  <input
                    type="text"
                    placeholder="Titre"
                    value={item.title}
                    onChange={(e) => updateCustomSectionItem(section.id, item.id, 'title', e.target.value)}
                  />
                  <RichTextEditor
                    value={item.description}
                    onChange={(value) => updateCustomSectionItem(section.id, item.id, 'description', value)}
                    placeholder="Description"
                  />
                  <input
                    type="url"
                    placeholder="Lien (optionnel)"
                    value={item.link}
                    onChange={(e) => updateCustomSectionItem(section.id, item.id, 'link', e.target.value)}
                  />
                </DraggableItem>
              ))}
              <button
                onClick={() => addCustomSectionItem(section.id)}
                className="btn-add-item"
              >
                <Plus size={14} /> Ajouter un élément
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

export default CVEditor
