import {
  EclipticLongitude,
  MoonPhase,
  Illumination,
  SearchMoonPhase,
  MakeTime,
  Body,
} from 'astronomy-engine';

type ZodiacSign = {
  nameRu: string;
  fileName: string;
};

const ZODIAC_SIGNS: ZodiacSign[] = [
  { nameRu: 'овен', fileName: 'Aries' },
  { nameRu: 'телец', fileName: 'Taurus' },
  { nameRu: 'близнецы', fileName: 'Gemini' },
  { nameRu: 'рак', fileName: 'Cancer' },
  { nameRu: 'лев', fileName: 'Leo' },
  { nameRu: 'дева', fileName: 'Virgo' },
  { nameRu: 'весы', fileName: 'Libra' },
  { nameRu: 'скорпион', fileName: 'Scorpio' },
  { nameRu: 'стрелец', fileName: 'Sagittarius' },
  { nameRu: 'козерог', fileName: 'Capricorn' },
  { nameRu: 'водолей', fileName: 'Aquarius' },
  { nameRu: 'рыбы', fileName: 'Pisces' },
];

/**
 * Форматирует текущую дату по-русски: "пятница, 29 сентября"
 */
export function getFormattedDate(date: Date = new Date()): string {
  return date
    .toLocaleDateString('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
    .toLowerCase();
}

/**
 * Вычисляет полную информацию о Луне на заданную дату.
 */
export function getMoonInfo(date: Date = new Date()) {
  // Эклиптическая долгота Луны (0–360°) — используется для знака зодиака
  const longitude = EclipticLongitude(Body.Moon, date);
  const normLon = ((longitude % 360) + 360) % 360;

  // Знак зодиака: каждый знак = 30 градусов
  const signIndex = Math.floor(normLon / 30) % 12;
  const sign = ZODIAC_SIGNS[signIndex];

  // Фаза Луны в градусах (0 = новолуние, 180 = полнолуние, 360 = новолуние)
  const phaseAngle = ((MoonPhase(date) % 360) + 360) % 360;

  // Освещённость (0.0 = темно, 1.0 = полностью освещено)
  const illumination = Illumination(Body.Moon, date).phase;

  // phase для компонента Moon: 0 = новолуние (полная тень), 0.5 = полнолуние (без тени), 1 = новолуние
  const phase = phaseAngle / 360;

  // Растущая (0–180°) или убывающая (180–360°)
  const isWaxing = phaseAngle < 180;
  const phaseText = isWaxing ? 'растущая' : 'убывающая';

  // Лунный день: приблизительно по углу фазы ( lunar cycle ≈ 29.53 дней )
  const lunarDay = Math.floor((phaseAngle / 360) * 29.53) + 1;

  // Поиск последнего новолуния для уточнения лунного дня (опционально, можно уточнить)
  // Сейчас используем приблизительный расчёт по углу фазы

  return {
    dateString: getFormattedDate(date),
    signName: sign.nameRu,
    fileName: sign.fileName,
    imageSrc: `/zodiac/${sign.fileName}.png`,
    phase,
    phaseText,
    illumination,
    lunarDay,
    phaseAngle,
  };
}

