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

  // Обработка свайпа
  const handleDragEnd = (event, info) => {
    const swipe = info.offset.x;
    if (swipe < -50 && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    } else if (swipe > 50 && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#0a0f1c] text-white font-sans">
      
      {/* ФОН */}
      <motion.div 
        className="absolute inset-0 z-0 bg-[url('/bg.jpg')] bg-cover bg-center"
        animate={{ x: `-${currentIndex * 100}vw` }}
        transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '300vw' }} 
      />

      {/* КОМЕТЫ */}
      <div className="meteor top-[10%] right-[-10%]" style={{ animationDelay: '0s' }}></div>
      <div className="meteor top-[40%] right-[-20%]" style={{ animationDelay: '8s' }}></div>

      {/* СВАЙП-КАРУСЕЛЬ */}
      <motion.div
        className="relative w-full h-full z-5 flex cursor-grab active:cursor-grabbing"
        style={{ width: '300vw' }}
        animate={{ x: `-${currentIndex * 100}vw` }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
      >
        <div className="w-[33.333%] h-full relative">
           <TodayScreen />
        </div>
        <div className="w-[33.333%] h-full relative">
          <MoonScreen />
        </div>
        <div className="w-[33.333%] h-full relative">
          <CalendarScreen />
        </div>
      </motion.div>

      {/* ПАРЯЩАЯ ЛУНА (вызов твоего рабочего компонента) */}
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

      {/* НАВИГАЦИЯ */}
      <div className="absolute top-0 left-0 w-full z-50 bg-gradient-to-b from-[#0a0f1c] via-[#0a0f1c]/80 to-transparent pb-4 pt-2">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

    </div>
  );
}