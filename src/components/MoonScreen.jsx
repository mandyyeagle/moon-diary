
import React, { useState, useRef } from 'react';

const dailyCharacters = [
  {
    image: 'moon_book.png',
    title: 'время для новых знаний',
    text: 'узнай что-то новое сегодня. даже небольшое открытие может изменить твой взгляд на привычные вещи.',
  },
  {
    image: 'moon_inspiration.png',
    title: 'вдохновение рядом',
    text: 'прислушайся к своим идеям. запиши одну мысль, которую давно хотелось воплотить.',
  },
  {
    image: 'moon_money.png',
    title: 'день финансовой осознанности',
    text: 'посмотри на свои расходы. возможно, сегодня найдётся способ немного сэкономить.',
  },
  {
    image: 'moon_sport.png',
    title: 'время подвигаться',
    text: 'добавь немного движения в свой день. прогулка, растяжка или короткая тренировка — выбирай сама.',
  },
  {
    image: 'moon_declutter.png',
    title: 'начни с малого',
    text: 'выбери одну полку или ящик и убери из него то, чем давно не пользуешься.',
  },
];

const topics = [
  { icon: '✈️', title: 'путешествия' },
  { icon: '🎨', title: 'дизайн' },
  { icon: '🍽️', title: 'готовка' },
  { icon: '🌿', title: 'растения' },
  { icon: '🧘', title: 'самопознание' },
  { icon: '🎀', title: 'красота' },
  { icon: '💪', title: 'спорт' },
  { icon: '📚', title: 'обучение' },
  { icon: '💰', title: 'финансы' },
  { icon: '🏡', title: 'дом' },
  { icon: '❤️', title: 'отношения' },
  { icon: '🩺', title: 'здоровье' },
  { icon: '💼', title: 'карьера' },
  { icon: '🎉', title: 'события' },
  { icon: '✨', title: 'личное развитие' },
];

