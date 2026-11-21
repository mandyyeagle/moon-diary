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
    // h-[100dvh] строго под высоту экрана телефона
    <div className="relative w-full max-w-[400px] h-[100dvh] mx-auto overflow-hidden bg-[#0a0f1c] text-white font-sans">
      
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

      {/* ГОРИЗОНТАЛЬНЫЙ ПРОКРУТ ЭКРАНОВ */}
      <motion.div
        className="relative w-full h-full z-5 flex"
        style={{ width: '300vw' }}
        animate={{ x: `-${currentIndex * 100}vw` }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
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

      {/* НАВИГАЦИЯ (fixed - прибита намертво) */}
      <div className="fixed top-0 left-0 right-0 w-full max-w-[400px] mx-auto z-50 bg-gradient-to-b from-[#0a0f1c] via-[#0a0f1c]/90 to-transparent pb-4 pt-2">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

    </div>
  );
}