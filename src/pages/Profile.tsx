import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, User, BookOpen, Building2, Save, LogOut } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Profile() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    grade: '',
    school: '',
    avatar: '🤖'
  });

  const avatarOptions = ['🤖', '👽', '👾', '👻', '👑', '🦁', '🚀', '🌟', '🦄', '🦖', '🐼', '🦊'];

  useEffect(() => {
    const profileStr = localStorage.getItem('konek_user_profile');
    if (profileStr) {
      try {
        const data = JSON.parse(profileStr);
        setFormData({
          name: data.name || '',
          age: data.age || '',
          grade: data.grade || '',
          school: data.school || '',
          avatar: data.avatar || '🤖'
        });
      } catch (e) {
        console.error("Failed to parse profile", e);
      }
    }
  }, []);

  const handleSave = () => {
    try {
      const secureData = {
        name: formData.name.trim(),
        age: formData.age.trim(),
        grade: formData.grade.trim(),
        school: formData.school.trim(),
        avatar: formData.avatar,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('konek_user_profile', JSON.stringify(secureData));
      setIsEditing(false);
    } catch (e) {
      console.error("Failed to save profile", e);
    }
  };

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleLogout = () => {
    setIsConfirmingDelete(true);
  };

  const confirmDelete = () => {
    localStorage.removeItem('konek_user_profile');
    navigate('/');
  };

  const cancelDelete = () => {
    setIsConfirmingDelete(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 overflow-hidden font-sans relative">
      {/* Background elements */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-rose-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md p-4 sticky top-0 z-20 flex items-center justify-between border-b border-white/10">
        <button 
          onClick={() => navigate('/solver')}
          className="p-2 text-indigo-300 hover:text-white transition-colors bg-white/5 rounded-full"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-black text-white">{t('profile')}</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </header>

      <main className="p-4 sm:p-6 max-w-md mx-auto relative z-10 pt-8 pb-24 space-y-6">
        
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4">
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="text-amber-400 font-bold text-sm bg-white/5 px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors"
              >
                {t('editProfile')}
              </button>
            )}
          </div>

          <div className="flex flex-col items-center mt-4 mb-6">
            <div className="relative group">
              <div className="w-28 h-28 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-[2rem] flex items-center justify-center border-4 border-white/20 shadow-2xl mb-4 transform group-hover:scale-105 transition-all duration-300">
                <span className="text-6xl drop-shadow-lg">
                  {formData.avatar}
                </span>
              </div>
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 rounded-[2rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                   <p className="text-white font-bold text-xs">{t('editAvatar')}</p>
                </div>
              )}
            </div>
            {!isEditing && <h2 className="text-3xl font-black text-white text-center drop-shadow-md">{formData.name}</h2>}
          </div>

          {isEditing ? (
            <div className="space-y-5">
              
              {/* Avatar Selector */}
              <div>
                 <label className="text-xs font-black text-indigo-300 uppercase tracking-widest pl-2 mb-2 block">
                  {t('chooseAvatar')}
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {avatarOptions.map(avatar => (
                    <button
                      key={avatar}
                      onClick={() => setFormData({...formData, avatar})}
                      className={`h-12 text-2xl flex items-center justify-center rounded-xl transition-all ${
                        formData.avatar === avatar 
                          ? 'bg-amber-400 scale-110 shadow-[0_0_15px_rgba(251,191,36,0.5)] z-10' 
                          : 'bg-white/5 hover:bg-white/20'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-indigo-300 uppercase tracking-widest pl-2 mb-1 block">
                  {t('name')}
                </label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 text-white border border-white/20 p-3 rounded-xl focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-indigo-300 uppercase tracking-widest pl-2 mb-1 block">
                    {t('age')}
                  </label>
                  <input 
                    type="number" 
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className="w-full bg-white/5 text-white border border-white/20 p-3 rounded-xl focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-indigo-300 uppercase tracking-widest pl-2 mb-1 block">
                    {t('gradeLabel').split('(')[0]}
                  </label>
                  <input 
                    type="text" 
                    value={formData.grade}
                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                    className="w-full bg-white/5 text-white border border-white/20 p-3 rounded-xl focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-black text-indigo-300 uppercase tracking-widest pl-2 mb-1 block">
                  {t('stepSchoolTitle')}
                </label>
                <input 
                  type="text" 
                  value={formData.school}
                  onChange={(e) => setFormData({...formData, school: e.target.value})}
                  className="w-full bg-white/5 text-white border border-white/20 p-3 rounded-xl focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
                >
                  {t('cancel')}
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-900 bg-amber-400 hover:bg-amber-500 transition-colors shadow-lg flex justify-center items-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>{t('save')}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white/5 rounded-2xl p-4 flex items-center space-x-4 border border-white/10">
                <div className="bg-indigo-500/20 p-3 rounded-xl text-indigo-300">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest">{t('age')}</p>
                  <p className="text-lg font-medium text-white">{formData.age}</p>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-2xl p-4 flex items-center space-x-4 border border-white/10">
                <div className="bg-emerald-500/20 p-3 rounded-xl text-emerald-300">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-300 uppercase tracking-widest">{t('gradeLabel').split('(')[0]}</p>
                  <p className="text-lg font-medium text-white">{formData.grade}</p>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-2xl p-4 flex items-center space-x-4 border border-white/10">
                <div className="bg-rose-500/20 p-3 rounded-xl text-rose-300">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-rose-300 uppercase tracking-widest">{t('schoolName')}</p>
                  <p className="text-lg font-medium text-white">{formData.school}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Danger Zone */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="pt-6"
        >
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-4 rounded-2xl border-2 border-rose-500/30 text-rose-400 font-bold hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>{t('deleteAccount')}</span>
          </button>
        </motion.div>

      </main>

      {/* Delete Confirmation Modal */}
      {isConfirmingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-rose-500/30 p-6 rounded-3xl max-w-sm w-full shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>
            <h3 className="text-xl font-black text-white mb-2">{t('deleteAccount')}</h3>
            <p className="text-slate-300 mb-6 font-medium">{t('confirmDeleteAccount')}</p>
            <div className="flex space-x-3">
              <button 
                onClick={cancelDelete}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 transition-colors"
              >
                {t('cancel')}
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-[0_0_15px_rgba(225,29,72,0.5)]"
              >
                {t('deleteAccount')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