export default function MoonScreen({ onSelectTopic }) {
  const [activeTopic, setActiveTopic] = useState(null);

  // Управление прокруткой тем мышкой
  const topicsRef = useRef(null);

  const dragData = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
    moved: false,
  });

  const handleMouseDown = (event) => {
    if (event.button !== 0 || !topicsRef.current) return;

    dragData.current = {
      isDown: true,
      startX: event.clientX,
      scrollLeft: topicsRef.current.scrollLeft,
      moved: false,
    };
  };

  const handleMouseMove = (event) => {
    if (!dragData.current.isDown || !topicsRef.current) return;

    const distance = event.clientX - dragData.current.startX;

    if (Math.abs(distance) > 5) {
      dragData.current.moved = true;
    }

    topicsRef.current.scrollLeft =
      dragData.current.scrollLeft - distance;
  };

  const handleMouseUp = () => {
    dragData.current.isDown = false;
  };

  // Ежедневная смена образа МУУН
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);

  const dayNumber = Math.floor(
    (new Date(now.getFullYear(), now.getMonth(), now.getDate()) -
      startOfYear) / 86400000
  );

  const activeIndex = dayNumber % dailyCharacters.length;
  const activeCharacter = dailyCharacters[activeIndex];

  // Выбор темы и передача её агенту
  const handleTopicClick = (topic) => {
    setActiveTopic(
      activeTopic === topic.title ? null : topic.title
    );

    if (onSelectTopic) {
      onSelectTopic(topic);
    }
  };

  return (
    <div className="relative flex flex-col w-full h-full text-white overflow-hidden">

      {/* Основная область экрана */}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden px-3"
        style={{
          paddingTop: '105px',
          paddingBottom: '160px',
          scrollbarWidth: 'none',
        }}
      >

        {/* Карточка дня */}
        <div className="relative flex items-center w-full min-h-[112px] rounded-full overflow-visible">

          {/* Стеклянный фон карточки */}
          <div
            className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
            style={{
              background:
                'linear-gradient(110deg, rgba(10,25,48,0.82), rgba(31,68,105,0.48))',
              border: '1px solid rgba(190,220,255,0.35)',
              boxShadow: '0 0 25px rgba(48,110,190,0.12)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
            }}
          />

          {/* Персонаж МУУН */}
          <div className="relative w-[34%] h-[112px] shrink-0 flex items-end justify-center z-20">
            <img
              src={`/moon/characters/${activeCharacter.image}`}
              alt="муун"
              className="absolute bottom-0 max-w-none object-contain object-bottom"
              style={{
                height: '135px',
                width: 'auto',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            />
          </div>

          {/* Текст карточки */}
          <div className="relative z-10 flex-1 py-4 pr-4 pl-1">
            <div
              className="text-[15px] font-medium mb-2"
              style={{ fontFamily: 'Gilroy, sans-serif' }}
            >
              {activeCharacter.title}
            </div>

            <div
              className="text-[13px] leading-[1.25] font-light text-white/90"
              style={{ fontFamily: 'Gilroy, sans-serif' }}
            >
              {activeCharacter.text}
            </div>
          </div>
        </div>

        {/* Индикаторы образов */}
        <div className="flex items-center justify-center gap-5 mt-4">
          {dailyCharacters.map((character, index) => (
            <div
              key={character.image}
              className="rounded-full transition-all duration-500"
              style={{
                width: activeIndex === index ? '12px' : '7px',
                height: '7px',
                background:
                  activeIndex === index
                    ? '#557cff'
                    : 'rgba(190,210,255,0.35)',
                boxShadow:
                  activeIndex === index
                    ? '0 0 10px rgba(85,124,255,0.9)'
                    : 'none',
              }}
            />
          ))}
        </div>

        {/* Здесь позже добавим центральный контент МУУН */}

      </div>

      {/* Закреплённые тематические направления */}
      <div
        className="absolute left-0 w-full px-2 z-30"
        style={{
          bottom: 'calc(76px + max(14px, env(safe-area-inset-bottom)))',
        }}
      >
        <div
          ref={topicsRef}
          className="flex gap-2 overflow-x-auto overflow-y-hidden select-none"
          style={{
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-x',
            scrollSnapType: 'x proximity',
            cursor: 'grab',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onDragStart={(event) => event.preventDefault()}
          onTouchStart={(event) => event.stopPropagation()}
          onTouchMove={(event) => event.stopPropagation()}
          onTouchEnd={(event) => event.stopPropagation()}
          onClickCapture={(event) => {
            if (dragData.current.moved) {
              event.preventDefault();
              event.stopPropagation();
              dragData.current.moved = false;
            }
          }}
        >
          {topics.map((topic) => (
            <button
              key={topic.title}
              onClick={() => handleTopicClick(topic)}
              className="flex items-center gap-2 shrink-0 snap-start rounded-full px-4 py-3 normal-case transition-all duration-300"
              style={{
                background:
                  activeTopic === topic.title
                    ? 'rgba(85,124,255,0.28)'
                    : 'rgba(8,19,35,0.75)',
                border:
                  activeTopic === topic.title
                    ? '1px solid rgba(130,165,255,0.85)'
                    : '1px solid rgba(190,220,255,0.28)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                fontFamily: 'Gilroy, sans-serif',
              }}
            >
              <span className="text-[18px]">{topic.icon}</span>
              <span className="text-[13px] whitespace-nowrap">
                {topic.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Закреплённое поле вопроса */}
      <div
        className="absolute bottom-0 left-0 w-full px-4 pt-5 z-40"
        style={{
          paddingBottom: 'max(14px, env(safe-area-inset-bottom))',
          background:
            'linear-gradient(to top, rgba(5,12,25,0.85), transparent)',
        }}
      >
        <div
          className="flex items-center w-full h-[48px] rounded-full px-4"
          style={{
            background: 'rgba(45,52,68,0.75)',
            border: '1px solid rgba(210,225,255,0.45)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 0 15px rgba(0,0,0,0.2)',
          }}
        >
          <input
            type="text"
            placeholder="спросить у муун..."
            className="flex-1 min-w-0 bg-transparent outline-none text-white text-[14px] placeholder:text-white/65"
            style={{ fontFamily: 'Gilroy, sans-serif' }}
          />

          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(220,235,255,0.75)"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 2 11 13" />
            <path d="m22 2-7 20-4-9-9-4Z" />
          </svg>
        </div>
      </div>

    </div>
  );
}
