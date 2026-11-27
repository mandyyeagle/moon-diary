
import React, { useState, useRef } from 'react';

const dailyCharacters = [
  {
    image: 'moon_book.png',
    title: 'время для новых знаний',
    tips: [
      'узнай что-то новое сегодня. даже небольшое открытие может изменить твой взгляд на привычные вещи.',
      'выдели 15 минут на то, что давно хотела освоить. маленькие шаги тоже ведут к большим результатам.',
      'посмотри на привычную задачу с другой стороны. сегодня любопытство может привести к интересному открытию.',
      'вернись к книге, курсу или идее, которую когда-то оставила. возможно, сейчас самое время продолжить.',
      'не стремись узнать всё сразу. выбери одну тему и погрузись в неё с удовольствием.',
      'задай себе вопрос, на который давно хотела найти ответ. начни с поиска, а не с сомнений.',
      'поделись своими знаниями с кем-нибудь. иногда, объясняя другим, мы открываем новое для себя.',
    ],
  },
  {
    image: 'moon_declutter.png',
    title: 'порядок начинается с малого',
    tips: [
      'освободи немного пространства вокруг себя. иногда порядок снаружи помогает услышать себя внутри.',
      'выбери одну небольшую зону и наведи в ней порядок. не нужно переделывать всё сразу.',
      'отпусти вещи, которыми давно не пользуешься. освободи место для чего-то нового.',
      'разбери накопившиеся дела. запиши три главных и не пытайся решить всё за один день.',
      'попробуй сказать «нет» лишнему — вещам, задачам и обязательствам.',
      'убери то, что отвлекает внимание. пусть вокруг останется больше пространства для важного.',
      'заверши одно давно отложенное дело. маленькая завершённость тоже приносит облегчение.',
    ],
  },
  {
    image: 'moon_inspiration.png',
    title: 'вдохновение рядом',
    tips: [
      'прислушайся к своим идеям. запиши одну мысль, которую давно хотелось воплотить.',
      'не жди идеального момента для своей идеи. попробуй сделать первый шаг уже сегодня.',
      'разреши себе немного пофантазировать. не каждую мысль нужно сразу превращать в план.',
      'попробуй привычное занятие новым способом. неожиданный результат может тебя удивить.',
      'запиши идею, которая пришла сегодня в голову. даже если пока не знаешь, что с ней делать.',
      'найди источник вдохновения вне привычной ленты: прогулка, музыка, книга или разговор.',
      'не сравнивай свой путь с чужим. твои идеи заслуживают собственного пространства.',
    ],
  },
  {
    image: 'moon_money.png',
    title: 'день финансовой осознанности',
    tips: [
      'посмотри на свои расходы без критики. понимание финансов начинается с внимательного отношения к ним.',
      'перед покупкой спроси себя: действительно ли мне это нужно или я просто хочу порадовать себя?',
      'удели время своей финансовой цели. даже небольшой шаг приближает тебя к результату.',
      'проверь подписки и регулярные платежи. возможно, найдётся то, чем ты уже не пользуешься.',
      'подумай, как можно увеличить доход благодаря своим навыкам и опыту.',
      'замечай не только расходы, но и свои финансовые достижения. это тоже важно.',
      'если позволяет бюджет, отложи небольшую сумму. регулярность важнее размера.',
    ],
  },
  {
    image: 'moon_sport.png',
    title: 'время подвигаться',
    tips: [
      'добавь немного движения в свой день. прогулка, растяжка или короткая тренировка — выбирай сама.',
      'не обязательно устраивать большую тренировку. сегодня достаточно прогулки и немного движения.',
      'прислушайся к своему телу. выбери активность, после которой чувствуешь себя лучше.',
      'сделай небольшую разминку между делами. твоё тело оценит эту заботу.',
      'попробуй новое движение или тренировку. иногда смена привычного формата возвращает интерес.',
      'найди время для прогулки. свежий воздух поможет переключиться и восстановить силы.',
      'помни: отдых тоже часть заботы о теле. не нужно заслуживать право на паузу.',
    ],
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

// Номер календарного дня.
const getDayNumber = () => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);

  return Math.floor(
    (
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      ) - startOfYear
    ) / 86400000
  );
};

