import React from 'react';

const Moon = ({ phase = 0.5 }) => {
  const getMoonImage = (p) => {
    if (p < 0.05 || p > 0.95) return '/moon_phases/new.png';
    if (p < 0.20) return '/moon_phases/waxing_crescent.png';
    if (p < 0.30) return '/moon_phases/first_quarter.png';
    if (p < 0.45) return '/moon_phases/waxing_gibbous.png';
    if (p < 0.55) return '/moon_phases/full.png';
    if (p < 0.70) return '/moon_phases/waning_gibbous.png';
    if (p < 0.80) return '/moon_phases/last_quarter.png';
    return '/moon_phases/waning_crescent.png';
  };

  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto flex items-center justify-center">
      <img 
        src={getMoonImage(phase)} 
        alt="Moon Phase" 
        className="w-full h-full object-contain transition-opacity duration-1000 ease-in-out"
        style={{ 
          /* Делает черный фон картинки прозрачным */
          mixBlendMode: 'screen',
          /* Свечение повторяет контур Луны, а не квадрат */
          filter: 'drop-shadow(0 0 30px rgba(59,130,246,0.6))' 
        }}
      />
    </div>
  );
};

export default Moon;