import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ht' | 'fr';

interface Translations {
  [key: string]: {
    ht: string;
    fr: string;
  };
}

export const translations: Translations = {
  appName: { ht: 'Konèk', fr: 'Konèk' },
  tagline: { ht: 'Asistan devwa entèlijan ou an Kreyòl.', fr: 'Votre assistant de devoirs intelligent.' },
  loginWithGoogle: { ht: 'Konekte ak Google', fr: 'Se connecter avec Google' },
  startLearning: { ht: 'Kòmanse aprann pi vit jodi a!', fr: 'Commencez à apprendre plus vite aujourd\'hui !' },
  solverTitle: { ht: 'Konèk Solver', fr: 'Konèk Solver' },
  takePicture: { ht: 'Pran yon foto devwa ou a', fr: 'Prenez une photo de vos devoirs' },
  clickToTakePic: { ht: 'Klike la pou w pran foto devwa a', fr: 'Cliquez ici pour prendre une photo' },
  askQuestion: { ht: 'Ou gen yon kesyon espesifik? (Si ou vle)', fr: 'Avez-vous une question spécifique ? (Optionnel)' },
  typeOrSpeak: { ht: 'Ekri oswa pale kesyon ou an...', fr: 'Écrivez ou posez votre question...' },
  solveHomework: { ht: 'Rezoud Devwa a', fr: 'Résoudre le devoir' },
  thinking: { ht: 'Konèk ap reflechi...', fr: 'Konèk réfléchit...' },
  explanation: { ht: 'Eksplikasyon', fr: 'Explication' },
  anotherHomework: { ht: 'Fè yon lòt devwa', fr: 'Faire un autre devoir' },
  history: { ht: 'Istorik', fr: 'Historique' },
  homeworks: { ht: 'Devwa', fr: 'Devoirs' },
  exercises: { ht: 'Egzèsis', fr: 'Exercices' },
  noHomeworks: { ht: 'Ou poko fè okenn devwa.', fr: 'Vous n\'avez pas encore fait de devoirs.' },
  noExercises: { ht: 'Ou poko gen egzèsis.', fr: 'Vous n\'avez pas encore d\'exercices.' },
  checkAnswer: { ht: 'Verifye repons lan', fr: 'Vérifier la réponse' },
  correct: { ht: 'Bon travay! Ou jwenn li.', fr: 'Bon travail ! Vous avez trouvé.' },
  incorrect: { ht: 'Se pa sa non. Eseye ankò!', fr: 'Ce n\'est pas ça. Essayez encore !' },
  profile: { ht: 'Pwofil', fr: 'Profil' },
  points: { ht: 'Pwen', fr: 'Points' },
  streak: { ht: 'Jou', fr: 'Jours' },
  badges: { ht: 'Badj ou yo', fr: 'Vos badges' },
  logout: { ht: 'Dekonekte', fr: 'Se déconnecter' },
  leaderboard: { ht: 'Klasman', fr: 'Classement' },
  topStudents: { ht: 'Pi bon elèv yo', fr: 'Les meilleurs élèves' },
  navSolver: { ht: 'Devwa', fr: 'Devoirs' },
  navHistory: { ht: 'Istorik', fr: 'Historique' },
  navLeaderboard: { ht: 'Klasman', fr: 'Classement' },
  navProfile: { ht: 'Pwofil', fr: 'Profil' },
  browserNotSupported: { ht: 'Navigatè ou a pa sipòte vwa. Tanpri ekri kesyon ou an.', fr: 'Votre navigateur ne supporte pas la voix. Veuillez écrire votre question.' },
  errorOccurred: { ht: 'Eskize m, gen yon pwoblèm', fr: 'Désolé, il y a un problème' },
  unknownError: { ht: 'Erè enkoni', fr: 'Erreur inconnue' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'ht',
  setLanguage: () => {},
  t: () => '',
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('ht');

  useEffect(() => {
    const savedLang = localStorage.getItem('konek_language') as Language;
    if (savedLang && (savedLang === 'ht' || savedLang === 'fr')) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('konek_language', lang);
  };

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
