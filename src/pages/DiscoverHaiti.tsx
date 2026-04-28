import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Info, Heart, Share2, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const HAITI_FACTS = [
  { id: 1, textHT: "Ayiti te premye peyi nan mond lan ki te entèdi esklavaj yon fason pèmanan nan konstitisyon li an 1804.", textFR: "Haïti a été le premier pays au monde à interdire l'esclavage de manière permanente dans sa constitution en 1804.", category: "Istwa / Histoire", icon: "🇭🇹", bg: "from-blue-600 to-red-600" },
  { id: 2, textHT: "Sitadèl Laferyè se pi gwo fò nan Emisfè Lwès la. Yo te fè l pou pwoteje peyi a kont Lafrans.", textFR: "La Citadelle Laferrière est la plus grande forteresse de l'hémisphère occidental, construite pour défendre le pays contre la France.", category: "Achitekti / Architecture", icon: "🏰", bg: "from-emerald-600 to-teal-800" },
  { id: 3, textHT: "Kreyòl Ayisyen se youn nan lang kreyòl ki gen plis moun ki pale l nan mond lan, avèk plis pase 12 milyon moun.", textFR: "Le créole haïtien est l'une des langues créoles les plus parlées au monde, avec plus de 12 millions de locuteurs.", category: "Lang / Langue", icon: "🗣️", bg: "from-amber-500 to-orange-700" },
  { id: 4, textHT: "Kav Womàn (Grotte Marie-Jeanne) nan Pòtapiman se youn nan pi gwo grot nan Karayib la, ki gen anviwon 56 chanm.", textFR: "La grotte Marie-Jeanne à Port-à-Piment est l'une des plus grandes grottes des Caraïbes, avec environ 56 chambres.", category: "Nati / Nature", icon: "⛰️", bg: "from-slate-600 to-slate-900" },
  { id: 5, textHT: "Sou 1e Janvye, Ayisyen toujou bwè Soup Joumou pou selebre endepandans ak libète, paske lontan esklav yo pa t gen dwa bwè l.", textFR: "Le 1er janvier, les Haïtiens boivent toujours la Soupe Joumou pour célébrer l'indépendance, car les esclaves n'y avaient pas droit.", category: "Kilti / Culture", icon: "🥣", bg: "from-orange-500 to-yellow-600" },
  { id: 6, textHT: "Ayiti te ede Etazini pandan lagè endepandans pa yo a nan Batay Savannah (1779) avèk 'Chasseurs-Volontaires de Saint-Domingue'.", textFR: "Haïti a aidé les États-Unis pendant leur guerre d'indépendance à la bataille de Savannah (1779) avec les Chasseurs-Volontaires.", category: "Istwa / Histoire", icon: "⚔️", bg: "from-red-600 to-red-900" },
  { id: 7, textHT: "Peyi a gen yon gwo resif koray ki rich anpil e anpil plaj ki gen sab blan, sitou sou kòt Sid ak nan Nò.", textFR: "Le pays possède de riches récifs coralliens et de nombreuses plages de sable blanc, particulièrement sur les côtes Sud et Nord.", category: "Nati / Nature", icon: "🌊", bg: "from-cyan-500 to-blue-700" },
  { id: 8, textHT: "Se Ayiti ki sèl peyi souveren kote relijyon Vodou rekonèt fòmèlman kòm yon relijyon nasyonal (depi 2003).", textFR: "Haïti est le seul pays souverain où la religion vaudou est formellement reconnue comme religion nationale (depuis 2003).", category: "Relijyon / Religion", icon: "🥁", bg: "from-purple-600 to-indigo-900" },
  { id: 9, textHT: "Endepandans Ayiti te fè anpil gwo pwisans pè (tankou Etazini, Lafrans) e yo pa t vle rekonèt Ayiti pandan plizyè dizèn lane.", textFR: "L'indépendance d'Haïti a terrifié de grandes puissances qui ont refusé de la reconnaître pendant des décennies.", category: "Politik / Politique", icon: "📜", bg: "from-gray-700 to-gray-900" },
  { id: 10, textHT: "Non Ayiti a soti nan lang natif natal Taino a 'Ayiti', ki vle di 'Tè ki gen anpil mòn'.", textFR: "Le nom Haïti vient de la langue amérindienne Taïno 'Ayiti', qui signifie 'Terre des hautes montagnes'.", category: "Orijin / Origine", icon: "🏔️", bg: "from-green-600 to-emerald-800" },
  { id: 11, textHT: "Gwo atis entènasyonal Jean-Michel Basquiat te gen yon papa ki fèt Ayiti.", textFR: "Le père du grand artiste international Jean-Michel Basquiat était né en Haïti.", category: "Atizay / Art", icon: "🎨", bg: "from-pink-500 to-rose-700" },
  { id: 12, textHT: "Hibiscus la, ki rele tou 'Choublak' nan Kreyòl, se yon flè trè popilè nan peyi a. Men yo konsidere Palmis la kòm senbòl nasyonal prensipalman.", textFR: "La fleur d'Hibiscus (Choublak) y est très populaire, bien que le Palmiste soit le symbole national principal.", category: "Senbòl / Symbole", icon: "🌺", bg: "from-fuchsia-600 to-purple-800" },
  { id: 13, textHT: "Se an Ayiti yo jwenn pi gwo divèsite espès krapo nan Karayib la, anpil ladan yo se andemik (yo pa jwenn yo okenn lòt kote).", textFR: "Haïti possède la plus grande diversité d'espèces de grenouilles des Caraïbes, dont beaucoup sont endémiques.", category: "Biyodivèsite / Biodiversité", icon: "🐸", bg: "from-lime-600 to-green-900" },
  { id: 14, textHT: "Palè Sans-Souci nan Milot te konn rele 'Vèsay Karayib la', avèk bèl jaden ak sistèm dlo etonan pou epòk li.", textFR: "Le Palais Sans-Souci à Milot était surnommé le 'Versailles des Caraïbes', avec de magnifiques jardins de son époque.", category: "Achitekti / Architecture", icon: "🏛️", bg: "from-blue-500 to-indigo-800" },
  { id: 15, textHT: "Sanite Belair ak Catherine Flon se pami anpil fanm vanyan ki te jwe wòl kle nan Revolisyon Ayisyen an.", textFR: "Sanite Belair et Catherine Flon comptent parmi les nombreuses héroïnes de la Révolution haïtienne.", category: "Ewo / Héros", icon: "👑", bg: "from-pink-600 to-red-800" },
  { id: 16, textHT: "Ayiti te ede peyi tankou Venezyela jwenn endepandans yo e Simon Bolivar te jwenn refij, lajan, ak zam bò kote Prezidan Petion.", textFR: "Haïti a aidé des pays comme le Venezuela, et Simon Bolivar a reçu refuge, fonds et armes du président Pétion.", category: "Istwa / Histoire", icon: "🤝", bg: "from-orange-500 to-red-700" },
  { id: 17, textHT: "Nan Kilti Ayisyèn, ra-ra se yon fèstival mizik ki fèt nan peryòd Karèm nan, li gen gwo rasin nan relijyon ak kanaval.", textFR: "Dans la culture haïtienne, le rara est une musique de festival célébrée pendant le Carême, enracinée dans la religion.", category: "Mizik / Musique", icon: "🎺", bg: "from-yellow-500 to-amber-700" },
  { id: 18, textHT: "Bèl plaj Jele (Gelée) nan Okay, se kote yo òganize gwo festival mizik ak fèt vyann griye ki rele fèt Notre Dame.", textFR: "La belle plage de Gelée aux Cayes accueille de grands festivals de musique et la fête de Notre-Dame.", category: "Nati / Nature", icon: "🌴", bg: "from-teal-500 to-cyan-800" },
  { id: 19, textHT: "Nan vil Jakmèl, achitekti kolonyal ak fèt Kanaval ak papye mache te enspire Moun Nouvèl Òleyan pou Achitekti pa yo.", textFR: "À Jacmel, l'architecture coloniale aurait inspiré celle de la Nouvelle-Orléans et le carnaval aux masques géants y est fou.", category: "Achitekti / Architecture", icon: "🎭", bg: "from-purple-500 to-violet-800" },
  { id: 20, textHT: "Chak 12 Janvye, yo komemore tranbleman tè 2010 la ki te montre kouraj ak fòs pèp Ayisyen nan fè fas ak advèsite.", textFR: "Le 12 janvier marque la commémoration du tremblement de terre de 2010, illustrant la résilience du peuple haïtien.", category: "Kouraj / Courage", icon: "🕯️", bg: "from-slate-700 to-black" }
];

