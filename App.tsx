import React, { useState, useEffect } from 'react';
import { AppScreen, User } from './types';
import Auth from './components/Auth';
import Game from './components/Game';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.SPLASH);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Splash Timer
    if (currentScreen === AppScreen.SPLASH) {
      const timer = setTimeout(() => {
        const hasVisited = localStorage.getItem('earn1_visited');
        setCurrentScreen(hasVisited ? AppScreen.AUTH : AppScreen.INTRO);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const handleIntroComplete = () => {
    localStorage.setItem('earn1_visited', 'true');
    setCurrentScreen(AppScreen.AUTH);
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentScreen(AppScreen.GAME);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen(AppScreen.AUTH);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case AppScreen.SPLASH:
        return (
          <div className="h-full w-full flex flex-col items-center justify-center bg-gray-900 text-white">
            <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 animate-pulse mb-4">
              EARN 1
            </h1>
            <div className="w-16 h-16 border-4 border-t-green-500 border-gray-700 rounded-full animate-spin"></div>
          </div>
        );

      case AppScreen.INTRO:
        return (
          <IntroScreen onComplete={handleIntroComplete} />
        );

      case AppScreen.AUTH:
        return <Auth onLogin={handleLogin} />;

      case AppScreen.GAME:
        if (!user) return null; // Should not happen
        return <Game user={user} onUpdateUser={setUser} onLogout={handleLogout} />;
        
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full bg-gray-900 text-white select-none">
      {renderScreen()}
    </div>
  );
};

const IntroScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const slides = [
        { icon: "fa-brain", title: "Smart Puzzles", text: "Challenge your mind with hundreds of levels." },
        { icon: "fa-book-open", title: "Expand Vocabulary", text: "Learn new words and improve your skills." },
        { icon: "fa-gift", title: "Earn Rewards", text: "Collect coins and unlock beautiful themes." },
    ];

    const nextStep = () => {
        if (step < slides.length - 1) setStep(step + 1);
        else onComplete();
    };

    return (
        <div className="h-full w-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-900 to-gray-800 text-center">
            <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-fade-in">
                <div className="w-32 h-32 bg-green-500/20 rounded-full flex items-center justify-center mb-6 ring-4 ring-green-500/30">
                    <i className={`fa-solid ${slides[step].icon} text-5xl text-green-400`}></i>
                </div>
                <h2 className="text-3xl font-bold">{slides[step].title}</h2>
                <p className="text-gray-400 max-w-xs text-lg">{slides[step].text}</p>
            </div>
            
            <div className="w-full pb-8">
                <div className="flex justify-center gap-2 mb-8">
                    {slides.map((_, i) => (
                        <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-green-500' : 'w-2 bg-gray-600'}`}></div>
                    ))}
                </div>
                <button 
                    onClick={nextStep}
                    className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all text-lg"
                >
                    {step === slides.length - 1 ? "Get Started" : "Next"}
                </button>
            </div>
        </div>
    );
};

export default App;
