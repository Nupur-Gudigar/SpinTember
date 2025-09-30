import React from 'react';
import { useCursor } from '../context/CursorContext';
import './CursorToggle.css';

const CursorToggle = () => {
  const { currentCursor, nextCursor } = useCursor();

  return (
    <div className="cursor-toggle" onClick={nextCursor}>
      <img 
        src={currentCursor.image} 
        alt={`${currentCursor.name} cursor`}
        className="cursor-preview"
      />
      <div className="cursor-tooltip">
        Change Cursor
      </div>
    </div>
  );
};

export default CursorToggle;