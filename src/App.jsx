import { useState } from 'react';
import { motion } from 'framer-motion';
import TodayScreen from './components/TodayScreen';
import MoonScreen from './components/MoonScreen';
import CalendarScreen from './components/CalendarScreen';
import Navigation from './components/BottomNav';

export default function App() {
  const [activeTab, setActiveTab] = useState('today');
  const tabs = ['today', 'lunnik', 'calendar'];
  const currentIndex = tabs.indexOf(activeTab);

  return (
    <div 
      className="relative w-full max-w-[400px] h-[100dvh] mx-auto overflow-hidden bg-[#0a0f1c] text-white font-sans" 
      style={{ perspective: '1200px' }}
    >
      {/* ФОН */}
      <motion.div 
        className="absolute inset-0 z-0 bg-[url('/bg.jpg')] bg-cover bg-center"
        animate={{ x: `-${currentIndex * 100}vw` }}
        transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '300vw' }} 
      />

      {/* КОМЕТЫ */}
      <div className="meteor top-[10%] right-[-10%]" style={{ animationDelay: '0s' }}></div>
      <div className="meteor top-[40%] right-[-20%]" style={{ animationDelay: '2s' }}></div>

      {/* 3D КАРУСЕЛЬ ЭКРАНОВ */}
      <motion.div
        className="relative w-full h-full z-10"
        style={{ transformStyle: 'preserve-3d' }} 
        animate={{ rotateY: currentIndex * -120 }} 
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        {/* ЭКРАН 0: СЕГОДНЯ */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ transform: 'rotateY(0deg) translateZ(50px)', backfaceVisibility: 'hidden' }}
        >
           <TodayScreen />
        </div>

        {/* ЭКРАН 1: МУУН (Подключили твой новый файл) */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ transform: 'rotateY(120deg) translateZ(50px)', backfaceVisibility: 'hidden' }}
        >
          <MoonScreen />
        </div>

        {/* ЭКРАН 2: КАЛЕНДАРЬ (Подключили твой новый файл) */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ transform: 'rotateY(240deg) translateZ(50px)', backfaceVisibility: 'hidden' }}
        >
          <CalendarScreen />
        </div>
      </motion.div>

      {/* НАВИГАЦИЯ */}
      <div className="absolute top-0 left-0 w-full z-50 bg-gradient-to-b from-[#0a0f1c] via-[#0a0f1c]/80 to-transparent pb-4 pt-2">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}