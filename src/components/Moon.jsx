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
    // motion.div создает эффект парения и легкого 3D-покачивания
    <motion.div 
      className="relative w-64 h-64 md:w-80 md:h-80 mx-auto flex items-center justify-center"
      animate={{ 
        y: [0, -10, 0], // Плавает вверх-вниз на 10 пикселей
        rotateY: [0, 15, -15, 0], // Легкое 3D-покачивание
        rotateX: [0, -5, 5, 0]
      }}
      transition={{ 
        duration: 8, // Один цикл длится 8 секунд
        repeat: Infinity, // Бесконечно
        ease: "easeInOut"
      }}
      style={{ perspective: 1000 }}
    >
      
      {/* Свечение */}
      <div className="absolute inset-0 rounded-full shadow-[0_0_60px_20px_rgba(59,130,246,0.4)] pointer-events-none"></div>

      {/* Картинка Луны с эффектом 3D-шара */}
      <div className="relative w-full h-full rounded-full overflow-hidden z-10 bg-transparent flex items-center justify-center">
        <img 
          src={getMoonImage(phase)} 
          alt="Moon Phase" 
          className="w-full h-full object-contain transition-opacity duration-1000 ease-in-out"
          style={{ 
            mixBlendMode: 'screen',
            
        />
        {/* Дополнительный слой тени для объема */}
        <div className="absolute inset-0 rounded-full shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.6)] pointer-events-none"></div>
      </div>

    </motion.div>
  );
};

export default Moon;