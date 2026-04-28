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
  correct: { ht: 'Bon travay! Ou jwenn repons lan.', fr: 'Bon travail ! Vous avez trouvé.' },
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
  changePicture: { ht: 'Chanje Foto', fr: 'Modifier la photo' },
  deleteAccount: { ht: 'Efase Kont', fr: 'Supprimer le compte' },
  confirmDeleteAccount: { ht: 'Èske ou sèten ou vle efase kont ou a? Sa pa ka anile.', fr: 'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.' },
  
  // AI Notice
  aiNotice: { ht: 'Remak: Konèk itilize entèlijans atifisyèl. Pafwa repons yo ka pa 100% kòrèk. Toujou verifye travay ou!', fr: 'Note : Konèk utilise l\'intelligence artificielle. Parfois, les réponses peuvent ne pas être 100% correctes. Vérifiez toujours votre travail !' },
  resources: { ht: 'Resous ak Referans', fr: 'Ressources et Références' },
  
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
  loadingFact1: { ht: '🇭🇹 Ayiti te premye repiblik nwa nan mond lan an 1804.', fr: '🇭🇹 Haïti a été la première république noire au monde en 1804.' },
  loadingFact2: { ht: '🧠 Konèk ap itilize entèlijans atifisyèl pou analize foto w la kounye a.', fr: '🧠 Konèk utilise l\'intelligence artificielle pour analyser votre photo en ce moment.' },
  loadingFact3: { ht: '📚 Edikasyon se sèl zam ou bezwen pou chanje avni w.', fr: '📚 L\'éducation est la seule arme dont vous avez besoin pour changer votre avenir.' },
  loadingFact4: { ht: '🗣️ Konèk pale Kreyòl ak Fransè pou l ka ede tout elèv Ayisyen.', fr: 'Konèk parle Créole et Français pour aider tous les élèves Haïtiens.' },
  loadingFact5: { ht: '🌟 Ou se yon jeni! Kontinye poze kesyon pou w ka aprann plis.', fr: '🌟 Vous êtes un génie ! Continuez à poser des questions pour apprendre plus.' },
  loadingFact6: { ht: '🎨 Sitadèl Laferyè se pi gwo fò nan tout Karayib la.', fr: '🎨 La Citadelle Laferrière est la plus grande forteresse des Caraïbes.' },
  loadingFact7: { ht: '⚡ Konèk ap prepare yon eksplikasyon etap pa etap pou ou.', fr: '⚡ Konèk prépare une explication étape par étape pour vous.' },
  loadingFact8: { ht: '🌊 Ayiti vle di "Tè mòn yo" nan lang moun Taino yo.', fr: '🌊 Haïti signifie "Terre des montagnes" dans la langue des Taïnos.' },
  loadingFact9: { ht: '🚀 Chak devwa ou rezoud ap fè w vin pi entèlijan chak jou.', fr: '🚀 Chaque devoir que vous résolvez vous rend plus intelligent chaque jour.' },
  
  // Onboarding
  welcomeHeadline: { ht: 'Pare pou w briye? 🚀', fr: 'Prêt à briller ? 🚀' },
  welcomeSub: { ht: 'Konèk se asistan entèlijan w ki la pou l ede w kraze tout devwa w yo. Ann kreye pwofil chanpyon ou an!', fr: 'Konèk est votre assistant intelligent. Créons votre profil de champion !' },
  startOnboarding: { ht: 'Kòmanse', fr: 'Commencer' },
  stepNameTitle: { ht: 'Ki jan w rele, chanpyon? 🏆', fr: 'Comment t\'appelles-tu, champion ? 🏆' },
  placeholderName: { ht: 'Antre non w ou byen ti non jwèt ou...', fr: 'Entrez votre pseudo...' },
  stepAgeClassTitle: { ht: 'Ki klas ou ye kounye a? 🎯', fr: 'Quelle est ta classe actuelle ? 🎯' },
  age: { ht: 'Laj ou', fr: 'Votre Âge' },
  gradeLabel: { ht: 'Nan ki klas ou ye? (Egzanp: NS3, Philo...)', fr: 'Votre Classe (Ex: NS3, Terminale...)' },
  stepSchoolTitle: { ht: 'Nan ki akademi w ap fòme lespri w? 🏫', fr: 'Dans quelle académie étudies-tu ? 🏫' },
  schoolName: { ht: 'Ekri non lekòl ou a...', fr: 'Écris le nom de ton école...' },
  finishBtn: { ht: 'Sove Pwofil Mwen! 🌟', fr: 'Sauvegarder ! 🌟' },
  nextBtn: { ht: 'Kontinye', fr: 'Continuer' },
  backBtn: { ht: 'Tounen', fr: 'Retour' },
  greeting: { ht: 'Bonjou', fr: 'Bonjour' },
  resetProfile: { ht: 'Chanje Pwofil', fr: 'Modifier le profil' },
  level: { ht: 'ETAP', fr: 'ÉTAPE' },
  
  // Profile Additions
  confirmDeleteAccount: { ht: 'Èske w sèten w vle efase pwofil ou a? Tout done w yo ap pèdi.', fr: 'Êtes-vous sûr de vouloir supprimer votre profil ? Toutes vos données seront perdues.' },
  deleteAccount: { ht: 'Efase Pwofil la', fr: 'Supprimer le profil' },
  editProfile: { ht: 'Chanje', fr: 'Modifier' },
  save: { ht: 'Sove', fr: 'Enregistrer' },
  cancel: { ht: 'Anile', fr: 'Annuler' },
  name: { ht: 'Non', fr: 'Nom' },
  chooseAvatar: { ht: 'Chwazi yon Avatar', fr: 'Choisir un avatar' },
  editAvatar: { ht: 'Chanje Avatar', fr: 'Modifier l\'avatar' },
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
