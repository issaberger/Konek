import { useState, useRef } from 'react';
import { Camera, Upload, Mic, MicOff, Volume2, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { solveHomework, generateSpeech } from '../services/ai';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, doc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import Markdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export default function Solver() {
  const { user, refreshUserData } = useAuth();
  const { t, language } = useLanguage();
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [voicePrompt, setVoicePrompt] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [result, setResult] = useState<{ problemText: string; solutionText: string } | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = language === 'ht' ? 'ht-HT' : 'fr-FR'; 
        recognition.onresult = (event: any) => {
          setVoicePrompt(event.results[0][0].transcript);
          setIsRecording(false);
        };
        recognition.onerror = () => setIsRecording(false);
        recognition.start();
      } else {
        alert(t('browserNotSupported'));
        setIsRecording(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (!image || !user) return;
    
    setIsSolving(true);
    try {
      const { problemText, solutionText, practiceQuestion } = await solveHomework(image, voicePrompt, language);
      
      setResult({ problemText, solutionText });

      let homeworkRef;
      try {
        homeworkRef = await addDoc(collection(db, 'homeworks'), {
          userId: user.uid,
          problem_text: problemText,
          solution_text: solutionText,
          created_at: serverTimestamp()
        });
      } catch (e) {
        handleFirestoreError(e, OperationType.CREATE, 'homeworks');
        throw e;
      }

      if (practiceQuestion && practiceQuestion.question) {
        try {
          await addDoc(collection(db, 'practice_questions'), {
            userId: user.uid,
            homeworkId: homeworkRef.id,
            ...practiceQuestion,
            completed: false
          });
        } catch (e) {
          handleFirestoreError(e, OperationType.CREATE, 'practice_questions');
          throw e;
        }
      }

      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          points: increment(50),
          homework_solved: increment(1),
          last_active: new Date().toISOString()
        });
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, 'users');
        throw e;
      }

      await refreshUserData();

    } catch (error: any) {
      console.error("Error solving homework:", error);
      alert(`${t('errorOccurred')}: ${error.message || t('unknownError')}`);
    } finally {
      setIsSolving(false);
    }
  };

  const playAudio = async () => {
    if (!result) return;
    
    if (isPlayingAudio && audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    try {
      const cleanText = result.solutionText.replace(/[#*`]/g, '');
      const base64Audio = await generateSpeech(cleanText, language);
      
      if (base64Audio) {
        const audioUrl = `data:audio/wav;base64,${base64Audio}`;
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        audio.onended = () => setIsPlayingAudio(false);
        audio.play();
      } else {
        setIsPlayingAudio(false);
      }
    } catch (error) {
      console.error(error);
      setIsPlayingAudio(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f0]">
      <header className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#00209F]">{t('solverTitle')}</h1>
          <p className="text-sm text-gray-500">{t('takePicture')}</p>
        </div>
      </header>

      <main className="flex-1 p-4 space-y-6 pb-24">
        {!result ? (
          <div className="space-y-6">
            <div className="relative aspect-[3/4] w-full bg-gray-100 rounded-3xl overflow-hidden shadow-inner border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Devwa" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6 space-y-4">
                  <div className="bg-white p-4 rounded-full inline-block shadow-sm">
                    <Camera className="w-10 h-10 text-[#D21034]" />
                  </div>
                  <p className="text-gray-600 font-medium">{t('clickToTakePic')}</p>
                </div>
              )}
              
              <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                onChange={handleImageCapture}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            {imagePreview && (
              <div className="bg-white p-4 rounded-2xl shadow-sm space-y-3">
                <label className="text-sm font-medium text-gray-700">{t('askQuestion')}</label>
                <div className="flex items-center space-x-2">
                  <input 
                    type="text"
                    value={voicePrompt}
                    onChange={(e) => setVoicePrompt(e.target.value)}
                    placeholder={t('typeOrSpeak')}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00209F]/50"
                  />
                  <button 
                    onClick={toggleRecording}
                    className={`p-3 rounded-xl transition-colors ${isRecording ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {isRecording ? <MicOff className="w-6 h-6 animate-pulse" /> : <Mic className="w-6 h-6" />}
                  </button>
                </div>
              </div>
            )}

            {imagePreview && (
              <button 
                onClick={handleSubmit}
                disabled={isSolving}
                className="w-full bg-[#D21034] text-white font-bold text-lg py-4 rounded-2xl shadow-lg hover:bg-[#b00d2b] transition-colors disabled:opacity-70 flex items-center justify-center space-x-2"
              >
                {isSolving ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>{t('thinking')}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-6 h-6" />
                    <span>{t('solveHomework')}</span>
                  </>
                )}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-gray-900">{t('explanation')}</h2>
                <button 
                  onClick={playAudio}
                  className={`p-3 rounded-full transition-colors ${isPlayingAudio ? 'bg-[#00209F] text-white shadow-md' : 'bg-blue-50 text-[#00209F]'}`}
                >
                  <Volume2 className="w-6 h-6" />
                </button>
              </div>
              
              <div className="prose prose-blue max-w-none">
                <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {result.solutionText}
                </Markdown>
              </div>
            </div>

            <button 
              onClick={() => {
                setImage(null);
                setImagePreview(null);
                setResult(null);
                setVoicePrompt('');
              }}
              className="w-full bg-white text-gray-700 font-bold text-lg py-4 rounded-2xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              {t('anotherHomework')}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
