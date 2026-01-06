export enum AppScreen {
  SPLASH = 'SPLASH',
  INTRO = 'INTRO',
  AUTH = 'AUTH',
  GAME = 'GAME',
}

export enum ThemeType {
  PINE = 'PINE',
  FOREST = 'FOREST',
  OCEAN = 'OCEAN',
  MOUNTAIN = 'MOUNTAIN',
}

export interface User {
  username: string;
  mobile: string;
  coins: number;
  unlockedThemes: ThemeType[];
  currentLevelIndex: number; // Global level index
  soundEnabled: boolean;
}

export interface WordPosition {
  word: string;
  startX: number;
  startY: number;
  direction: 'horizontal' | 'vertical';
  found: boolean;
}

export interface LevelData {
  id: number;
  theme: ThemeType;
  name: string;
  letters: string[]; // The letters available on the wheel
  words: WordPosition[]; // The words to fill in the grid
  bonusWords?: string[]; // Valid words that aren't in the grid
}

export interface AuthState {
  isLogin: boolean;
  username: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  referralCode: string;
  captchaInput: string;
  agreeTerms: boolean;
  generatedCaptcha: string;
}
