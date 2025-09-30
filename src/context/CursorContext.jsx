import React, { createContext, useContext, useState, useEffect } from 'react';

// Import cursor images
import butterflyCursor from '../assets/butterfly-cursor.png';
import catCursor from '../assets/cat-cursor.png';
import coffeeCursor from '../assets/coffee-cursor.png';
import acornCursor from '../assets/acorn-cursor.png';

const CursorContext = createContext();

export const useCursor = () => {
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  return context;
};

export const CursorProvider = ({ children }) => {
  const cursors = [
    { name: 'butterfly', image: butterflyCursor },
    { name: 'cat', image: catCursor },
    { name: 'coffee', image: coffeeCursor },
    { name: 'acorn', image: acornCursor },
  ];

  const [currentCursorIndex, setCurrentCursorIndex] = useState(0); // Default to butterfly

  const nextCursor = () => {
    setCurrentCursorIndex((prevIndex) => (prevIndex + 1) % cursors.length);
  };

  const currentCursor = cursors[currentCursorIndex];

  // Apply cursor style to the document body
  useEffect(() => {
    document.body.style.cursor = `url(${currentCursor.image}), auto`;
    
    // Also apply to all interactive elements
    const style = document.createElement('style');
    style.textContent = `
      * {
        cursor: url(${currentCursor.image}), auto !important;
      }
      button, a, input, select, textarea, [role="button"] {
        cursor: url(${currentCursor.image}), pointer !important;
      }
    `;
    document.head.appendChild(style);

    // Cleanup function to remove the style when component unmounts or cursor changes
    return () => {
      document.head.removeChild(style);
    };
  }, [currentCursor]);

  return (
    <CursorContext.Provider value={{ currentCursor, nextCursor, cursors }}>
      {children}
    </CursorContext.Provider>
  );
};