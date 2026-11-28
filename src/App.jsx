
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import TodayScreen from './components/TodayScreen';
import MoonScreen from './components/MoonScreen';
import CalendarScreen from './components/CalendarScreen';
import Navigation from './components/BottomNav';
import Moon from './components/Moon';
import { MoonPhase } from 'astronomy-engine';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('today');
  const [pendingPrompt, setPendingPrompt] = useState(null);

  const touchStart = useRef(null);

  const tabs = ['today', 'lunnik', 'calendar'];
  const currentIndex = tabs.indexOf(activeTab);

  const today = new Date();
  const phaseAngle = MoonPhase(today);
  const phase = (1 - Math.cos(phaseAngle * Math.PI / 180)) / 2;

  // Выбор темы открывает чат поверх экрана «муун».
  const handleTopicSelect = (topic) => {
    if (topic && typeof topic === 'object' && topic.agentPrompt) {
      setPendingPrompt(topic.agentPrompt);
      return;
    }

    const topicTitle =
      typeof topic === 'string' ? topic : topic.title;

    setPendingPrompt(
      'Расскажи мне подробнее о теме «' +
      topicTitle +
      '». Дай персональную рекомендацию на сегодня с учётом лунной энергии.'
    );
  };

  const handlePromptHandled = () => {
    setPendingPrompt(null);
  };

  const handleCloseChat = () => {
    setPendingPrompt(null);
  };

  // Начало свайпа.
  const handleTouchStart = (event) => {
    if (event.touches.length === 1) {
      touchStart.current = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
    }
  };

  // Переключение экранов свайпом.
  const handleTouchEnd = (event) => {
    if (!touchStart.current || event.changedTouches.length !== 1) {
      return;
    }

    const dx = event.changedTouches[0].clientX - touchStart.current.x;
    const dy = event.changedTouches[0].clientY - touchStart.current.y;

    touchStart.current = null;

    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.25) {
      return;
    }

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
      {/* Удлинённый космический фон */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.img
          src="/bg.jpg"
          alt=""
          draggable="false"
          className="absolute top-0 left-0 h-full w-auto max-w-none"
          animate={{
            x: ['0%', '-30%'],
          }}
          transition={{
            duration: 180,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear',
          }}
          style={{
            height: '100%',
            width: 'auto',
            maxWidth: 'none',
            objectFit: 'cover',
            willChange: 'transform',
          }}
        />
      </div>

      {/* Кометы */}
      <div
        className="meteor top-[10%] right-[-10%]"
        style={{ animationDelay: '0s' }}
      />

      <div
        className="meteor top-[40%] right-[-20%]"
        style={{ animationDelay: '8s' }}
      />

      {/* Основные экраны */}
      <div className="absolute inset-0 z-[5] overflow-hidden">
        <motion.div
          className="flex h-full"
          style={{ width: '300vw' }}
          animate={{ x: `-${currentIndex * 100}vw` }}
          transition={{
            duration: 0.8,
            ease: 'easeInOut',
          }}
        >
          <div className="w-screen h-full shrink-0 relative">
            <TodayScreen />
          </div>

          <div className="w-screen h-full shrink-0 relative">
            <MoonScreen onSelectTopic={handleTopicSelect} />
          </div>

          <div className="w-screen h-full shrink-0 relative">
            <CalendarScreen />
          </div>
        </motion.div>
      </div>

      {/* Большая декоративная Луна — только на экране календаря */}
      {activeTab === 'calendar' && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.5,
            ease: 'easeOut',
          }}
          className="absolute top-1/2 left-1/2 z-[2] pointer-events-none"
        >
          <div
            style={{
              transform: 'translate(-50%, calc(-50% - 50px))',
            }}
          >
            <Moon phase={phase} />
          </div>
        </motion.div>
      )}

      {/* Отдельный чат поверх экрана «муун» */}
      <TodayScreen
        overlayMode
        initialPrompt={pendingPrompt}
        onPromptHandled={handlePromptHandled}
        onCloseChat={handleCloseChat}
      />

      {/* Навигация */}
      <div className="absolute top-0 left-0 w-full z-[60]">
        <Navigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      <Analytics />
    </div>
  );
}
