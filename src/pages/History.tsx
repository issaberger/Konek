import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, orderBy, getDocs, doc, updateDoc, increment, deleteDoc } from 'firebase/firestore';
import { BookOpen, CheckCircle2, Circle, ChevronRight, Trash2, X } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export default function History() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [homeworks, setHomeworks] = useState<any[]>([]);
  const [practiceQuestions, setPracticeQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'homeworks' | 'practice'>('homeworks');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const hwQuery = query(
          collection(db, 'homeworks'),
          where('userId', '==', user.uid),
          orderBy('created_at', 'desc')
        );
        const hwSnapshot = await getDocs(hwQuery);
        setHomeworks(hwSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

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
      try {
        const qRef = doc(db, 'practice_questions', questionId);
        await updateDoc(qRef, { completed: true });
        
        setPracticeQuestions(prev => prev.map(q => 
          q.id === questionId ? { ...q, completed: true } : q
        ));

        const userRef = doc(db, 'users', user!.uid);
        await updateDoc(userRef, { points: increment(20) });
        alert(t('correct'));
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, 'practice_questions');
      }
    } else {
      alert(t('incorrect'));
    }
  };

  const handleDeleteHomework = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'homeworks', id));
      setHomeworks(prev => prev.filter(hw => hw.id !== id));
      setDeleteConfirmId(null);
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, 'homeworks');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f0]">
      <header className="bg-white p-4 shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-serif font-bold text-[#00209F]">{t('history')}</h1>
        
        <div className="flex space-x-4 mt-4">
          <button 
            onClick={() => setActiveTab('homeworks')}
            className={`pb-2 font-medium transition-colors ${activeTab === 'homeworks' ? 'text-[#D21034] border-b-2 border-[#D21034]' : 'text-gray-500'}`}
          >
            {t('homeworks')}
          </button>
          <button 
            onClick={() => setActiveTab('practice')}
            className={`pb-2 font-medium transition-colors ${activeTab === 'practice' ? 'text-[#D21034] border-b-2 border-[#D21034]' : 'text-gray-500'}`}
          >
            {t('exercises')}
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 pb-24">
        {activeTab === 'homeworks' && (
          <div className="space-y-4">
            {homeworks.length === 0 ? (
              <p className="text-center text-gray-500 py-8">{t('noHomeworks')}</p>
            ) : (
              homeworks.map(hw => (
                <div 
                  key={hw.id} 
                  className="bg-white p-4 rounded-2xl shadow-sm space-y-2 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedId(expandedId === hw.id ? null : hw.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <BookOpen className="w-5 h-5 text-[#00209F]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">
                        {hw.created_at?.toDate ? hw.created_at.toDate().toLocaleDateString() : ''}
                      </p>
                      <p className={`font-medium text-gray-900 mt-1 ${expandedId === hw.id ? '' : 'line-clamp-2'}`}>
                        {hw.problem_text}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(hw.id); }}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expandedId === hw.id ? 'rotate-90' : ''}`} />
                    </div>
                  </div>
                  
                  {expandedId === hw.id && hw.solution_text && (
                    <div className="mt-4 pt-4 border-t border-gray-100 prose prose-sm prose-blue max-w-none">
                      <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                        {hw.solution_text}
                      </Markdown>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">{t('delete')}</h3>
                <button onClick={() => setDeleteConfirmId(null)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600">{t('confirmDelete')}</p>
              <div className="flex space-x-3 pt-2">
                <button 
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button 
                  onClick={() => handleDeleteHomework(deleteConfirmId)}
                  className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors"
                >
                  {t('delete')}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'practice' && (
          <div className="space-y-6">
            {practiceQuestions.length === 0 ? (
              <p className="text-center text-gray-500 py-8">{t('noExercises')}</p>
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
