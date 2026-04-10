import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Trophy, Medal } from 'lucide-react';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const q = query(
          collection(db, 'users'),
          orderBy('points', 'desc'),
          limit(10)
        );
        const snapshot = await getDocs(q);
        setLeaders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaders();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f0]">
      <header className="bg-white p-4 shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-serif font-bold text-[#FF6321]">Klasman Global</h1>
        <p className="text-sm text-gray-500">Top 10 elèv ki pi aktif</p>
      </header>

      <main className="flex-1 p-4 space-y-4 pb-24">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Ap chaje...</div>
        ) : (
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
            {leaders.map((leader, index) => (
              <div 
                key={leader.id} 
                className={`flex items-center p-4 border-b border-gray-100 last:border-0 ${index < 3 ? 'bg-orange-50/50' : ''}`}
              >
                <div className="w-8 font-bold text-gray-400 flex justify-center">
                  {index === 0 ? <Trophy className="w-6 h-6 text-yellow-500" /> : 
                   index === 1 ? <Medal className="w-6 h-6 text-gray-400" /> : 
                   index === 2 ? <Medal className="w-6 h-6 text-amber-600" /> : 
                   `#${index + 1}`}
                </div>
                
                <div className="ml-4 flex-1">
                  <p className="font-bold text-gray-900">{leader.displayName}</p>
                  <p className="text-xs text-gray-500">{leader.grade_level}</p>
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-[#FF6321]">{leader.points}</p>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Pwen</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
