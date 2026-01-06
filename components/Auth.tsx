import React, { useState, useEffect } from 'react';
import { AuthState, User, ThemeType } from '../types';
import { CAPTCHA_CHARS } from '../constants';

interface AuthProps {
  onLogin: (user: User) => void;
}

const generateCaptcha = () => {
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += CAPTCHA_CHARS.charAt(Math.floor(Math.random() * CAPTCHA_CHARS.length));
  }
  return result;
};

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState<AuthState>({
    isLogin: true,
    username: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
    captchaInput: '',
    agreeTerms: false,
    generatedCaptcha: generateCaptcha()
  });
  const [error, setError] = useState<string | null>(null);

  const refreshCaptcha = () => {
    setFormData(prev => ({ ...prev, generatedCaptcha: generateCaptcha(), captchaInput: '' }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({...formData, agreeTerms: e.target.checked});
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.mobile || !formData.password) {
        setError("Please fill in required fields.");
        return;
    }
    
    if (formData.captchaInput.toUpperCase() !== formData.generatedCaptcha) {
        setError("Invalid Captcha.");
        refreshCaptcha();
        return;
    }

    if (isSignup) {
        if (!formData.username) {
            setError("Username required.");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (!formData.agreeTerms) {
            setError("You must agree to terms.");
            return;
        }
    }

    // Mock API Success
    // In real app, call API here.
    const mockUser: User = {
        username: isSignup ? formData.username : "Player1",
        mobile: formData.mobile,
        coins: isSignup ? 100 : 250, // Signup bonus vs returning user
        unlockedThemes: [ThemeType.PINE],
        currentLevelIndex: 0,
        soundEnabled: true
    };
    
    onLogin(mockUser);
  };

  return (
    <div className="h-full w-full flex items-center justify-center p-6 relative overflow-hidden">
       {/* Background */}
       <div className="absolute inset-0 bg-gradient-to-br from-green-900 to-black z-0"></div>
       <div className="absolute -top-20 -left-20 w-64 h-64 bg-green-600 rounded-full blur-3xl opacity-20"></div>
       <div className="absolute top-40 -right-20 w-80 h-80 bg-blue-600 rounded-full blur-3xl opacity-20"></div>

       <div className="relative z-10 w-full max-w-sm bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl animate-float">
          <div className="text-center mb-6">
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-200">EARN 1</h1>
              <p className="text-gray-300 text-sm">{isSignup ? "Create your account" : "Welcome back!"}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                  <div>
                    <input 
                        name="username" 
                        placeholder="Username" 
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                    />
                  </div>
              )}
              
              <div>
                <input 
                    name="mobile" 
                    placeholder="Mobile Number" 
                    type="tel"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                />
              </div>

              <div>
                <input 
                    name="password" 
                    placeholder="Password" 
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                />
              </div>

              {isSignup && (
                  <>
                    <div>
                        <input 
                            name="confirmPassword" 
                            placeholder="Confirm Password" 
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                        />
                    </div>
                    <div>
                        <input 
                            name="referralCode" 
                            placeholder="Referral Code (Optional)" 
                            value={formData.referralCode}
                            onChange={handleChange}
                            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                        />
                    </div>
                  </>
              )}

              {/* Captcha */}
              <div className="flex gap-2">
                 <div className="flex-1 bg-white/20 rounded-lg flex items-center justify-center font-mono text-xl tracking-widest font-bold select-none text-yellow-300" onClick={refreshCaptcha}>
                    {formData.generatedCaptcha}
                 </div>
                 <input 
                    name="captchaInput"
                    placeholder="Enter Code"
                    value={formData.captchaInput}
                    onChange={handleChange}
                    className="w-1/2 bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 text-center uppercase"
                 />
              </div>

              {isSignup && (
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                      <input type="checkbox" id="terms" checked={formData.agreeTerms} onChange={handleToggle} className="accent-green-500 w-4 h-4" />
                      <label htmlFor="terms">I agree to the Terms & Conditions</label>
                  </div>
              )}
              
              {error && <p className="text-red-400 text-sm text-center font-bold bg-red-900/20 p-2 rounded">{error}</p>}

              <button type="submit" className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-3 rounded-lg shadow-lg transform active:scale-95 transition-all">
                  {isSignup ? "Sign Up" : "Login"}
              </button>
          </form>

          <div className="mt-6 text-center">
              <button onClick={() => { setIsSignup(!isSignup); setError(null); refreshCaptcha(); }} className="text-sm text-green-300 hover:text-green-200 underline">
                  {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
              </button>
          </div>
       </div>
    </div>
  );
};

export default Auth;
