import { useState } from 'react';
import { motion } from 'framer-motion';
import TodayScreen from './components/TodayScreen';
import MoonScreen from './components/MoonScreen';
import CalendarScreen from './components/CalendarScreen';
import Navigation from './components/BottomNav';
import Moon from './components/Moon';
import { MoonPhase } from 'astronomy-engine';

export default function App() {
  const [activeTab, setActiveTab] = useState('today');
  const tabs = ['today', 'lunnik', 'calendar'];
  const currentIndex = tabs.indexOf(activeTab);

  const today = new Date();
  const phaseAngle = MoonPhase(today);
  const phase = (1 - Math.cos(phaseAngle * Math.PI / 180)) / 2;

  return (
    <div 
      className="relative w-full h-[100dvh] overflow-hidden bg-[#0a0f1c] text-white font-sans" 
    >
      {/* ФОН (двигается отдельно и плавно) */}
      <motion.div 
        className="absolute inset-0 z-0 bg-[url('/bg.jpg')] bg-cover bg-center"
        animate={{ x: `-${currentIndex * 100}vw` }}
        transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '300vw' }} 
      />

      {/* КОМЕТЫ (добавлены с задержкой) */}
      <div className="meteor top-[10%] right-[-10%]" style={{ animationDelay: '0s' }}></div>
      <div className="meteor top-[40%] right-[-20%]" style={{ animationDelay: '8s' }}></div>

      {/* ГОРИЗОНТАЛЬНЫЙ ПРОКРУТ ЭКРАНОВ */}
      <motion.div
        className="relative w-full h-full z-5 flex"
        style={{ width: '300vw' }}
        animate={{ x: `-${currentIndex * 100}vw` }}
        transition={{ duration: 1.5, ease: "easeInOut" }} // Чуть замедлил для плавности
      >
        {/* ЭКРАН 0: СЕГОДНЯ */}
        <div className="w-[33.333%] h-full">
           <TodayScreen />
        </div>

        {/* ЭКРАН 1: МУУН */}
        <div className="w-[33.333%] h-full">
          <MoonScreen />
        </div>

        {/* ЭКРАН 2: КАЛЕНДАРЬ */}
        <div className="w-[33.333%] h-full">
          <CalendarScreen />
        </div>
      </motion.div>

      {activeTab !== 'today' && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed top-1/2 left-1/2 z-50 pointer-events-none"
        >
          <div style={{ transform: 'translate(-50%, calc(-50% - 50px))' }}>
            <Moon phase={phase} />
          </div>
        </motion.div>
      )}

      {/* НАВИГАЦИЯ (Всегда поверх, не крутится) */}
      <div className="absolute top-0 left-0 w-full z-50 bg-gradient-to-b from-[#0a0f1c] via-[#0a0f1c]/80 to-transparent pb-4 pt-2">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

    </div>
  );
}