import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { BookOpen, CheckCircle2, Circle, ChevronRight } from 'lucide-react';

export default function History() {
  const { user } = useAuth();
  const [homeworks, setHomeworks] = useState<any[]>([]);
  const [practiceQuestions, setPracticeQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'homeworks' | 'practice'>('homeworks');

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch Homeworks
        const hwQuery = query(
          collection(db, 'homeworks'),
          where('userId', '==', user.uid),
          orderBy('created_at', 'desc')
        );
        const hwSnapshot = await getDocs(hwQuery);
        setHomeworks(hwSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // Fetch Practice Questions
        const pqQuery = query(
          collection(db, 'practice_questions'),
          where('userId', '==', user.uid)
        );
        const pqSnapshot = await getDocs(pqQuery);
        setPracticeQuestions(pqSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleAnswer = async (questionId: string, selectedOption: string, correctAnswer: string) => {
    if (selectedOption === correctAnswer) {
      // Correct answer
      const qRef = doc(db, 'practice_questions', questionId);
      await updateDoc(qRef, { completed: true });
      
      // Update local state
      setPracticeQuestions(prev => prev.map(q => 
        q.id === questionId ? { ...q, completed: true } : q
      ));

      // Add points
      const userRef = doc(db, 'users', user!.uid);
      await updateDoc(userRef, { points: increment(20) });
      alert("Bon travay! Ou jwenn 20 pwen.");
    } else {
      alert("Se pa repons sa a. Eseye ankò!");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Ap chaje...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f0]">
      <header className="bg-white p-4 shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-serif font-bold text-[#FF6321]">Istwa & Revizyon</h1>
        
        <div className="flex space-x-4 mt-4">
          <button 
            onClick={() => setActiveTab('homeworks')}
            className={`pb-2 font-medium transition-colors ${activeTab === 'homeworks' ? 'text-[#FF6321] border-b-2 border-[#FF6321]' : 'text-gray-500'}`}
          >
            Devwa
          </button>
          <button 
            onClick={() => setActiveTab('practice')}
            className={`pb-2 font-medium transition-colors ${activeTab === 'practice' ? 'text-[#FF6321] border-b-2 border-[#FF6321]' : 'text-gray-500'}`}
          >
            Egzèsis
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 pb-24">
        {activeTab === 'homeworks' && (
          <div className="space-y-4">
            {homeworks.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Ou poko fè okenn devwa.</p>
            ) : (
              homeworks.map(hw => (
                <div key={hw.id} className="bg-white p-4 rounded-2xl shadow-sm space-y-2">
                  <div className="flex items-start space-x-3">
                    <div className="bg-orange-50 p-2 rounded-lg">
                      <BookOpen className="w-5 h-5 text-[#FF6321]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">
                        {hw.created_at?.toDate ? hw.created_at.toDate().toLocaleDateString('ht-HT') : 'Jodi a'}
                      </p>
                      <p className="font-medium text-gray-900 line-clamp-2 mt-1">{hw.problem_text}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'practice' && (
          <div className="space-y-6">
            {practiceQuestions.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Ou poko gen egzèsis.</p>
            ) : (
              practiceQuestions.map(pq => (
                <div key={pq.id} className={`bg-white p-5 rounded-2xl shadow-sm border-2 ${pq.completed ? 'border-green-100' : 'border-transparent'}`}>
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-medium text-gray-900">{pq.question}</h3>
                    {pq.completed && <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 ml-2" />}
                  </div>
                  
                  <div className="space-y-2">
                    {pq.options.map((option: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => !pq.completed && handleAnswer(pq.id, option, pq.correct_answer)}
                        disabled={pq.completed}
                        className={`w-full text-left p-3 rounded-xl border transition-colors flex items-center space-x-3
                          ${pq.completed && option === pq.correct_answer ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}
                        `}
                      >
                        {pq.completed && option === pq.correct_answer ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                        <span>{option}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
