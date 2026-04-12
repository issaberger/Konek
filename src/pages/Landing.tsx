import { useState, useEffect } from 'react';
import { signInWithGoogle, auth } from '../lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { BookOpen, Sparkles, Globe, Phone, ArrowRight, Info, X, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';

export default function Landing() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isPhoneAuth, setIsPhoneAuth] = useState(false);
  const [countryCode, setCountryCode] = useState('+509');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const { t, language, setLanguage } = useLanguage();

  const COUNTRIES = [
    { code: '+509', flag: '🇭🇹', name: 'Haiti' },
    { code: '+1', flag: '🇺🇸', name: 'US/Canada' },
    { code: '+33', flag: '🇫🇷', name: 'France' },
    { code: '+1809', flag: '🇩🇴', name: 'Dominican Rep.' },
  ];

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
    
    if (!localStorage.getItem('konek_welcomed')) {
      setShowWelcome(true);
    }
  }, []);

  const closeWelcome = () => {
    localStorage.setItem('konek_welcomed', 'true');
    setShowWelcome(false);
  };

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSendCode = async () => {
    if (!phoneNumber) return;
    setIsLoggingIn(true);
    try {
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      const formattedPhone = `${countryCode}${cleanPhone}`;
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      alert(t('codeSent'));
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/unauthorized-domain') {
        alert(t('phoneAuthError'));
      } else {
        alert(`${t('invalidPhone')} (${error.message})`);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || !confirmationResult) return;
    setIsLoggingIn(true);
    try {
      await confirmationResult.confirm(verificationCode);
    } catch (error) {
      console.error(error);
      alert(t('incorrect'));
    } finally {
      setIsLoggingIn(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ht' ? 'fr' : 'ht');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#D21034] relative overflow-hidden">
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

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm mx-auto text-center space-y-8 z-10 px-6 pt-20 pb-10">
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

        <div className="w-full space-y-4 pt-4">
          {!isPhoneAuth ? (
            <>
              <button
                onClick={handleGoogleLogin}
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
              
              <div className="flex items-center justify-center space-x-2 text-white/80">
                <div className="h-px w-12 bg-white/30"></div>
                <span className="text-xs font-bold">{t('or')}</span>
                <div className="h-px w-12 bg-white/30"></div>
              </div>

              <button
                onClick={() => setIsPhoneAuth(true)}
                className="w-full flex items-center justify-center space-x-3 bg-[#00209F] text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-xl hover:bg-[#001a80] active:scale-95 transition-all"
              >
                <Phone className="w-6 h-6" />
                <span>{t('phoneSignIn')}</span>
              </button>
            </>
          ) : (
            <div className="bg-white p-6 rounded-3xl shadow-2xl space-y-4 text-left animate-in fade-in slide-in-from-bottom-4">
              <button onClick={() => setIsPhoneAuth(false)} className="text-sm text-gray-500 hover:text-gray-800 mb-2 font-medium">← Back</button>
              
              {!confirmationResult ? (
                <>
                  <label className="block text-sm font-bold text-gray-700">{t('phoneNumber')}</label>
                  <div className="flex space-x-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#D21034]/50 w-28 text-base"
                    >
                      {COUNTRIES.map((country, idx) => (
                        <option key={idx} value={country.code}>
                          {country.flag} {country.code}
                        </option>
                      ))}
                    </select>
                    <input 
                      type="tel" 
                      placeholder="3000 0000" 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D21034]/50"
                    />
                  </div>
                  <button
                    onClick={handleSendCode}
                    disabled={isLoggingIn || !phoneNumber}
                    className="w-full bg-[#D21034] text-white py-3 rounded-xl font-bold shadow-md hover:bg-[#b00d2b] transition-colors disabled:opacity-70 flex justify-center items-center"
                  >
                    {isLoggingIn ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div> : t('sendCode')}
                  </button>
                </>
              ) : (
                <>
                  <label className="block text-sm font-bold text-gray-700">{t('enterCode')}</label>
                  <input 
                    type="text" 
                    placeholder="123456" 
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D21034]/50 text-center tracking-widest text-lg font-bold"
                  />
                  <button
                    onClick={handleVerifyCode}
                    disabled={isLoggingIn || !verificationCode}
                    className="w-full bg-[#00209F] text-white py-3 rounded-xl font-bold shadow-md hover:bg-[#001a80] transition-colors disabled:opacity-70 flex justify-center items-center"
                  >
                    {isLoggingIn ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div> : t('verifyCode')}
                  </button>
                </>
              )}
            </div>
          )}
          
          <p className="text-sm text-white/80 font-medium pt-4">
            {t('startLearning')}
          </p>
        </div>
      </div>

      <div id="recaptcha-container"></div>

      {/* Welcome Modal */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-6 animate-in fade-in zoom-in duration-300 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#00209F] to-[#D21034]"></div>
            
            <button onClick={closeWelcome} className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 pt-2">
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">{t('welcomeTitle')}</h2>
              <p className="text-[#00209F] font-medium">{t('welcomeSubtitle')}</p>
            </div>

            <div className="space-y-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <h3 className="font-bold text-gray-900">{t('howItWorks')}</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-xl leading-none">📸</span>
                  <span>{t('step1')}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-xl leading-none">🤖</span>
                  <span>{t('step2')}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-xl leading-none">✅</span>
                  <span>{t('step3')}</span>
                </li>
              </ul>
            </div>

            <p className="text-sm font-medium text-gray-600 italic text-center">
              {t('noStress')}
            </p>

            <button 
              onClick={closeWelcome}
              className="w-full bg-[#D21034] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-[#b00d2b] transition-colors flex items-center justify-center space-x-2"
            >
              <span>{t('tryNow')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto bg-[#00209F] text-white/80 py-6 px-6 z-10 relative overflow-hidden">
        {/* Subtle Haitian Art Pattern in Footer */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="haitian-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40L40 0H20L0 20M40 40V20L20 40" fill="currentColor" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#haitian-pattern)" />
          </svg>
        </div>

        <div className="max-w-sm mx-auto flex flex-col items-center justify-center space-y-4 relative z-10">
          <div className="flex space-x-4">
            <Link to="/about" className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors">
              <Info className="w-4 h-4" />
              <span className="text-sm font-medium">{t('about')}</span>
            </Link>
            <Link to="/terms" className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors">
              <span className="text-sm font-medium">{t('terms')}</span>
            </Link>
          </div>
          <div className="text-xs text-center space-y-1">
            <p>Konèk © {new Date().getFullYear()}</p>
            <p className="opacity-75">{t('creator')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
