import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { ChevronRight, ChevronLeft, Bot, Target, Rocket, Sparkles, BookOpen, Crown, Building2, Star, Globe2 } from 'lucide-react';

export default function Welcome() {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    grade: '',
    school: ''
  });

  // If already logged in with full data, redirect
  useEffect(() => {
    try {
      const storedStr = localStorage.getItem('konek_user_profile');
      if (storedStr) {
        const data = JSON.parse(storedStr);
        if (data && data.name && data.age && data.grade && data.school) {
          navigate('/solver');
        }
      }
    } catch(e) {
      console.error("Failed to parse stored profile", e);
      localStorage.removeItem('konek_user_profile');
    }
  }, [navigate]);

  const handleNext = () => {
    if (isNextDisabled()) return;
    
    if (step === 3) {
      try {
        const secureData = {
          name: formData.name.trim(),
          age: formData.age.trim(),
          grade: formData.grade.trim(),
          school: formData.school.trim(),
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem('konek_user_profile', JSON.stringify(secureData));
        navigate('/solver');
      } catch (e) {
         console.error("Failed to save profile", e);
      }
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => setStep(prev => Math.max(0, prev - 1));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNext();
    }
  };

  const isNextDisabled = () => {
    if (step === 1 && !formData.name.trim()) return true;
    if (step === 2 && (!formData.age.trim() || !formData.grade.trim())) return true;
    if (step === 3 && !formData.school.trim()) return true;
    return false;
  };

  // Animation variants
  const floatingAnimation = {
    y: ['-10px', '10px'],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut"
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-900 overflow-hidden flex flex-col pt-4 items-center font-sans">
      {/* Decorative Glowing Orbs Background */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[120px] opacity-40 mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-rose-600 rounded-full blur-[100px] opacity-30 mix-blend-screen pointer-events-none"></div>
      <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-amber-500 rounded-full blur-[100px] opacity-20 mix-blend-screen pointer-events-none"></div>
      
      {/* Language Toggler at the top */}
      <div className="z-20 w-full max-w-md px-6 flex justify-end">
         <div className="flex bg-slate-800/80 backdrop-blur-md p-1 rounded-full border border-slate-700">
           <button 
             onClick={() => setLanguage('ht')}
             className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${language === 'ht' ? 'bg-[#00209F] text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
           >
             Kreyòl
           </button>
           <button 
             onClick={() => setLanguage('fr')}
             className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${language === 'fr' ? 'bg-[#00209F] text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
           >
             Français
           </button>
         </div>
      </div>

      <div className="w-full max-w-md px-6 z-10 flex flex-col flex-1 h-full pt-8">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex flex-col items-center flex-1 justify-center -mt-10"
            >
              <motion.div 
                animate={floatingAnimation}
                className="relative mb-10 w-32 h-32 flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-[#00209F] to-[#D21034] rounded-3xl blur-xl opacity-60"></div>
                <div className="relative bg-gradient-to-tr from-[#00209F] to-[#D21034] p-6 rounded-3xl shadow-2xl border border-white/20">
                  <Bot className="w-16 h-16 text-white" />
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-4 -right-4"
                  >
                    <Sparkles className="w-8 h-8 text-amber-300" />
                  </motion.div>
                </div>
              </motion.div>
              
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200 text-center mb-6 leading-tight drop-shadow-xl">
                {t('welcomeHeadline')}
              </h1>
              <p className="text-lg text-indigo-100 text-center mb-12 font-medium leading-relaxed px-2">
                {t('welcomeSub')}
              </p>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95, y: 4 }}
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-[#D21034] to-[#a00b26] text-white font-black text-2xl py-5 rounded-2xl shadow-[0_8px_0_rgb(112,8,27)] transition-all flex items-center justify-center space-x-3 border-2 border-red-400"
              >
                <Rocket className="w-8 h-8" />
                <span>{t('startOnboarding')}</span>
              </motion.button>
            </motion.div>
          )}

          {step > 0 && (
            <div className="flex-1 flex w-full flex-col justify-center pb-20 mt-8" key="form-steps">
              <motion.div
                key={`step${step}`}
                initial={{ opacity: 0, x: 100, rotateY: 15 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: -100, rotateY: -15 }}
                transition={{ type: "spring", stiffness: 250, damping: 25 }}
                className="bg-white/10 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-[0_0_40px_rgba(0,0,0,0.3)] border border-white/20 relative w-full"
              >
                {/* Back Button */}
                <button 
                  onClick={handleBack} 
                  className="absolute top-6 left-6 text-indigo-200 hover:text-white transition-colors bg-white/5 p-2 rounded-full backdrop-blur-sm"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Progress Indicator */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                  <div className="bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900 font-bold px-6 py-2 rounded-full shadow-lg border-2 border-white/50 flex items-center space-x-2">
                    <Star className="w-4 h-4 fill-slate-900" />
                    <span>{t('level')} {step}/3</span>
                    <Star className="w-4 h-4 fill-slate-900" />
                  </div>
                </div>

                <div className="mt-8">
                  {step === 1 && (
                    <motion.div 
                      className="space-y-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="flex justify-center mb-2">
                        <motion.div animate={floatingAnimation} className="bg-gradient-to-br from-[#00209F] to-[#001566] p-5 rounded-3xl shadow-xl border border-white/20">
                          <Crown className="w-12 h-12 text-[#F9D616]" />
                        </motion.div>
                      </div>
                      <h2 className="text-2xl font-black text-center text-white drop-shadow-md">{t('stepNameTitle')}</h2>
                      <div className="relative group">
                        <input 
                          autoFocus 
                          type="text" 
                          value={formData.name} 
                          onKeyDown={handleKeyDown}
                          onChange={e => setFormData({...formData, name: e.target.value})} 
                          className="w-full text-center text-2xl font-bold bg-white/10 text-white placeholder-indigo-200 border-2 border-white/20 p-5 rounded-2xl focus:border-amber-400 focus:bg-white/20 focus:ring-4 focus:ring-amber-400/20 outline-none transition-all shadow-inner" 
                          placeholder={t('placeholderName')} 
                        />
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div 
                      className="space-y-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="flex justify-center mb-2">
                        <motion.div animate={floatingAnimation} className="bg-gradient-to-br from-[#D21034] to-[#990a25] p-5 rounded-3xl shadow-xl border border-white/20">
                          <Target className="w-12 h-12 text-white" />
                        </motion.div>
                      </div>
                      <h2 className="text-2xl font-black text-center text-white drop-shadow-md">{t('stepAgeClassTitle')}</h2>
                      <div className="space-y-5">
                        <div>
                          <label className="text-sm font-black text-indigo-200 uppercase tracking-widest pl-2 mb-2 block flex items-center">
                            <span className="bg-white/20 p-1 rounded-sm mr-2 text-xs">AGE</span> {t('age')}
                          </label>
                          <input 
                            autoFocus 
                            type="number" 
                            value={formData.age} 
                            onKeyDown={handleKeyDown}
                            onChange={e => setFormData({...formData, age: e.target.value})} 
                            className="w-full text-2xl font-bold bg-white/10 text-white placeholder-indigo-200 border-2 border-white/20 p-4 pl-6 rounded-2xl focus:border-emerald-400 focus:bg-white/20 focus:ring-4 focus:ring-emerald-400/20 outline-none transition-all shadow-inner" 
                            placeholder="Ex: 15" 
                          />
                        </div>
                        <div>
                          <label className="text-sm font-black text-indigo-200 uppercase tracking-widest pl-2 mb-2 block flex items-center">
                            <BookOpen className="w-4 h-4 mr-2" /> {t('gradeLabel')}
                          </label>
                          <input 
                            type="text" 
                            value={formData.grade} 
                            onKeyDown={handleKeyDown}
                            onChange={e => setFormData({...formData, grade: e.target.value})} 
                            className="w-full text-xl font-bold bg-white/10 text-white placeholder-indigo-200 border-2 border-white/20 p-4 pl-6 rounded-2xl focus:border-emerald-400 focus:bg-white/20 focus:ring-4 focus:ring-emerald-400/20 outline-none transition-all shadow-inner" 
                            placeholder="Ex: 9ème, NS3..." 
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div 
                      className="space-y-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="flex justify-center mb-2">
                        <motion.div animate={floatingAnimation} className="bg-gradient-to-br from-[#00209F] to-[#D21034] p-5 rounded-3xl shadow-xl border border-white/20">
                          <Building2 className="w-12 h-12 text-white" />
                        </motion.div>
                      </div>
                      <h2 className="text-2xl font-black text-center text-white drop-shadow-md">{t('stepSchoolTitle')}</h2>
                      <input 
                        autoFocus 
                        type="text" 
                        value={formData.school} 
                        onKeyDown={handleKeyDown}
                        onChange={e => setFormData({...formData, school: e.target.value})} 
                        className="w-full text-center text-2xl font-bold bg-white/10 text-white placeholder-indigo-200 border-2 border-white/20 p-5 rounded-2xl focus:border-rose-400 focus:bg-white/20 focus:ring-4 focus:ring-rose-400/20 outline-none transition-all shadow-inner" 
                        placeholder={t('schoolName')} 
                      />
                    </motion.div>
                  )}
                </div>

                <motion.button 
                  disabled={isNextDisabled()}
                  whileHover={!isNextDisabled() ? { scale: 1.02 } : {}}
                  whileTap={!isNextDisabled() ? { scale: 0.95, y: 4 } : {}}
                  onClick={handleNext}
                  className="mt-12 w-full bg-gradient-to-r from-amber-400 to-amber-500 disabled:opacity-50 disabled:from-slate-500 disabled:to-slate-600 disabled:shadow-[0_4px_0_rgb(71,85,105)] disabled:border-slate-400 text-slate-900 font-black text-xl py-5 rounded-2xl shadow-[0_6px_0_rgb(180,83,9)] transition-all flex items-center justify-center space-x-2 border-2 border-amber-300"
                >
                  <span className="tracking-wide">{step === 3 ? t('finishBtn') : t('nextBtn')}</span>
                  {step !== 3 && <ChevronRight className="w-6 h-6 stroke-[3]" />}
                </motion.button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
