import { LevelData, ThemeType } from './types';

export const THEME_COLORS: Record<ThemeType, string> = {
  [ThemeType.PINE]: 'from-green-800 to-green-600',
  [ThemeType.FOREST]: 'from-emerald-900 to-emerald-700',
  [ThemeType.OCEAN]: 'from-blue-900 to-blue-600',
  [ThemeType.MOUNTAIN]: 'from-slate-800 to-slate-600',
};

export const THEME_BG_IMAGES: Record<ThemeType, string> = {
  [ThemeType.PINE]: 'https://picsum.photos/id/10/800/1200', // Nature/Forest
  [ThemeType.FOREST]: 'https://picsum.photos/id/28/800/1200', // Woods
  [ThemeType.OCEAN]: 'https://picsum.photos/id/16/800/1200', // Water
  [ThemeType.MOUNTAIN]: 'https://picsum.photos/id/29/800/1200', // Mountain
};

// Hardcoded starter levels
export const INITIAL_LEVELS: LevelData[] = [
  {
    id: 1,
    theme: ThemeType.PINE,
    name: "Pine 1",
    letters: ['A', 'C', 'T'],
    words: [
      { word: 'ACT', startX: 0, startY: 0, direction: 'horizontal', found: false },
      { word: 'CAT', startX: 1, startY: 0, direction: 'vertical', found: false },
    ]
  },
  {
    id: 2,
    theme: ThemeType.PINE,
    name: "Pine 2",
    letters: ['D', 'O', 'G', 'S'],
    words: [
      { word: 'DOGS', startX: 0, startY: 1, direction: 'horizontal', found: false },
      { word: 'DOG', startX: 0, startY: 1, direction: 'horizontal', found: false },
      { word: 'GOD', startX: 2, startY: 0, direction: 'vertical', found: false },
      { word: 'SO', startX: 3, startY: 1, direction: 'vertical', found: false },
    ]
  },
  {
    id: 3,
    theme: ThemeType.FOREST,
    name: "Forest 1",
    letters: ['E', 'A', 'R', 'N'],
    words: [
      { word: 'EARN', startX: 0, startY: 0, direction: 'horizontal', found: false },
      { word: 'NEAR', startX: 3, startY: 0, direction: 'vertical', found: false },
      { word: 'ARE', startX: 1, startY: 0, direction: 'vertical', found: false },
      { word: 'ERA', startX: 0, startY: 0, direction: 'vertical', found: false },
    ]
  },
  {
    id: 4,
    theme: ThemeType.OCEAN,
    name: "Ocean 1",
    letters: ['W', 'A', 'T', 'E', 'R'],
    words: [
      { word: 'WATER', startX: 0, startY: 2, direction: 'horizontal', found: false },
      { word: 'RAW', startX: 0, startY: 2, direction: 'vertical', found: false },
      { word: 'WAR', startX: 0, startY: 0, direction: 'vertical', found: false },
      { word: 'RATE', startX: 2, startY: 2, direction: 'vertical', found: false },
      { word: 'EAT', startX: 3, startY: 2, direction: 'vertical', found: false },
    ]
  },
];

export const CAPTCHA_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';