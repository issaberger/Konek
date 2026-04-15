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
  solverTitle: { ht: 'Konèk', fr: 'Konèk' },
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
  
  // About Page
  about: { ht: 'Konsènan Konèk', fr: 'À propos de Konèk' },
  aboutKonek: { ht: 'Konèk se yon asistan devwa entèlijan ki bati pou ede elèv an Ayiti reyisi. Nou kwè nan pouvwa edikasyon ak teknoloji.', fr: 'Konèk est un assistant de devoirs intelligent conçu pour aider les élèves en Haïti à réussir. Nous croyons au pouvoir de l\'éducation et de la technologie.' },
  creator: { ht: 'Kreyatè: Issa Berger', fr: 'Créateur : Issa Berger' },
  learnMore: { ht: 'Aprann Plis', fr: 'En Savoir Plus' },
  contactUs: { ht: 'Kontakte Nou', fr: 'Contactez-nous' },
  
  // Phone Auth
  phoneSignIn: { ht: 'Konekte ak Telefòn', fr: 'Se connecter par téléphone' },
  phoneNumber: { ht: 'Nimewo Telefòn', fr: 'Numéro de téléphone' },
  sendCode: { ht: 'Voye Kòd', fr: 'Envoyer le code' },
  enterCode: { ht: 'Antre Kòd la', fr: 'Entrez le code' },
  verifyCode: { ht: 'Verifye Kòd', fr: 'Vérifier le code' },
  or: { ht: 'OSWA', fr: 'OU' },
  invalidPhone: { ht: 'Nimewo telefòn pa bon', fr: 'Numéro de téléphone invalide' },
  codeSent: { ht: 'Kòd la voye!', fr: 'Code envoyé !' },
  phoneAuthError: { ht: 'Erè: Ou dwe ajoute domèn sa a nan "Authorized domains" nan Firebase Console pou Phone Auth mache.', fr: 'Erreur : Vous devez ajouter ce domaine aux "Authorized domains" dans la console Firebase.' },
  
  // New Features
  uploadPhoto: { ht: 'Voye yon foto', fr: 'Télécharger une photo' },
  typeHomework: { ht: 'Ekri devwa ou a...', fr: 'Tapez vos devoirs...' },
  comingSoon: { ht: 'Karakteristik sa a ap vini byento! 🚀', fr: 'Cette fonctionnalité arrive bientôt ! 🚀' },
  
  // Profile & Settings
  editProfile: { ht: 'Modifye Pwofil', fr: 'Modifier le profil' },
  save: { ht: 'Sove', fr: 'Enregistrer' },
  cancel: { ht: 'Anile', fr: 'Annuler' },
  name: { ht: 'Non', fr: 'Nom' },
  notSet: { ht: 'Poko mete', fr: 'Non défini' },
  changePicture: { ht: 'Chanje Foto', fr: 'Changer la photo' },
  
  // History Delete
  delete: { ht: 'Efase', fr: 'Supprimer' },
  confirmDelete: { ht: 'Èske ou sèten ou vle efase sa?', fr: 'Êtes-vous sûr de vouloir supprimer ceci ?' },
  
  // Terms
  terms: { ht: 'Kondisyon Itilizasyon', fr: 'Conditions d\'utilisation' },
  
  // Welcome Modal
  welcomeTitle: { ht: '🚨 Bloke sou yon devwa?', fr: '🚨 Bloqué sur un devoir ?' },
  welcomeSubtitle: { ht: '100% GRATIS asistan devwa entèlijan bati espesyalman pou ou', fr: 'Assistant de devoirs intelligent 100% GRATUIT conçu spécialement pour vous' },
  howItWorks: { ht: 'Kijan li mache:', fr: 'Comment ça marche :' },
  step1: { ht: '📸 Pran yon foto (oswa voye yon foto ou genyen deja) nan pwoblèm devwa ou a.', fr: '📸 Prenez une photo (ou téléchargez une photo existante) de votre problème de devoir.' },
  step2: { ht: '🤖 Jwenn èd ak eksplikasyon etap pa etap nan yon Kreyòl pafè.', fr: '🤖 Obtenez de l\'aide et des explications étape par étape dans un Créole parfait.' },
  step3: { ht: '✅ Mache pou Matematik, Syans, Istwa, ak plis ankò!', fr: '✅ Fonctionne pour les Mathématiques, les Sciences, l\'Histoire, et plus encore !' },
  noStress: { ht: 'Pa gen kat kredi, pa gen estrès. Jis sipò an tan reyèl, tou dwat sou telefòn ou.', fr: 'Pas de carte de crédit, pas de stress. Juste un support en temps réel, directement sur votre téléphone.' },
  tryNow: { ht: '👉 Eseye li kounye a gratis:', fr: '👉 Essayez-le maintenant gratuitement :' },
  
  // Loading Facts
  loadingFact1: { ht: 'Èske w te konnen? Ayiti te premye repiblik nwa nan mond lan.', fr: 'Le saviez-vous ? Haïti a été la première république noire au monde.' },
  loadingFact2: { ht: 'Konèk ap itilize entèlijans atifisyèl pou ede w konprann devwa w pi byen.', fr: 'Konèk utilise l\'intelligence artificielle pour vous aider à mieux comprendre vos devoirs.' },
  loadingFact3: { ht: 'Edikasyon se kle pou chanje mond lan. Kontinye travay di!', fr: 'L\'éducation est la clé pour changer le monde. Continuez à travailler dur !' },
  loadingFact4: { ht: 'Konèk pale Kreyòl ak Fransè pou l ka ede tout elèv Ayisyen.', fr: 'Konèk parle Créole et Français pour aider tous les élèves Haïtiens.' },
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
