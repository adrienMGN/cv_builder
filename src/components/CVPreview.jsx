import { forwardRef } from 'react'
import './CVPreview.css'
import { Mail, Phone, MapPin, Linkedin, Globe, Briefcase, GraduationCap, Code, Languages, Award, ExternalLink, Github } from 'lucide-react'

const CVPreview = forwardRef(({ cvData, theme }, ref) => {
  const renderLink = (url, children) => {
    if (!url) return children
    const fullUrl = url.startsWith('http') ? url : `https://${url}`
    return (
      <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="clickable-link">
        {children}
      </a>
    )
  }

  const renderFormattedText = (text) => {
    if (!text) return null;
    return <div dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br/>') }} />;
  };

  const renderSection = (sectionKey) => {
    switch (sectionKey) {
      case 'summary':
        return cvData.settings.showSummary && cvData.summary && (
          <div className="cv-section" key="summary">
            <div className="section-title">
              <Briefcase size={20} />
              <h3>Résumé Professionnel</h3>
            </div>
            <div className="summary-text">{renderFormattedText(cvData.summary)}</div>
          </div>
        );

      case 'experience':
        return cvData.settings.showExperience && cvData.experience.length > 0 && (
          <div className="cv-section" key="experience">
            <div className="section-title">
              <Briefcase size={20} />
              <h3>Expérience Professionnelle</h3>
            </div>
            {cvData.experience.map((exp) => (
              <div key={exp.id} className="experience-item">
                <div className="exp-header">
                  <div>
                    <h4>{exp.title}</h4>
                    <p className="company">{exp.company}</p>
                  </div>
                  <div className="exp-meta">
                    <p className="date">{exp.startDate} - {exp.endDate}</p>
                    <p className="location">{exp.location}</p>
                  </div>
                </div>
                <div className="exp-description">
                  {renderFormattedText(exp.description)}
                </div>
              </div>
            ))}
          </div>
        );

      case 'education':
        return cvData.settings.showEducation && cvData.education.length > 0 && (
          <div className="cv-section" key="education">
            <div className="section-title">
              <GraduationCap size={20} />
              <h3>Formation</h3>
            </div>
            {cvData.education.map((edu) => (
              <div key={edu.id} className="education-item">
                <div className="edu-header">
                  <div>
                    <h4>{edu.degree}</h4>
                    <p className="school">{edu.school}</p>
                  </div>
                  <div className="edu-meta">
                    <p className="date">{edu.year}</p>
                    <p className="location">{edu.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'skills':
        return cvData.settings.showSkills && cvData.skills.length > 0 && (
          <div className="cv-section skills-section" key="skills">
            <div className="section-title">
              <Code size={20} />
              <h3>Compétences</h3>
            </div>
            <div className="skills-grid">
              {cvData.skills.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        );

      case 'languages':
        return cvData.settings.showLanguages && cvData.languages.length > 0 && (
          <div className="cv-section languages-section" key="languages">
            <div className="section-title">
              <Languages size={20} />
              <h3>Langues</h3>
            </div>
            <div className="languages-list">
              {cvData.languages.map((lang, index) => (
                <div key={index} className="language-item">
                  <span className="lang-name">{lang.name}</span>
                  <span className="lang-level">{lang.level}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'certifications':
        return cvData.settings.showCertifications && cvData.certifications && cvData.certifications.length > 0 && (
          <div className="cv-section" key="certifications">
            <div className="section-title">
              <Award size={20} />
              <h3>Certifications</h3>
            </div>
            {cvData.certifications.map((cert) => (
              <div key={cert.id} className="certification-item">
                <div className="cert-header">
                  <div>
                    <h4>{cert.name}</h4>
                    <p className="cert-issuer">{cert.issuer}</p>
                  </div>
                  <div className="cert-meta">
                    <p className="date">{cert.year}</p>
                    {cert.link && renderLink(cert.link,
                      <span className="verify-link">
                        <ExternalLink size={14} /> Vérifier
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'customSections':
        return cvData.settings.showCustomSections && cvData.customSections && cvData.customSections.map((section) => (
          <div key={section.id} className="cv-section">
            <div className="section-title">
              <Briefcase size={20} />
              <h3>{section.title}</h3>
            </div>
            {section.items.map((item) => (
              <div key={item.id} className="custom-item">
                <div className="custom-header">
                  <h4>
                    {item.title}
                    {item.link && renderLink(item.link,
                      <ExternalLink size={16} className="item-link-icon" />
                    )}
                  </h4>
                </div>
                {item.description && (
                  <div className="custom-description">{renderFormattedText(item.description)}</div>
                )}
              </div>
            ))}
          </div>
        ));

      default:
        return null;
    }
  };

  const sectionOrder = cvData.sectionOrder || [
    'summary', 'experience', 'education', 'skills', 'languages', 'certifications', 'customSections'
  ];

  return (
    <div ref={ref} className={`cv-preview theme-${theme}`}>
      {/* Header */}
      <div className="cv-header">
        {cvData.settings.showPhoto && cvData.personalInfo.photo && (
          <div className="cv-photo">
            <img src={cvData.personalInfo.photo} alt={cvData.personalInfo.name} />
          </div>
        )}
        <div className="cv-header-content">
          <h1 className="cv-name">{cvData.personalInfo.name}</h1>
          <h2 className="cv-title">{cvData.personalInfo.title}</h2>
          <div className="cv-contact">
            <div className="contact-item">
              <Mail size={16} />
              {renderLink(`mailto:${cvData.personalInfo.email}`, <span>{cvData.personalInfo.email}</span>)}
            </div>
            <div className="contact-item">
              <Phone size={16} />
              {renderLink(`tel:${cvData.personalInfo.phone}`, <span>{cvData.personalInfo.phone}</span>)}
            </div>
            <div className="contact-item">
              <MapPin size={16} />
              <span>{cvData.personalInfo.location}</span>
            </div>
            {cvData.personalInfo.linkedin && (
              <div className="contact-item">
                <Linkedin size={16} />
                {renderLink(cvData.personalInfo.linkedin, <span>{cvData.personalInfo.linkedin}</span>)}
              </div>
            )}
            {cvData.personalInfo.github && (
              <div className="contact-item">
                <Github size={16} />
                {renderLink(cvData.personalInfo.github, <span>{cvData.personalInfo.github}</span>)}
              </div>
            )}
            {cvData.personalInfo.website && (
              <div className="contact-item">
                <Globe size={16} />
                {renderLink(cvData.personalInfo.website, <span>{cvData.personalInfo.website}</span>)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Sections based on sectionOrder */}
      {sectionOrder.map(key => renderSection(key))}
    </div>
  )
})

CVPreview.displayName = 'CVPreview'

export default CVPreview
