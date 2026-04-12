import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Terms() {
  const { language } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f0]">
      <header className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center space-x-4">
        <Link to="/" className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold text-[#00209F]">
          {language === 'ht' ? 'Kondisyon Itilizasyon' : 'Conditions d\'utilisation'}
        </h1>
      </header>

      <main className="flex-1 p-6 max-w-2xl mx-auto w-full space-y-6 pb-24">
        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4 text-gray-700">
          {language === 'ht' ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900">Kondisyon Itilizasyon Konèk</h2>
              <p>Dènye mizajou: {new Date().toLocaleDateString()}</p>
              
              <h3 className="text-lg font-bold text-gray-900 mt-6">1. Akseptasyon</h3>
              <p>Lè w sèvi ak Konèk, ou aksepte kondisyon sa yo. Konèk se yon zouti gratis ki fèt pou ede elèv yo aprann, pa pou fè devwa yo nan plas yo.</p>

              <h3 className="text-lg font-bold text-gray-900 mt-6">2. Itilizasyon Sèvis la</h3>
              <p>Ou dakò pou w pa sèvi ak Konèk pou okenn aktivite ilegal oswa pou triche nan egzamen ofisyèl yo. Konèk itilize entèlijans atifisyèl, kidonk repons yo ka pa toujou 100% kòrèk. Toujou verifye enfòmasyon yo.</p>

              <h3 className="text-lg font-bold text-gray-900 mt-6">3. Done Pèsonèl ak Vi Prive</h3>
              <p>Nou pwoteje done ou yo. Nou sèlman sove enfòmasyon ki nesesè pou aplikasyon an mache (tankou istorik devwa ou yo ak pwen ou fè). Nou pa vann done ou bay lòt konpayi.</p>

              <h3 className="text-lg font-bold text-gray-900 mt-6">4. Pwopriyete Entelektyèl</h3>
              <p>Tout sa ki nan aplikasyon an (logo, konsepsyon, kòd) se pwopriyete Konèk ak kreyatè li, Issa Berger.</p>

              <h3 className="text-lg font-bold text-gray-900 mt-6">5. Chanjman nan Kondisyon yo</h3>
              <p>Nou ka chanje kondisyon sa yo nenpòt lè. N ap fè w konnen si gen gwo chanjman.</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900">Conditions d'utilisation de Konèk</h2>
              <p>Dernière mise à jour : {new Date().toLocaleDateString()}</p>
              
              <h3 className="text-lg font-bold text-gray-900 mt-6">1. Acceptation</h3>
              <p>En utilisant Konèk, vous acceptez ces conditions. Konèk est un outil gratuit conçu pour aider les élèves à apprendre, et non pour faire leurs devoirs à leur place.</p>

              <h3 className="text-lg font-bold text-gray-900 mt-6">2. Utilisation du service</h3>
              <p>Vous acceptez de ne pas utiliser Konèk pour des activités illégales ou pour tricher lors d'examens officiels. Konèk utilise l'intelligence artificielle, les réponses peuvent donc ne pas toujours être 100% correctes. Vérifiez toujours les informations.</p>

              <h3 className="text-lg font-bold text-gray-900 mt-6">3. Données personnelles et confidentialité</h3>
              <p>Nous protégeons vos données. Nous ne sauvegardons que les informations nécessaires au fonctionnement de l'application (comme l'historique de vos devoirs et vos points). Nous ne vendons pas vos données à d'autres entreprises.</p>

              <h3 className="text-lg font-bold text-gray-900 mt-6">4. Propriété intellectuelle</h3>
              <p>Tout le contenu de l'application (logo, design, code) est la propriété de Konèk et de son créateur, Issa Berger.</p>

              <h3 className="text-lg font-bold text-gray-900 mt-6">5. Modifications des conditions</h3>
              <p>Nous pouvons modifier ces conditions à tout moment. Nous vous informerons en cas de changements importants.</p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