export default function MoonScreen({ onSelectTopic }) {
  const [activeTopic, setActiveTopic] = useState(null);
  const [activeCharacterIndex, setActiveCharacterIndex] = useState(0);

  const carouselRef = useRef(null);
  const topicsRef = useRef(null);

  const dragData = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
    moved: false,
  });

  const dayNumber = getDayNumber();

  // Переключение карусели.
  const handleCarouselScroll = () => {
    if (!carouselRef.current) return;

    const width = carouselRef.current.clientWidth;
    if (!width) return;

    const index = Math.round(
      carouselRef.current.scrollLeft / width
    );

    setActiveCharacterIndex(
      Math.min(index, dailyCharacters.length - 1)
    );
  };

  const goToCharacter = (index) => {
    if (!carouselRef.current) return;

    const width = carouselRef.current.clientWidth;

    carouselRef.current.scrollTo({
      left: width * index,
      behavior: 'smooth',
    });

    setActiveCharacterIndex(index);
  };

  // Свайпы карусели не переключают основной экран.
  const handleCarouselTouch = (event) => {
    event.stopPropagation();
  };

  // Перетаскивание тематической ленты мышкой.
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

  // Выбор темы и передача её агенту.
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

        {/* Карусель пяти МУУН */}
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
          {dailyCharacters.map((character, index) => (
            <div
              key={character.image}
              className="w-full shrink-0 snap-center"
            >

              {/* Карточка автоматически растёт вниз */}
              <div
                className="relative w-full min-h-[112px] rounded-full"
                style={{
                  overflow: 'visible',
                }}
              >

                {/* Стеклянный фон карточки */}
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(110deg, rgba(10,25,48,0.82), rgba(31,68,105,0.48))',
                    border: '1px solid rgba(190,220,255,0.35)',
                    boxShadow: '0 0 25px rgba(48,110,190,0.12)',
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                  }}
                />

                {/* МУУН — закреплена слева */}
                <div
                  className="absolute left-0 top-0 bottom-0 z-20 pointer-events-none"
                  style={{
                    width: 'clamp(110px, 12vw, 145px)',
                  }}
                >
                  <img
                    src={`/moon/characters/${character.image}`}
                    alt="муун"
                    draggable="false"
                    style={{
                      position: 'absolute',
                      left: 0,
                      bottom: 0,
                      height: '135px',
                      width: 'auto',
                      maxWidth: 'none',
                      objectFit: 'contain',
                      objectPosition: 'left bottom',
                    }}
                  />
                </div>

                {/* Текст — ровно 4 px после области МУУН */}
                <div
                  className="relative z-10 flex flex-col justify-center min-w-0"
                  style={{
                    marginLeft: 'calc(clamp(110px, 12vw, 145px) + 4px)',
                    padding: '12px 14px 12px 0',
                    gap: '4px',
                  }}
                >
                  <div
                    className="text-[15px] font-medium"
                    style={{
                      fontFamily: 'Gilroy, sans-serif',
                      overflowWrap: 'break-word',
                    }}
                  >
                    {character.title}
                  </div>

                  <div
                    className="text-[13px] leading-[1.25] font-light text-white/90"
                    style={{
                      fontFamily: 'Gilroy, sans-serif',
                      overflowWrap: 'break-word',
                    }}
                  >
                    {character.tips[(dayNumber - 1) % character.tips.length]}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Индикаторы карусели */}
        <div className="flex items-center justify-center gap-5 mt-4">
          {dailyCharacters.map((character, index) => (
            <button
              key={character.image}
              type="button"
              aria-label={`персонаж ${index + 1}`}
              onClick={() => goToCharacter(index)}
              className="rounded-full transition-all duration-500"
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
