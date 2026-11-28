import React, { useMemo, useRef, useState } from 'react';
import { getDailyCards } from '../data/dailyPrompts';

const topics = [
  { id: 'travel', icon: '✈️', title: 'путешествия' },
  { id: 'design', icon: '🎨', title: 'дизайн' },
  { id: 'cooking', icon: '🍽️', title: 'готовка' },
  { id: 'plants', icon: '🌿', title: 'растения' },
  { id: 'self_knowledge', icon: '🧘', title: 'самопознание' },
  { id: 'beauty', icon: '🎀', title: 'красота' },
  { id: 'sport', icon: '💪', title: 'спорт' },
  { id: 'learning', icon: '📚', title: 'обучение' },
  { id: 'money', icon: '💰', title: 'финансы' },
  { id: 'home', icon: '🏡', title: 'дом' },
  { id: 'relationships', icon: '❤️', title: 'отношения' },
  { id: 'health', icon: '🩺', title: 'здоровье' },
  { id: 'career', icon: '💼', title: 'карьера' },
  { id: 'events', icon: '🎉', title: 'события' },
  { id: 'personal_growth', icon: '✨', title: 'личное развитие' },
];

const CHARACTER_WIDTH = 140;
const CHARACTER_GAP = 4;

function getPromptItems(card) {
  if (!card) return [];

  const promptList =
    card.prompts ||
    card.suggestions ||
    card.dailyPrompts ||
    card.items;

  if (Array.isArray(promptList) && promptList.length > 0) {
    return promptList;
  }

  return [card];
}

function getPromptTitle(prompt, index) {
  if (typeof prompt === 'string') return prompt;

  return (
    prompt?.title ||
    prompt?.label ||
    prompt?.text ||
    prompt?.prompt ||
    `подсказка ${index + 1}`
  );
}

function getPromptDescription(prompt) {
  if (typeof prompt === 'string') return '';

  const description =
    prompt?.text ||
    prompt?.description ||
    prompt?.prompt ||
    '';

  return description === getPromptTitle(prompt, 0) ? '' : description;
}

