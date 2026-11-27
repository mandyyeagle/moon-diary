
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MoonPhase,
  SearchMoonPhase,
  MakeTime,
  EclipticGeoMoon,
} from 'astronomy-engine';
import Moon from './Moon';
import { tipsData } from '../data/dailyTips';

export default function TodayScreen({
  initialPrompt,
  onPromptHandled,
  onCloseChat,
  overlayMode = false,
}) {
  const today = new Date();

  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);

  const messagesEndRef = useRef(null);
  const lastPromptRef = useRef(null);

  // Прокрутка переписки к последнему сообщению.
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [messages, isTyping]);

  const formattedDate = today
    .toLocaleDateString('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
    .toLowerCase();

  // Расчёт лунных данных.
  const astroData = (() => {
    try {
      const time = MakeTime(today);
      const phaseAngle = MoonPhase(today);

      const phase =
        (1 - Math.cos(phaseAngle * Math.PI / 180)) / 2;

      const isWaxing = phaseAngle < 180;

      const prevNewMoon = SearchMoonPhase(
        0,
        time.AddDays(-30),
        30
      );

      const daysSinceNewMoon = time.tt - prevNewMoon.tt;
      const lunarDay = Math.floor(daysSinceNewMoon) + 1;

      const moonPos = EclipticGeoMoon(today);
      const lon = moonPos.lon;
      const zodiacIndex = Math.floor(lon / 30);

      const zodiacNamesRu = [
        'овен',
        'телец',
        'близнецы',
        'рак',
        'лев',
        'дева',
        'весы',
        'скорпион',
        'стрелец',
        'козерог',
        'водолей',
        'рыбы',
      ];

      const zodiacNamesImg = [
        'Aries',
        'Taurus',
        'Gemini',
        'Cancer',
        'Leo',
        'Virgo',
        'Libra',
        'Scorpio',
        'Sagittarius',
        'Capricorn',
        'Aquarius',
        'Pisces',
      ];

      return {
        phase,
        phaseText: isWaxing ? 'растущая' : 'убывающая',
        lunarDay,
        zodiacRu: zodiacNamesRu[zodiacIndex] || 'овен',
        zodiacImg: zodiacNamesImg[zodiacIndex] || 'Aries',
      };
    } catch (error) {
      console.error('Ошибка расчёта лунных данных:', error);

      return {
        phase: 0.5,
        phaseText: 'растущая',
        lunarDay: 15,
        zodiacRu: 'лев',
        zodiacImg: 'Leo',
      };
    }
  })();

  const dayIndex = today.getDate() - 1;

  const getTip = (category) =>
    tipsData[category][dayIndex % tipsData[category].length];

  const currentAdvice =
    tipsData.dailyAdvice[dayIndex % tipsData.dailyAdvice.length];

  const cards = [
    getTip('health'),
    getTip('magic'),
    getTip('dreams'),
    getTip('beauty'),
    getTip('ritual'),
  ];

  // Отправка сообщения МУУН.
  const handleSend = async (textToSend) => {
    const messageText = (textToSend || inputText).trim();

    if (!messageText || isTyping) return;

    setIsChatOpen(true);

    const userMessage = {
      role: 'user',
      text: messageText,
    };

    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInputText('');
    setIsTyping(true);

    try {
      const systemPrompt = `Ты — Муун, заботливый астролог-практик и помощник.
Отвечай коротко, тепло и понятно. Давай 1-2 практических совета.
Пиши с маленькой буквы.
Не выдавай предположения за факты.
Не ставь диагнозы и не назначай лечение.
Контекст: дата ${formattedDate}, фаза Луны ${astroData.phaseText},
знак зодиака ${astroData.zodiacRu}, ${astroData.lunarDay}-й лунный день.
Совет дня: ${currentAdvice}.`;

      const response = await fetch('/api/gigachat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            ...newMessages.map((message) => ({
              role: message.role === 'ai' ? 'assistant' : 'user',
              content: message.text,
            })),
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка ответа Groq');
      }

      const data = await response.json();

      const aiText =
        data.choices?.[0]?.message?.content ||
        'звезды сегодня молчат. попробуй спросить позже.';

      setMessages([
        ...newMessages,
        {
          role: 'ai',
          text: aiText,
        },
      ]);
    } catch (error) {
      console.error('Ошибка ИИ:', error);

      setMessages([
        ...newMessages,
        {
          role: 'ai',
          text: 'произошла ошибка связи с луной. попробуй ещё раз немного позже.',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Получение выбранной темы с экрана «муун».
  useEffect(() => {
    if (!initialPrompt) {
      lastPromptRef.current = null;
      return;
    }

    if (lastPromptRef.current === initialPrompt) return;

    lastPromptRef.current = initialPrompt;

    setIsChatOpen(true);
    handleSend(initialPrompt);

    if (onPromptHandled) {
      onPromptHandled();
    }
  }, [initialPrompt]);

  // Сворачивание чата без удаления истории.
  const handleCloseChat = () => {
    setIsChatOpen(false);

    if (onCloseChat) {
      onCloseChat();
    }
  };

  // В режиме overlay не показываем основной экран.
  // Компонент остаётся смонтированным, поэтому история сохраняется.
  if (overlayMode && !isChatOpen) {
    return null;
  }

  return (
    <div
      className={
        overlayMode
          ? 'fixed inset-0 z-[50] pointer-events-none'
          : 'relative flex flex-col w-full h-full overflow-hidden'
      }
      onTouchStart={
        overlayMode
          ? (event) => event.stopPropagation()
          : undefined
      }
      onTouchEnd={
        overlayMode
          ? (event) => event.stopPropagation()
          : undefined
      }
    >

      {/* Основной экран «сегодня».
          В overlayMode он полностью скрыт. */}
      {!overlayMode && (
        <div
          className="flex-1 overflow-y-auto w-full px-4 pt-24 pb-32"
          onScroll={(event) =>
            setScrollTop(event.currentTarget.scrollTop)
          }
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <div
            className="text-center mt-0 mb-0 text-white text-[20px]"
            style={{ fontFamily: 'Gilroy, sans-serif' }}
          >
            {formattedDate}
          </div>

          <motion.div
            className="origin-center"
            animate={{
              scale: Math.max(0.48, 1 - scrollTop / 430),
            }}
            transition={{
              duration: 0.16,
              ease: 'easeOut',
            }}
          >
            <Moon phase={astroData.phase} />
          </motion.div>

          <div className="flex items-center justify-center gap-3 mt-0 mb-2">
            <span className="text-3xl leading-none select-none">
              🌙
            </span>

            <svg
              width="48"
              height="12"
              viewBox="0 0 48 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 6H46M46 6L41 1M46 6L41 11"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <img
              src={`/zodiac/${astroData.zodiacImg}.png`}
              alt="знак зодиака"
              className="w-8 h-8 object-contain rounded-md"
            />
          </div>

          <div
            className="text-center text-white text-[24px] font-medium mb-1"
            style={{ fontFamily: 'Gilroy, sans-serif' }}
          >
            {astroData.phaseText}, {astroData.zodiacRu},{' '}
            {astroData.lunarDay}-й день
          </div>

          <div className="text-center mb-6">
            <div
              className="text-[16px] text-gray-400 mb-1"
              style={{ fontFamily: 'Gilroy, sans-serif' }}
            >
              совет дня:
            </div>

            <div
              className="text-[16px] text-white/90"
              style={{ fontFamily: 'Gilroy, sans-serif' }}
            >
              {currentAdvice}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {cards.map((card, index) => (
              <div
                key={index}
                onClick={() =>
                  handleSend(
                    `расскажи подробнее про: ${card.title} ${card.text}`
                  )
                }
                className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-3 transition-all duration-300 ease-in-out hover:bg-white/20 cursor-pointer active:scale-95"
              >
                <span className="text-2xl mr-3">
                  {card.emoji}
                </span>

                <span
                  className="text-white text-[15px] lowercase"
                  style={{ fontFamily: 'Gilroy, sans-serif' }}
                >
                  {card.title} {card.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Затемнение и размытие фона */}
      {isChatOpen && (
        <div
          onClick={handleCloseChat}
          className={
            overlayMode
              ? 'fixed inset-0 z-40 bg-[#0a0f1c]/60 backdrop-blur-md transition-opacity duration-300 cursor-pointer pointer-events-auto'
              : 'absolute inset-0 z-40 bg-[#0a0f1c]/60 backdrop-blur-md transition-opacity duration-300 cursor-pointer'
          }
        />
      )}

      {/* Окно переписки */}
      {isChatOpen && (
        <div
          className={
            overlayMode
              ? 'fixed inset-x-0 top-[76px] bottom-0 z-[55] flex flex-col px-4 pointer-events-none'
              : 'absolute inset-x-0 top-[76px] bottom-0 z-[55] flex flex-col px-4 pointer-events-none'
          }
        >

          {/* Кнопка сворачивания */}
          <div className="flex justify-center py-2 shrink-0 pointer-events-auto">
            <button
              onClick={handleCloseChat}
              className="flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1 text-xs text-gray-300 hover:text-white hover:bg-white/20 transition-all"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
              свернуть
            </button>
          </div>

          {/* История переписки */}
          <div
            className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 py-2 pointer-events-auto overscroll-contain"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl max-w-[85%] text-[14px] ${
                  msg.role === 'user'
                    ? 'bg-white/20 text-white self-end rounded-br-sm'
                    : 'bg-[#1a2235]/90 text-gray-200 self-start rounded-bl-sm border border-white/10 backdrop-blur-md'
                }`}
                style={{ fontFamily: 'Gilroy, sans-serif' }}
              >
                {msg.text}
              </div>
            ))}

            {isTyping && (
              <div className="p-3 rounded-2xl bg-[#1a2235]/90 text-gray-400 self-start rounded-bl-sm border border-white/10 backdrop-blur-md text-[14px]">
                муун печатает...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Поле отправки сообщения */}
          <div className="shrink-0 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pointer-events-auto">
            <div className="relative">
              <input
                type="text"
                value={inputText}
                onChange={(event) =>
                  setInputText(event.target.value)
                }
                onKeyDown={(event) =>
                  event.key === 'Enter' && handleSend()
                }
                placeholder="спросить у муун..."
                className="w-full bg-white/10 backdrop-blur-xl border border-white/30 shadow-[0_4px_30px_rgba(0,0,0,0.1)] rounded-full py-3 px-5 pr-12 text-white placeholder-gray-300 focus:outline-none focus:border-white/60 focus:bg-white/15 transition-all"
                style={{ fontFamily: 'Gilroy, sans-serif' }}
              />

              <button
                onClick={() => handleSend()}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Поле ввода на основном экране в свёрнутом состоянии */}
      {!overlayMode && !isChatOpen && (
        <div className="absolute bottom-0 left-0 right-0 w-full p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-gradient-to-t from-[#0a0f1c] via-[#0a0f1c]/90 to-transparent z-50">
          <div className="relative">
            <input
              type="text"
              value={inputText}
              onChange={(event) =>
                setInputText(event.target.value)
              }
              onKeyDown={(event) =>
                event.key === 'Enter' && handleSend()
              }
              placeholder="спросить у муун..."
              className="w-full bg-white/10 backdrop-blur-xl border border-white/30 shadow-[0_4px_30px_rgba(0,0,0,0.1)] rounded-full py-3 px-5 pr-12 text-white placeholder-gray-300 focus:outline-none focus:border-white/60 focus:bg-white/15 transition-all"
              style={{ fontFamily: 'Gilroy, sans-serif' }}
            />

            <button
              onClick={() => handleSend()}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
