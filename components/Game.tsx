import React, { useState, useEffect, useCallback } from 'react';
import { User, LevelData, ThemeType, AppScreen } from '../types';
import { INITIAL_LEVELS, THEME_BG_IMAGES, THEME_COLORS } from '../constants';
import { generateAILevel, getHintForWord } from '../services/gemini';
import Wheel from './Wheel';
import Grid from './Grid';

interface GameProps {
  user: User;
  onUpdateUser: (u: User) => void;
  onLogout: () => void;
}

const Game: React.FC<GameProps> = ({ user, onUpdateUser, onLogout }) => {
  const [currentLevel, setCurrentLevel] = useState<LevelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [foundWordsCount, setFoundWordsCount] = useState(0);
  const [animatingCoins, setAnimatingCoins] = useState(false);

  // Initialize Level
  useEffect(() => {
    loadLevel(user.currentLevelIndex);
  }, [user.currentLevelIndex]);

  const loadLevel = async (index: number) => {
    setLoading(true);
    // Determine Theme based on index
    // 0-2 Pine, 3-5 Forest, etc.
    // For demo, we cycle through predefined or generate new ones
    if (index < INITIAL_LEVELS.length) {
      setCurrentLevel(JSON.parse(JSON.stringify(INITIAL_LEVELS[index]))); // Deep copy to reset state
    } else {
      // Generate AI Level
      const themes = Object.values(ThemeType);
      const theme = themes[index % themes.length];
      const aiLevel = await generateAILevel(theme, index + 1);
      if (aiLevel) {
        setCurrentLevel(aiLevel);
      } else {
        // Fallback to random initial level if AI fails
        const fallback = INITIAL_LEVELS[index % INITIAL_LEVELS.length];
        setCurrentLevel({ ...JSON.parse(JSON.stringify(fallback)), id: index + 1, name: `Level ${index + 1}` });
      }
    }
    setFoundWordsCount(0);
    setLoading(false);
  };

  const handleWordSubmit = (word: string) => {
    if (!currentLevel) return;

    const targetWord = currentLevel.words.find(w => w.word === word && !w.found);
    
    if (targetWord) {
      // Correct Word!
      const newWords = currentLevel.words.map(w => 
        w.word === word ? { ...w, found: true } : w
      );
      
      setCurrentLevel({ ...currentLevel, words: newWords });
      
      // Check for level completion
      const foundCount = newWords.filter(w => w.found).length;
      if (foundCount === newWords.length) {
        handleLevelComplete();
      }
    } else {
      // Wrong word or already found
      const alreadyFound = currentLevel.words.find(w => w.word === word && w.found);
      if (alreadyFound) {
        showToast("Already found!");
      } else {
        // Check if it's a bonus word (valid but not in grid)
        // For simplicity in this demo, we just shake or show error
      }
    }
  };

  const handleLevelComplete = () => {
    setAnimatingCoins(true);
    setTimeout(() => {
      setAnimatingCoins(false);
      onUpdateUser({
        ...user,
        coins: user.coins + 50,
        currentLevelIndex: user.currentLevelIndex + 1
      });
      showToast("Level Complete! +50 Coins");
    }, 1500);
  };

  const showToast = (msg: string) => {
    setHintMessage(msg);
    setTimeout(() => setHintMessage(null), 2000);
  };

  const handleShuffle = () => {
    if (!currentLevel) return;
    const shuffled = [...currentLevel.letters].sort(() => Math.random() - 0.5);
    setCurrentLevel({ ...currentLevel, letters: shuffled });
  };

  const handleHint = async () => {
    if (user.coins < 25) {
      showToast("Not enough coins!");
      return;
    }
    if (!currentLevel) return;

    // Find first unfound word
    const hiddenWord = currentLevel.words.find(w => !w.found);
    if (hiddenWord) {
        onUpdateUser({ ...user, coins: user.coins - 25 });
        const hint = await getHintForWord(hiddenWord.word);
        showToast(`Hint for ${hiddenWord.word.length} letter word: ${hint}`);
    }
  };

  if (loading || !currentLevel) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-900">
        <i className="fa-solid fa-circle-notch fa-spin text-4xl text-green-500"></i>
      </div>
    );
  }

  const bgImage = THEME_BG_IMAGES[currentLevel.theme];
  const themeGradient = THEME_COLORS[currentLevel.theme];

  return (
    <div className="relative h-full w-full overflow-hidden flex flex-col">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-1000"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className={`absolute inset-0 bg-gradient-to-b ${themeGradient} opacity-80 z-0`}></div>

      {/* Top Bar */}
      <div className="relative z-10 flex justify-between items-center p-4 pt-8 text-white">
        <div className="flex items-center gap-2 bg-black/20 p-2 rounded-lg backdrop-blur-sm cursor-pointer" onClick={onLogout}>
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
             <i className="fa-solid fa-user text-sm"></i>
          </div>
          <span className="text-xs font-bold hidden sm:block">Logout</span>
        </div>
        
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest opacity-80">{currentLevel.theme}</span>
          <span className="text-xl font-bold font-serif">Level {currentLevel.id}</span>
        </div>

        <div className="flex items-center gap-2 bg-black/20 p-2 rounded-lg backdrop-blur-sm">
          <i className="fa-solid fa-coins text-yellow-400"></i>
          <span className="font-bold">{user.coins}</span>
        </div>
      </div>

      {/* Game Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-between pb-8 pt-4">
        
        {/* Hint Toast */}
        <div className={`absolute top-20 transition-opacity duration-300 ${hintMessage ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-black/70 text-white px-6 py-2 rounded-full backdrop-blur-md shadow-lg">
            {hintMessage}
          </div>
        </div>

        {/* Crossword Grid */}
        <div className="flex-1 flex items-center justify-center w-full px-4">
          <Grid words={currentLevel.words} />
        </div>

        {/* Controls */}
        <div className="w-full flex items-center justify-between px-8 mb-4 max-w-md">
           <button onClick={handleShuffle} className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur text-white shadow-lg active:scale-95 transition-all">
             <i className="fa-solid fa-shuffle"></i>
           </button>
           <button onClick={handleHint} className="w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg active:scale-95 transition-all flex flex-col items-center justify-center">
             <i className="fa-solid fa-lightbulb"></i>
             <span className="text-[10px] font-bold -mt-1">25</span>
           </button>
        </div>

        {/* Wheel */}
        <div className="mb-8">
          <Wheel 
            letters={currentLevel.letters} 
            onWordSubmit={handleWordSubmit}
            onShuffle={handleShuffle}
          />
        </div>
      </div>

      {/* Level Complete Animation Overlay */}
      {animatingCoins && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
           <div className="text-center animate-bounce">
              <h2 className="text-4xl font-bold text-yellow-400 mb-4 drop-shadow-lg">Excellent!</h2>
              <div className="text-6xl text-yellow-400">
                <i className="fa-solid fa-coins animate-spin"></i>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Game;
