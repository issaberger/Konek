import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { logout } from '../lib/firebase';
import { Flame, Star, Award, LogOut } from 'lucide-react';

export default function Profile() {
  const { user, userData } = useAuth();
  const { t } = useLanguage();

  if (!userData) return null;

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f0]">
      <header className="bg-white p-4 shadow-sm sticky top-0 z-10 flex justify-between items-center">
        <h1 className="text-2xl font-serif font-bold text-[#00209F]">{t('profile')}</h1>
        <button onClick={logout} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
          <LogOut className="w-6 h-6" />
        </button>
      </header>

      <main className="flex-1 p-4 space-y-6 pb-24">
        {/* User Info Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm flex items-center space-x-4">
          <img 
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${userData.displayName}&background=00209F&color=fff`} 
            alt="Profile" 
            className="w-20 h-20 rounded-full border-4 border-blue-50"
          />
          <div>
            <h2 className="text-xl font-bold text-gray-900">{userData.displayName}</h2>
            <p className="text-gray-500">{userData.email}</p>
            <div className="inline-block mt-2 px-3 py-1 bg-blue-100 text-[#00209F] text-xs font-bold uppercase tracking-wider rounded-full">
              {userData.grade_level}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl p-5 shadow-sm flex flex-col items-center text-center space-y-2">
            <div className="bg-blue-50 p-3 rounded-full">
              <Star className="w-8 h-8 text-[#00209F]" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{userData.points}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{t('points')}</p>
          </div>
          
          <div className="bg-white rounded-3xl p-5 shadow-sm flex flex-col items-center text-center space-y-2">
            <div className="bg-red-50 p-3 rounded-full">
              <Flame className="w-8 h-8 text-[#D21034]" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{userData.streak_days}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{t('streak')}</p>
          </div>
        </div>

        {/* Badges Section */}
        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 flex items-center space-x-2">
            <Award className="w-5 h-5 text-[#00209F]" />
            <span>{t('badges')}</span>
          </h3>
          
          <div className="flex flex-wrap gap-3">
            {userData.badges?.map((badge: string, i: number) => (
              <div key={i} className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl flex items-center space-x-2">
                <span className="text-xl">🏅</span>
                <span className="font-medium text-[#00209F]">{badge}</span>
              </div>
            ))}
            {(!userData.badges || userData.badges.length === 0) && (
              <p className="text-sm text-gray-500">Ou poko gen badj. Fè devwa pou w genyen!</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
