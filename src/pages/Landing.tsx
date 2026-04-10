import { useState } from 'react';
import { signInWithGoogle } from '../lib/firebase';
import { BookOpen, Sparkles } from 'lucide-react';

export default function Landing() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#FF6321] text-white">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm text-center space-y-8">
        <div className="bg-white/20 p-6 rounded-full">
          <BookOpen className="w-20 h-20 text-white" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight font-serif">Konek</h1>
          <p className="text-lg text-white/90 font-medium">
            Asistan devwa entèlijan ou an Kreyòl.
          </p>
        </div>

        <div className="w-full space-y-4 pt-8">
          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center space-x-2 bg-white text-[#FF6321] py-4 px-6 rounded-full font-bold text-lg shadow-lg hover:bg-gray-50 transition-colors disabled:opacity-70"
          >
            {isLoggingIn ? (
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#FF6321] border-t-transparent"></div>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Konekte ak Google</span>
              </>
            )}
          </button>
          <p className="text-sm text-white/70">
            Kòmanse aprann pi vit jodi a!
          </p>
        </div>
      </div>
    </div>
  );
}
