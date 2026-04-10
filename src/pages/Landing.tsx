import { useState } from 'react';
import { signInWithGoogle } from '../lib/firebase';
import { BookOpen, Sparkles, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Landing() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { t, language, setLanguage } = useLanguage();

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ht' ? 'fr' : 'ht');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#D21034] relative overflow-hidden">
      {/* Minimal Haitian Culture Design Elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-[#00209F] opacity-90 rounded-b-[50%] transform -translate-y-16"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-yellow-400 opacity-10 rounded-full blur-2xl"></div>

      <div className="absolute top-6 right-6 z-20">
        <button 
          onClick={toggleLanguage}
          className="flex items-center space-x-2 bg-white text-[#00209F] px-5 py-3 rounded-full shadow-xl border-2 border-white/50 hover:scale-105 active:scale-95 transition-all animate-in fade-in zoom-in duration-500"
        >
          <Globe className="w-5 h-5 animate-pulse" />
          <span className="font-bold text-sm uppercase tracking-wider">{language === 'ht' ? 'Kreyòl' : 'Français'}</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm text-center space-y-8 z-10">
        <div className="bg-white p-6 rounded-full shadow-2xl transform hover:scale-105 transition-transform">
          <BookOpen className="w-20 h-20 text-[#00209F]" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-6xl font-bold tracking-tight font-serif text-white drop-shadow-md">
            {t('appName')}
          </h1>
          <p className="text-xl text-white/95 font-medium max-w-[280px] mx-auto leading-relaxed">
            {t('tagline')}
          </p>
        </div>

        <div className="w-full space-y-5 pt-8">
          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center space-x-3 bg-white text-[#D21034] py-4 px-6 rounded-2xl font-bold text-lg shadow-xl hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-70"
          >
            {isLoggingIn ? (
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#D21034] border-t-transparent"></div>
            ) : (
              <>
                <Sparkles className="w-6 h-6 text-[#00209F]" />
                <span>{t('loginWithGoogle')}</span>
              </>
            )}
          </button>
          <p className="text-sm text-white/80 font-medium">
            {t('startLearning')}
          </p>
        </div>
      </div>
    </div>
  );
}