export default function DiscoverHaiti() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const [actIdx, setActIdx] = useState(0);
  const [shuffledFacts, setShuffledFacts] = useState([...HAITI_FACTS]);

  useEffect(() => {
    // Shuffle facts on mount to give a unique experience
    const facts = [...HAITI_FACTS].sort(() => Math.random() - 0.5);
    setShuffledFacts(facts);
  }, []);

  const handleNext = () => {
    setActIdx((prev) => (prev + 1) % shuffledFacts.length);
  };

  const currentFact = shuffledFacts[actIdx];

  const shareFact = () => {
    if (navigator.share) {
      navigator.share({
        title: language === 'fr' ? 'Le saviez-vous ?' : 'Èske w te konnen?',
        text: currentFact[language === 'fr' ? 'textFR' : 'textHT'],
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert("Sharing is not supported on this device.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 overflow-hidden font-sans relative flex flex-col">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFact.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className={`absolute inset-0 bg-gradient-to-br ${currentFact.bg} opacity-40`}
          />
        </AnimatePresence>
        <div className="absolute inset-0 backdrop-blur-[100px]"></div>
      </div>

      {/* Header */}
      <header className="pt-8 p-4 relative z-20 flex items-center justify-between">
        <button 
          onClick={() => navigate('/solver')}
          className="p-3 text-white bg-black/20 hover:bg-black/40 backdrop-blur-md transition-colors rounded-full"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-black text-white px-4 py-2 bg-black/20 backdrop-blur-md rounded-full border border-white/10">
          {language === 'fr' ? 'Découvrir Haïti 🇭🇹' : 'Dekouvri Ayiti 🇭🇹'}
        </h1>
        <div className="w-12"></div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center p-6 w-full max-w-md mx-auto">
        <div className="w-full relative h-[60vh] perspective-[1000px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFact.id}
              initial={{ opacity: 0, rotateY: 30, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, rotateY: 0, x: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: -30, x: -100, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.x < -50 || offset.x > 50) {
                  handleNext();
                }
              }}
              className="absolute inset-0 w-full h-full"
            >
              <div className="w-full h-full bg-white/10 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 flex flex-col overflow-hidden relative">
                
                {/* Decorative Icon */}
                <div className="absolute -top-10 -right-10 text-[10rem] opacity-10 rotate-12 pointer-events-none select-none">
                  {currentFact.icon}
                </div>

                <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/10 w-fit mb-8">
                   <MapPin className="w-4 h-4 text-amber-300" />
                   <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">{currentFact.category}</span>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <div className="text-7xl mb-6">{currentFact.icon}</div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white leading-relaxed drop-shadow-md">
                    {language === 'fr' ? currentFact.textFR : currentFact.textHT}
                  </h2>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <span className="text-white/40 font-bold text-sm">
                    {actIdx + 1} / {shuffledFacts.length}
                  </span>
                  
                  <button 
                    onClick={shareFact}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <Share2 className="w-5 h-5 text-white" />
                  </button>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="mt-8 w-full bg-white text-slate-900 font-black text-xl py-5 rounded-[2rem] shadow-[0_8px_30px_rgba(255,255,255,0.2)] hover:bg-gray-100 transition-all flex items-center justify-center space-x-2"
        >
          <span>{language === 'fr' ? 'Fait Suivant' : 'Pwochen'}</span>
        </motion.button>
        
        <p className="mt-6 text-white/50 text-sm font-medium text-center">
           {language === 'fr' ? 'Glissez pour le suivant' : 'Glise pou w wè lòt'}
        </p>
      </main>

    </div>
  );
}
