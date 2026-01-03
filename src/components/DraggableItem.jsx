import React from 'react';
import { GripVertical, Trash2 } from 'lucide-react';
import './DraggableItem.css';

const DraggableItem = ({ 
  id, 
  index, 
  children, 
  onDelete, 
  onDragStart, 
  onDragOver, 
  onDragEnd,
  isDragging 
}) => {
  const handleDragStart = (e) => {
    onDragStart(e, index);
  };

  return (
    <div
      className={`draggable-item ${isDragging ? 'dragging' : ''}`}
      onDragOver={(e) => onDragOver(e, index)}
      onDragEnd={onDragEnd}
    >
      <div 
        className="drag-handle-wrapper"
        draggable
        onDragStart={handleDragStart}
      >
        <GripVertical size={20} className="drag-handle" />
      </div>
      <div className="draggable-content">
        {children}
      </div>
      {onDelete && (
        <button
          onClick={() => onDelete(id)}
          className="btn-delete-draggable"
          title="Supprimer"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
};

export default DraggableItem;
