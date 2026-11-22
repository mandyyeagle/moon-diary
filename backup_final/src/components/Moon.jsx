import React from 'react';

const Moon = () => {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto flex items-center justify-center">
      

      {/* 2. Картинка Луны */}
      <img 
        src="/moon.png" 
        alt="Moon" 
        className="w-full h-full object-cover rounded-full"
        style={{ 
          mixBlendMode: 'screen' 
        }}
      />

    </div>
  );
};

export default Moon;