import React, { useState, useRef } from 'react';
import { Bold, Italic, Underline, Palette, Type } from 'lucide-react';
import './RichTextEditor.css';

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const textareaRef = useRef(null);

  const colors = [
    '#000000', '#333333', '#666666', '#999999',
    '#1a73e8', '#0f9d58', '#f4b400', '#db4437',
    '#9c27b0', '#ff6d00', '#00bcd4', '#4caf50'
  ];

  const applyFormat = (format, value = null) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    if (!selectedText) {
      alert('Veuillez sélectionner du texte à formater');
      return;
    }

    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `<b>${selectedText}</b>`;
        break;
      case 'italic':
        formattedText = `<i>${selectedText}</i>`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        break;
      case 'color':
        formattedText = `<span style="color:${value}">${selectedText}</span>`;
        break;
      default:
        return;
    }

    const newValue = 
      textarea.value.substring(0, start) +
      formattedText +
      textarea.value.substring(end);
    
    onChange(newValue);
    
    // Repositionner le curseur
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
    }, 0);
  };

  return (
    <div className="rich-text-editor">
      <div className="rich-text-toolbar">
        <button
          type="button"
          onClick={() => applyFormat('bold')}
          title="Gras"
          className="toolbar-btn"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('italic')}
          title="Italique"
          className="toolbar-btn"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('underline')}
          title="Souligné"
          className="toolbar-btn"
        >
          <Underline size={16} />
        </button>
        <div className="toolbar-divider"></div>
        <button
          type="button"
          onClick={() => setShowColorPicker(!showColorPicker)}
          title="Couleur"
          className="toolbar-btn"
        >
          <Palette size={16} />
        </button>
        {showColorPicker && (
          <div className="color-picker">
            {colors.map(color => (
              <button
                key={color}
                type="button"
                className="color-option"
                style={{ backgroundColor: color }}
                onClick={() => {
                  applyFormat('color', color);
                  setShowColorPicker(false);
                }}
              />
            ))}
          </div>
        )}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rich-textarea"
      />
      <div className="format-hint">
        Sélectionnez du texte et utilisez les boutons pour le formater
      </div>
    </div>
  );
};

export default RichTextEditor;
