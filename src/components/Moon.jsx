import React from 'react';
import { motion } from 'framer-motion';

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
      
      {/* Голубое свечение */}
      <div className="absolute inset-0 rounded-full shadow-[0_0_60px_20px_rgba(59,130,246,0.4)] pointer-events-none"></div>

      {/* Анимированная обертка (покачивание) */}
      <motion.div
        className="w-full h-full relative z-10"
        animate={{ 
          y: [0, -8, 0], // Плавает вверх-вниз
          rotate: [0, 2, -2, 0] // Легкое покачивание
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut"
        }}
      >
        <img 
          src={getMoonImage(phase)} 
          alt="Moon Phase" 
          className="w-full h-full object-contain"
          style={{ 
            /* Убирает черный фон картинки */
            mixBlendMode: 'screen' 
          }}
        />
      </motion.div>

    </div>
  );
};

export default Moon;