export default function MoonScreen({ onSelectTopic }) {
  const [activeCharacterIndex, setActiveCharacterIndex] = useState(0);
  const [question, setQuestion] = useState('');
  const [showAllPrompts, setShowAllPrompts] = useState(false);

  const carouselRef = useRef(null);
  const scrollLockRef = useRef(false);

  const dailyCards = getDailyCards();

  const cards = useMemo(
    () =>
      topics.map((topic) => {
        const dailyCard = Array.isArray(dailyCards)
          ? dailyCards.find((card) => card.id === topic.id)
          : null;

        return {
          ...topic,
          ...(dailyCard || {}),
          id: topic.id,
          topic: dailyCard?.topic || topic.title,
          image: dailyCard?.image || `${topic.id}.png`,
        };
      }),
    [dailyCards]
  );

  const activeCard = cards[activeCharacterIndex];
  const activePrompts = getPromptItems(activeCard);
  const visiblePrompts = showAllPrompts
    ? activePrompts
    : activePrompts.slice(0, 3);

  const handleCarouselScroll = () => {
    if (!carouselRef.current || scrollLockRef.current) return;

    const width = carouselRef.current.clientWidth;
    if (!width) return;

    const index = Math.round(carouselRef.current.scrollLeft / width);
    const safeIndex = Math.max(0, Math.min(index, cards.length - 1));

    setActiveCharacterIndex((current) =>
      current === safeIndex ? current : safeIndex
    );
  };

  const goToCharacter = (index) => {
    if (!carouselRef.current) return;

    const safeIndex = Math.max(0, Math.min(index, cards.length - 1));
    const width = carouselRef.current.clientWidth;

    scrollLockRef.current = true;
    carouselRef.current.scrollTo({
      left: width * safeIndex,
      behavior: 'smooth',
    });

    setActiveCharacterIndex(safeIndex);
    setShowAllPrompts(false);

    window.setTimeout(() => {
      scrollLockRef.current = false;
    }, 500);
  };

  const handleCarouselTouch = (event) => {
    event.stopPropagation();
  };

  const openPromptChat = (card, prompt) => {
    if (!card || !prompt || !onSelectTopic) return;

    const promptTitle = getPromptTitle(prompt, 0);
    const promptText =
      typeof prompt === 'string'
        ? prompt
        : prompt?.text ||
          prompt?.description ||
          prompt?.prompt ||
          promptTitle;

    const agentPrompt =
      typeof prompt === 'object' && prompt?.agentPrompt
        ? prompt.agentPrompt
        : `Тема: ${card.topic || card.title}.
Подсказка дня: ${promptTitle}.
${promptText}

Продолжи со мной диалог по этой теме. Учитывай мои ответы, задавай уместные уточняющие вопросы и предлагай конкретные, выполнимые шаги.`;

    onSelectTopic({
      title: card.topic || card.title,
      agentPrompt,
    });
  };

  const handleQuestionSubmit = (event) => {
    event.preventDefault();

    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || !onSelectTopic) return;

    onSelectTopic({
      title: activeCard?.topic || activeCard?.title || 'общение',
      agentPrompt: `Выбранная тема: ${activeCard?.topic || activeCard?.title || 'общение'}.
Мой вопрос: ${trimmedQuestion}

Ответь мне в диалоге как МУУН: бережно, конкретно и с учётом выбранной темы.`,
    });

    setQuestion('');
  };

  return (
    <div className="relative flex flex-col w-full h-full text-white overflow-hidden">

      {/* Единая прокручиваемая область: карусель, подсказки и все темы */}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden px-3"
        style={{
          paddingTop: '105px',
          paddingBottom: '105px',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >

        {/* Карусель персонажей МУУН */}
        <div
          ref={carouselRef}
          className="flex w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory"
          style={{
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-x',
            paddingTop: '28px',
          }}
          onScroll={handleCarouselScroll}
          onTouchStart={handleCarouselTouch}
          onTouchMove={handleCarouselTouch}
          onTouchEnd={handleCarouselTouch}
        >
          {cards.map((card) => (
            <div
              key={card.id}
              className="w-full shrink-0 snap-center"
            >
              <div className="relative block w-full text-left">
                <div
                  className="relative w-full min-h-[130px] rounded-[56px]"
                  style={{ overflow: 'visible' }}
                >
                  {/* Стеклянный фон карточки */}
                  <div
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(110deg, rgba(10,25,48,0.82), rgba(31,68,105,0.48))',
                      border: '1px solid rgba(190,220,255,0.35)',
                      boxShadow: '0 0 25px rgba(48,110,190,0.12)',
                      backdropFilter: 'blur(14px)',
                      WebkitBackdropFilter: 'blur(14px)',
                    }}
                  />

                  {/* Персонаж прикреплён к левой стороне карточки */}
                  <div
                    className="absolute left-0 bottom-0 z-20 pointer-events-none"
                    style={{
                      width: `${CHARACTER_WIDTH}px`,
                      height: '135px',
                    }}
                  >
                    <img
                      src={`/moon/characters/${card.image}`}
                      alt={`муун — ${card.topic}`}
                      draggable="false"
                      loading="eager"
                      decoding="async"
                      onLoad={(event) => {
                        event.currentTarget.style.opacity = '1';
                        event.currentTarget.style.visibility = 'visible';
                      }}
                      onError={(event) => {
                        console.error(
                          'Не удалось загрузить изображение МУУН:',
                          event.currentTarget.src
                        );
                        event.currentTarget.style.visibility = 'visible';
                        event.currentTarget.style.opacity = '1';
                      }}
                      style={{
                        display: 'block',
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        zIndex: 1,
                        width: `${CHARACTER_WIDTH}px`,
                        height: '135px',
                        maxWidth: 'none',
                        objectFit: 'contain',
                        objectPosition: 'left bottom',
                        opacity: 1,
                        visibility: 'visible',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>

                  {/* Текст карточки */}
                  <div
                    className="relative z-10 flex flex-col justify-center min-w-0"
                    style={{
                      marginLeft: `${CHARACTER_WIDTH + CHARACTER_GAP}px`,
                      maxWidth: '720px',
                      minHeight: '130px',
                      padding: '16px 18px 16px 0',
                      gap: '4px',
                      fontFamily: 'Gilroy, sans-serif',
                    }}
                  >
                    <div
                      className="text-[15px] font-medium"
                      style={{ overflowWrap: 'break-word' }}
                    >
                      {card.title || card.topic}
                    </div>

                    <div
                      className="text-[13px] leading-[1.25] font-light text-white/90"
                      style={{ overflowWrap: 'break-word' }}
                    >
                      {card.text}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Индикаторы карусели */}
        <div className="flex items-center justify-center gap-3 mt-4">
          {cards.map((card, index) => (
            <button
              key={card.id}
              type="button"
              aria-label={`перейти к теме ${card.topic}`}
              onClick={() => goToCharacter(index)}
              className="rounded-full transition-all duration-300"
              style={{
                width: activeCharacterIndex === index ? '12px' : '7px',
                height: '7px',
                padding: 0,
                background:
                  activeCharacterIndex === index
                    ? '#557cff'
                    : 'rgba(190,210,255,0.35)',
                boxShadow:
                  activeCharacterIndex === index
                    ? '0 0 10px rgba(85,124,255,0.9)'
                    : 'none',
                border: 'none',
              }}
            />
          ))}
        </div>

        {/* Подсказки выбранной темы */}
        <section
          className="mt-5 mb-5"
          style={{ fontFamily: 'Gilroy, sans-serif' }}
        >
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="text-[14px] font-medium">
              ✨ подсказки на сегодня
            </div>
            <div className="text-[11px] text-white/50">
              {activeCard?.title || activeCard?.topic}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {visiblePrompts.map((prompt, index) => (
              <button
                key={`${activeCard.id}-prompt-${index}`}
                type="button"
                onClick={() => openPromptChat(activeCard, prompt)}
                className="w-full text-left rounded-2xl px-3 py-3 transition-all duration-200"
                style={{
                  background: 'rgba(13,28,49,0.72)',
                  border: '1px solid rgba(190,220,255,0.22)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  fontFamily: 'Gilroy, sans-serif',
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex items-center justify-center shrink-0 rounded-full"
                    style={{
                      width: '27px',
                      height: '27px',
                      background: 'rgba(85,124,255,0.2)',
                      color: '#b8c8ff',
                      fontSize: '12px',
                    }}
                  >
                    {index + 1}
                  </span>

                  <span className="flex-1 min-w-0">
                    <span className="block text-[13px] leading-[1.35] text-white/95">
                      {getPromptTitle(prompt, index)}
                    </span>
                    {getPromptDescription(prompt) && (
                      <span className="block mt-1 text-[11px] leading-[1.35] text-white/60">
                        {getPromptDescription(prompt)}
                      </span>
                    )}
                  </span>

                  <span className="text-[20px] text-white/70">→</span>
                </div>
              </button>
            ))}
          </div>

          {activePrompts.length > 3 && (
            <button
              type="button"
              onClick={() => setShowAllPrompts((value) => !value)}
              className="w-full mt-2 py-2 text-[12px] text-[#b8c8ff]"
              style={{
                background: 'transparent',
                border: 'none',
                fontFamily: 'Gilroy, sans-serif',
              }}
            >
              {showAllPrompts
                ? 'свернуть подсказки'
                : `ещё ${activePrompts.length - 3} подсказки`}
            </button>
          )}
        </section>

        {/* Все 15 тем одновременно видны в сетке 3 × 5 */}
        <section
          className="mb-5"
          style={{ fontFamily: 'Gilroy, sans-serif' }}
        >
          <div className="text-[14px] font-medium mb-3 px-1">
            выбери направление
          </div>

          <div className="grid grid-cols-3 gap-2">
            {topics.map((topic, index) => {
              const isActive = activeCharacterIndex === index;

              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => goToCharacter(index)}
                  aria-pressed={isActive}
                  className="flex flex-col items-center justify-center gap-1 min-w-0 rounded-2xl px-1 py-3 transition-all duration-300"
                  style={{
                    minHeight: '66px',
                    background: isActive
                      ? 'rgba(85,124,255,0.28)'
                      : 'rgba(8,19,35,0.75)',
                    border: isActive
                      ? '1px solid rgba(150,175,255,0.95)'
                      : '1px solid rgba(190,220,255,0.25)',
                    boxShadow: isActive
                      ? '0 0 16px rgba(85,124,255,0.32)'
                      : 'none',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                  }}
                >
                  <span className="text-[19px] leading-none">
                    {topic.icon}
                  </span>
                  <span className="text-[10px] leading-[1.15] text-center break-words">
                    {topic.title}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Закреплённое поле вопроса — отправляет сообщение выбранной МУУН */}
      <div
        className="absolute bottom-0 left-0 w-full px-4 pt-4 z-40"
        style={{
          paddingBottom: 'max(14px, env(safe-area-inset-bottom))',
          background:
            'linear-gradient(to top, rgba(5,12,25,0.92), rgba(5,12,25,0.35), transparent)',
        }}
      >
        <form
          onSubmit={handleQuestionSubmit}
          className="flex items-center w-full h-[48px] rounded-full px-4"
          style={{
            background: 'rgba(45,52,68,0.82)',
            border: '1px solid rgba(210,225,255,0.45)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 0 15px rgba(0,0,0,0.2)',
          }}
        >
          <input
            type="text"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="спросить у муун..."
            className="flex-1 min-w-0 bg-transparent outline-none text-white text-[14px] placeholder:text-white/65"
            style={{ fontFamily: 'Gilroy, sans-serif' }}
          />

          <button
            type="submit"
            aria-label="отправить вопрос"
            disabled={!question.trim()}
            className="ml-2 flex items-center justify-center shrink-0"
            style={{
              width: '28px',
              height: '28px',
              color: question.trim()
                ? 'rgba(220,235,255,0.95)'
                : 'rgba(220,235,255,0.4)',
              background: 'transparent',
              border: 'none',
              cursor: question.trim() ? 'pointer' : 'default',
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 2 11 13" />
              <path d="m22 2-7 20-4-9-9-4Z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
