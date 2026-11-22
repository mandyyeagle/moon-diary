import React from 'react';

const Moon = () => {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto flex items-center justify-center">
      
      

      {/* 2. Картинка Луны */}
      <img 
        src="/moon.png" 
        alt="Moon" 
        className=""
        style={{ 
          mixBlendMode: ' ' 
        }}
      />

    </div>
  );
};

export default Moon;