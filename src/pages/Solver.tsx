import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Mic, MicOff, Volume2, Loader2, CheckCircle2, X, AlertTriangle, UserCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { solveHomework, generateSpeech } from '../services/ai';
import Markdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export default function Solver() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  
  useEffect(() => {
    const profileStr = localStorage.getItem('konek_user_profile');
    if (profileStr) {
      try {
        const data = JSON.parse(profileStr);
        setUserName(data.name || '');
      } catch(e) {}
    }
  }, []);

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [voicePrompt, setVoicePrompt] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [loadingFactIndex, setLoadingFactIndex] = useState(0);
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
        // Use both languages for better detection if possible, or stick to current
        recognition.lang = language === 'ht' ? 'ht-HT' : 'fr-FR'; 
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result: any) => result.transcript)
            .join('');
          setVoicePrompt(transcript);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
        };

        recognition.start();
      } else {
        alert(t('browserNotSupported'));
        setIsRecording(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (!image) return;
    
    setIsSolving(true);
    const factInterval = setInterval(() => {
      setLoadingFactIndex(prev => (prev + 1) % 9);
    }, 3500);

    try {
      const { problemText, solutionText } = await solveHomework(image, voicePrompt, language);
      
      setResult({ problemText, solutionText });

    } catch (error: any) {
      console.error("Error solving homework:", error);
      alert(`${t('errorOccurred')}: ${error.message || t('unknownError')}`);
    } finally {
      clearInterval(factInterval);
      setIsSolving(false);
    }
  };

  const playAudio = async () => {
    if (!result) return;
    
    if (isPlayingAudio) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      window.speechSynthesis.cancel();
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
        // Fallback to browser TTS if Gemini fails
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = language === 'ht' ? 'ht-HT' : 'fr-FR';
        utterance.onend = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
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
          <p className="text-sm text-gray-500">
            {userName ? <><span className="font-bold text-gray-800">{t('greeting')}, {userName}!</span> <br/></> : ''}
            {t('takePicture')}
          </p>
        </div>
        <button 
          onClick={() => {
            navigate('/profile');
          }}
          className="p-2 text-gray-400 hover:text-[#D21034] transition-colors rounded-full hover:bg-red-50"
          title={t('profile')}
        >
          <UserCircle className="w-8 h-8" />
        </button>
      </header>

      <main className="flex-1 p-4 space-y-6 pb-24">
        {!result ? (
          <div className="space-y-6">
            {!imagePreview ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {/* Camera Button */}
                  <div className="relative bg-white p-6 rounded-3xl shadow-sm border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors aspect-square">
                    <Camera className="w-10 h-10 text-[#D21034] mb-3" />
                    <p className="text-gray-600 font-medium text-center text-sm">{t('takePicture')}</p>
                    <input 
                      type="file" 
                      accept="image/*" 
                      capture="environment"
                      onChange={handleImageCapture}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  
                  {/* Upload Button */}
                  <div className="relative bg-white p-6 rounded-3xl shadow-sm border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors aspect-square">
                    <Upload className="w-10 h-10 text-[#00209F] mb-3" />
                    <p className="text-gray-600 font-medium text-center text-sm">{t('uploadPhoto')}</p>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageCapture}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-bold uppercase">{t('or')}</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Type Homework (Coming Soon) */}
                <div 
                  onClick={() => alert(t('comingSoon'))}
                  className="w-full bg-white border-2 border-gray-200 rounded-2xl p-5 flex flex-col space-y-2 cursor-pointer hover:bg-gray-50 transition-colors shadow-sm relative overflow-hidden"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">{t('typeHomework')}</span>
                    <span className="bg-blue-100 text-[#00209F] text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Coming Soon</span>
                  </div>
                  <div className="h-10 bg-gray-50 rounded-xl border border-gray-100 flex items-center px-3">
                    <span className="text-gray-400 text-sm">e.g. 2x + 4 = 10...</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative aspect-[3/4] w-full bg-gray-100 rounded-3xl overflow-hidden shadow-inner border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
                <img src={imagePreview} alt="Devwa" className="w-full h-full object-cover" />
                {!isSolving && (
                  <button
                    onClick={() => { setImage(null); setImagePreview(null); }}
                    className="absolute top-4 right-4 bg-white/90 text-red-500 p-2 rounded-full shadow-lg hover:bg-red-50 transition-colors z-10"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}
              </div>
            )}

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
                className="w-full bg-[#D21034] text-white font-bold text-lg py-4 rounded-2xl shadow-lg hover:bg-[#b00d2b] transition-colors disabled:opacity-70 flex items-center justify-center space-x-2 overflow-hidden relative"
              >
                {isSolving ? (
                  <div className="flex flex-col items-center space-y-2 py-2">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>{t('thinking')}</span>
                    </div>
                    <p className="text-xs font-normal animate-pulse px-4 text-center">
                      {t(`loadingFact${loadingFactIndex + 1}`)}
                    </p>
                  </div>
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

                <div className="pt-4 border-t border-gray-100">
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-800 leading-relaxed font-medium">
                      {t('aiNotice')}
                    </p>
                  </div>
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
