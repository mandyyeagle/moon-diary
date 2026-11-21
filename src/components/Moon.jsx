import React from 'react';

const Moon = () => {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto flex items-center justify-center">
      <img 
        src="/moon.png" 
        alt="Moon" 
        className="w-full h-full object-contain"
        style={{ 
          /* Делает черный фон прозрачным */
          mixBlendMode: 'screen',
          /* Мягко растворяет края картинки (от 60% к 75%) */
          maskImage: 'radial-gradient(circle, black 60%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(circle, black 60%, transparent 75%)'
        }}
      />
    </div>
  );
};

export default Moon;