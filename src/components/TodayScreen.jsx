import React, { useState, useEffect } from 'react';
import { MoonPhase, SearchMoonPhase, MakeTime, EclipticGeoMoon } from 'astronomy-engine';
import Moon from './Moon';
import { tipsData } from '../data/dailyTips';

export default function TodayScreen() {
  const today = new Date();
  
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [moonScale, setMoonScale] = useState(1);

  const handleScroll = (e) => {
    const y = e.target.scrollTop;
    const scale = Math.max(0.3, 1 - y * 0.002);
    setMoonScale(scale);
  };

  const formattedDate = today.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' }).toLowerCase();

  const astroData = (() => {
    try {
      const time = MakeTime(today);
      const phaseAngle = MoonPhase(today);
      const phase = (1 - Math.cos(phaseAngle * Math.PI / 180)) / 2;
      const isWaxing = phaseAngle < 180; 
      
      const prevNewMoon = SearchMoonPhase(0, time.AddDays(-30), 30);
      const daysSinceNewMoon = time.tt - prevNewMoon.tt;
      const lunarDay = Math.floor(daysSinceNewMoon) + 1;

      const moonPos = EclipticGeoMoon(today);
      const lon = moonPos.lon; 
      const zodiacIndex = Math.floor(lon / 30); 
      
      const zodiacNamesRu = ['овен', 'телец', 'близнецы', 'рак', 'лев', 'дева', 'весы', 'скорпион', 'стрелец', 'козерог', 'водолей', 'рыбы'];
      const zodiacNamesImg = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

      return {
        phase,
        phaseText: isWaxing ? 'растущая' : 'убывающая',
        lunarDay,
        zodiacRu: zodiacNamesRu[zodiacIndex] || 'овен',
        zodiacImg: zodiacNamesImg[zodiacIndex] || 'Aries'
      };
    } catch (error) {
      return { phase: 0.5, phaseText: 'растущая', lunarDay: 15, zodiacRu: 'лев', zodiacImg: 'Leo' };
    }
  })();

  const dayIndex = today.getDate() - 1; 
  const getTip = (category) => tipsData[category][dayIndex % tipsData[category].length];
  const currentAdvice = tipsData.dailyAdvice[dayIndex % tipsData.dailyAdvice.length];

  const cards = [
    getTip('health'), getTip('magic'), getTip('dreams'), getTip('beauty'), getTip('ritual')
  ];

  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    const userMessage = { role: 'user', text: inputText };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsTyping(true);

    try {
      const systemPrompt = `Ты — Муун, заботливый астролог-практик. 
Отвечай коротко, тепло, давай 1-2 практических совета. Пиши с маленькой буквы.
Контекст: дата ${formattedDate}, фаза Луны ${astroData.phaseText}, знак зодиака ${astroData.zodiacRu}, ${astroData.lunarDay}-й лунный день. Совет дня: ${currentAdvice}.
Пользователь спрашивает: ${inputText}`;

      const authResponse = await fetch('/api/oauth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'RqUID': crypto.randomUUID(),
          'Authorization': `Basic ${import.meta.env.VITE_GIGACHAT_CLIENT_ID}`
        },
        body: 'scope=GIGACHAT_API_PERS'
      });

      const authData = await authResponse.json();
      const accessToken = authData.access_token;
      if (!accessToken) throw new Error("Нет токена");

      const response = await fetch('/api/gigachat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          model: 'GigaChat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: inputText }
          ],
          temperature: 0.7,
        })
      });

      const data = await response.json();
      let aiText = "звезды сегодня молчат. попробуй спросить позже.";
      if (data.choices && data.choices[0].message.content) {
        aiText = data.choices[0].message.content;
      }

      setMessages([...newMessages, { role: 'ai', text: aiText }]);
    } catch (error) {
      console.error("Ошибка ИИ:", error);
      setMessages([...newMessages, { role: 'ai', text: "произошла ошибка связи с луной. проверь интернет." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden">
      
      {/* 1. ПРОКРУЧИВАЕМЫЙ КОНТЕНТ (Луна и карточки) */}
      <div 
        className="flex-1 overflow-y-auto w-full px-4 pt-24 pb-32" 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onScroll={handleScroll}
      >
        <div className="text-center mt-0 mb-0 text-white text-[20px]" style={{ fontFamily: 'Gilroy, sans-serif' }}>
          {formattedDate}
        </div>
        <div style={{ 
            transform: `scale(${moonScale})`,
            transition: 'transform 0.1s ease-out',
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '40px'
          }}
        >
          <Moon phase={astroData.phase} />
        </div>




        <div className="flex items-center justify-center gap-3 mt-100 mb-2">
          <span className="text-3xl leading-none select-none">🌙</span>
          <svg width="48" height="12" viewBox="0 0 48 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 6H46M46 6L41 1M46 6L41 11" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <img src={`/zodiac/${astroData.zodiacImg}.png`} alt="Zodiac" className="w-8 h-8 object-contain rounded-md" />
        </div>

        <div className="text-center text-white text-[24px] font-medium mb-1" style={{ fontFamily: 'Gilroy, sans-serif' }}>
          {astroData.phaseText}, {astroData.zodiacRu}, {astroData.lunarDay}-й день
        </div>
        
        <div className="text-center mb-6">
          <div className="text-[16px] text-gray-400 mb-1" style={{ fontFamily: 'Gilroy, sans-serif' }}>совет дня:</div>
          <div className="text-[16px] text-gray-400 leading-none" style={{ fontFamily: 'Gilroy, sans-serif' }}>
            {currentAdvice}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {cards.map((card, index) => (
            <div key={index} className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-3">
              <span className="text-2xl mr-3">{card.emoji}</span>
              <span className="text-white/90 text-[16px] lowercase font-extralight" style={{ fontFamily: 'Gilroy, sans-serif', letterSpacing: '0.05em' }}>
                {card.title} {card.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. НЕПОДВИЖНОЕ ПОЛЕ ВВОДА (Прибито к низу) */}
      <div className="absolute bottom-0 left-0 right-0 w-full p-4 bg-gradient-to-t from-[#0a0f1c] via-[#0a0f1c]/90 to-transparent z-50">
        
        {messages.length > 0 && (
          <div className="mb-4 max-h-60 overflow-y-auto flex flex-col gap-2" style={{ scrollbarWidth: 'none' }}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`p-3 rounded-2xl max-w-[85%] text-[14px] ${msg.role === 'user' ? 'bg-white/20 text-white self-end rounded-br-sm' : 'bg-[#1a2235]/90 text-gray-200 self-start rounded-bl-sm border border-white/10 backdrop-blur-md'}`} style={{ fontFamily: 'Gilroy, sans-serif' }}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="p-3 rounded-2xl bg-[#1a2235]/90 text-gray-400 self-start rounded-bl-sm border border-white/10 backdrop-blur-md text-[14px]">
                Муун печатает...
              </div>
            )}
          </div>
        )}

        <div className="relative">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="спросить у Муун..." 
            className="w-full bg-white/10 backdrop-blur-xl border border-white/30 shadow-[0_4px_30px_rgba(0,0,0,0.1)] rounded-full py-3 px-5 pr-12 text-white placeholder-gray-300 focus:outline-none focus:border-white/60 focus:bg-white/15 transition-all"
            style={{ fontFamily: 'Gilroy, sans-serif' }}
          />
          <button 
            onClick={handleSend}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}