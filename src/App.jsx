import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import TodayScreen from './components/TodayScreen';
import MoonScreen from './components/MoonScreen';
import CalendarScreen from './components/CalendarScreen';
import Navigation from './components/BottomNav';
import Moon from './components/Moon';
import { MoonPhase } from 'astronomy-engine';

export default function App() {
  const [activeTab, setActiveTab] = useState('today');
  const touchStart = useRef(null);
  const tabs = ['today', 'lunnik', 'calendar'];
  const currentIndex = tabs.indexOf(activeTab);

  const today = new Date();
  const phaseAngle = MoonPhase(today);
  const phase = (1 - Math.cos(phaseAngle * Math.PI / 180)) / 2;

  // Свайп меняет только активную вкладку. Сам экранный трек не перетаскивается,
  // поэтому его положение всегда синхронно с activeTab.
  const handleTouchStart = (event) => {
    if (event.touches.length === 1) {
      touchStart.current = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
    }
  };

  const handleTouchEnd = (event) => {
    if (!touchStart.current || event.changedTouches.length !== 1) return;
    const dx = event.changedTouches[0].clientX - touchStart.current.x;
    const dy = event.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;

    // Вертикальная прокрутка контента не должна переключать вкладки.
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.25) return;
    if (dx < 0 && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    } else if (dx > 0 && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  return (
    <div
      className="relative w-full h-[100dvh] overflow-hidden bg-[#0a0f1c] text-white font-sans"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Фон движется независимо от содержимого экранов. */}
      <motion.div
        className="absolute inset-y-0 left-0 z-0 bg-[url('/bg.jpg')] bg-cover bg-center pointer-events-none"
        animate={{ x: `-${currentIndex * 100}vw`, scale: [1, 1.5] }}
        transition={{
          x: { duration: 2.5, ease: [0.16, 1, 0.3, 1] },
          scale: { duration: 180, repeat: Infinity, ease: 'linear', repeatType: 'loop' },
        }}
        style={{ width: '300vw' }}
      />

      {/* Кометы */}
      <div className="meteor top-[10%] right-[-10%]" style={{ animationDelay: '0s' }} />
      <div className="meteor top-[40%] right-[-20%]" style={{ animationDelay: '8s' }} />

      {/* Трек всегда имеет фиксированную ширину 3 экранов и управляется activeTab. */}
      <div className="absolute inset-0 z-[5] overflow-hidden">
        <motion.div
          className="flex h-full"
          style={{ width: '300vw' }}
          animate={{ x: `-${currentIndex * 100}vw` }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <div className="w-screen h-full shrink-0 relative"><TodayScreen /></div>
          <div className="w-screen h-full shrink-0 relative"><MoonScreen /></div>
          <div className="w-screen h-full shrink-0 relative"><CalendarScreen /></div>
        </motion.div>
      </div>

      {/* Парящая Луна на дополнительных экранах. */}
      {activeTab !== 'today' && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed top-1/2 left-1/2 z-40 pointer-events-none"
        >
          <div style={{ transform: 'translate(-50%, calc(-50% - 50px))' }}>
            <Moon phase={phase} />
          </div>
        </motion.div>
      )}

      {/* Навигация всегда поверх экранного трека. */}
      <div className="absolute top-0 left-0 w-full z-[60]">
  <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
