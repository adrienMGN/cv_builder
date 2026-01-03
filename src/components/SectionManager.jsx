import React from 'react';
import { GripVertical, Eye, EyeOff } from 'lucide-react';
import './SectionManager.css';

const SectionManager = ({ sections, onReorder, onToggleVisibility }) => {
  const [draggedIndex, setDraggedIndex] = React.useState(null);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newSections = [...sections];
    const draggedSection = newSections[draggedIndex];
    
    newSections.splice(draggedIndex, 1);
    newSections.splice(index, 0, draggedSection);
    
    setDraggedIndex(index);
    onReorder(newSections);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="section-manager">
      <h3>Ordre des sections</h3>
      <div className="section-list">
        {sections.map((section, index) => (
          <div
            key={section.key}
            className={`section-item ${draggedIndex === index ? 'dragging' : ''}`}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
          >
            <div
              className="drag-handle-container"
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
            >
              <GripVertical size={18} className="drag-handle" />
            </div>
            <span className="section-name">{section.label}</span>
            <button
              type="button"
              onClick={() => onToggleVisibility(section.key)}
              className="visibility-btn"
              title={section.visible ? 'Masquer' : 'Afficher'}
            >
              {section.visible ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionManager;
