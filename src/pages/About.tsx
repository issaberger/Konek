import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, ExternalLink, Mail, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f0]">
      <header className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center space-x-4">
        <Link to="/" className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-6 h-6 text-[#00209F]" />
        </Link>
        <h1 className="text-2xl font-serif font-bold text-[#00209F]">{t('about')}</h1>
      </header>

      <main className="flex-1 p-6 space-y-8 pb-24">
        <div className="bg-white p-8 rounded-3xl shadow-sm text-center space-y-6 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D21034] opacity-5 rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#00209F] opacity-5 rounded-tr-full"></div>
          
          <div className="relative z-10 space-y-4">
            <div className="w-20 h-20 bg-[#00209F] rounded-full mx-auto flex items-center justify-center shadow-lg">
              <span className="text-4xl font-serif font-bold text-white">K</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Konèk</h2>
            <p className="text-lg text-gray-600 leading-relaxed font-medium">
              {t('aboutKonek')}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm space-y-6">
          <div className="flex items-center space-x-3 text-[#D21034]">
            <Heart className="w-6 h-6 fill-current" />
            <h3 className="text-xl font-bold text-gray-900">{t('creator')}</h3>
          </div>
          
          <div className="space-y-4">
            <a 
              href="https://issaberger.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-4 rounded-2xl transition-colors group"
            >
              <span className="font-bold text-[#00209F]">{t('learnMore')}</span>
              <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-[#00209F] transition-colors" />
            </a>
            
            <a 
              href="mailto:tech@issaberger.com" 
              className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-4 rounded-2xl transition-colors group"
            >
              <span className="font-bold text-[#00209F]">{t('contactUs')}</span>
              <Mail className="w-5 h-5 text-gray-400 group-hover:text-[#00209F] transition-colors" />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
