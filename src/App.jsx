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
      
      {/* ФОН (двигается отдельно) */}
      <motion.div 
        className="absolute inset-0 z-0 bg-[url('/bg.jpg')] bg-cover bg-center"
        animate={{ x: `-${currentIndex * 100}vw` }}
        transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '300vw' }} 
      />

      {/* КОМЕТЫ */}
      <div className="meteor top-[10%] right-[-10%]" style={{ animationDelay: '0s' }}></div>
      <div className="meteor top-[40%] right-[-20%]" style={{ animationDelay: '8s' }}></div>

      {/* КАРУСЕЛЬ ЭКРАНОВ (без 3D, чтобы не было рывков) */}
      <div className="relative z-10 w-full h-full overflow-hidden">
        <motion.div
          className="flex h-full w-[300vw]"
          animate={{ x: `-${currentIndex * 100}vw` }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
        >
          {/* ЭКРАН 1: СЕГОДНЯ */}
          <div className="w-[100vw] h-full relative overflow-hidden">
             <TodayScreen />
          </div>

          {/* ЭКРАН 2: МУУН */}
          <div className="w-[100vw] h-full relative overflow-hidden">
            <MoonScreen />
          </div>

          {/* ЭКРАН 3: КАЛЕНДАРЬ */}
          <div className="w-[100vw] h-full relative overflow-hidden">
            <CalendarScreen />
          </div>
        </motion.div>
      </div>

      {/* НАВИГАЦИЯ (Всегда поверх) */}
      <div className="absolute top-0 left-0 w-full z-50 bg-gradient-to-b from-[#0a0f1c] via-[#0a0f1c]/80 to-transparent pb-4 pt-2">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

    </div>
  );
}