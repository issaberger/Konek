import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { db, logout, handleFirestoreError, OperationType, auth } from '../lib/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { updateProfile, deleteUser } from 'firebase/auth';
import { Flame, Star, Award, LogOut, Info, Edit2, Camera, X, Check, Trash2, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, userData, refreshUserData } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userData && !isEditing) {
      setEditName(userData.displayName || '');
    }
  }, [userData, isEditing]);

  if (!userData) return null;

  const handleEditClick = () => {
    setEditName(userData.displayName || '');
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      // Update Firebase Auth
      await updateProfile(user, { displayName: editName });
      
      // Update Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { displayName: editName });
      
      await refreshUserData();
      setIsEditing(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'users');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      // 1. Delete Firestore data
      await deleteDoc(doc(db, 'users', user.uid));
      // 2. Delete Auth user
      await deleteUser(user);
      navigate('/');
    } catch (error: any) {
      console.error("Error deleting account:", error);
      if (error.code === 'auth/requires-recent-login') {
        alert("Pou sekirite, ou dwe rekonekte anvan ou efase kont ou.");
        await logout();
        navigate('/');
      } else {
        alert("Erè pandan n ap efase kont lan.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsSaving(true);
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 400; // Increased size for better quality
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);
          }
          
          const base64Image = canvas.toDataURL('image/jpeg', 0.8);

          // Update Firestore with full-sized base64 (safe up to 1MB)
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, { photoURL: base64Image });

          // Create a much smaller thumbnail for Firebase Auth (limit is ~2KB)
          const thumbCanvas = document.createElement('canvas');
          const THUMB_SIZE = 50;
          thumbCanvas.width = THUMB_SIZE;
          thumbCanvas.height = THUMB_SIZE;
          const thumbCtx = thumbCanvas.getContext('2d');
          if (thumbCtx) {
            thumbCtx.drawImage(img, 0, 0, THUMB_SIZE, THUMB_SIZE);
          }
          const thumbBase64 = thumbCanvas.toDataURL('image/jpeg', 0.5);

          try {
            // Update Firebase Auth with the small thumbnail
            await updateProfile(user, { photoURL: thumbBase64 });
          } catch (authError) {
            console.warn("Auth photoURL update failed (likely still too long), but Firestore is updated:", authError);
          }
          
          await refreshUserData();
          setIsSaving(false);
        };
      };
      reader.readAsDataURL(file);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'users');
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f0]">
      <header className="bg-white p-4 shadow-sm sticky top-0 z-10 flex justify-between items-center">
        <h1 className="text-2xl font-serif font-bold text-[#00209F]">{t('profile')}</h1>
        <button onClick={logout} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
          <LogOut className="w-6 h-6" />
        </button>
      </header>

      <main className="flex-1 p-4 space-y-6 pb-24">
        {/* User Info Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm relative">
          {!isEditing ? (
            <button 
              onClick={handleEditClick}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-[#00209F] hover:bg-blue-50 rounded-full transition-colors"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          ) : null}

          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src={userData.photoURL || user?.photoURL || `https://ui-avatars.com/api/?name=${userData.displayName || 'User'}&background=00209F&color=fff`} 
                alt="Profile" 
                className="w-20 h-20 rounded-full border-4 border-blue-50 object-cover"
              />
              {isEditing && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-[#D21034] text-white p-1.5 rounded-full shadow-md hover:bg-[#b00d2b] transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
            
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder={t('name')}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00209F]/50 font-bold text-gray-900"
                  />
                  <div className="flex space-x-2">
                    <button 
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="flex-1 bg-[#00209F] text-white py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-[#001a80] transition-colors flex justify-center items-center"
                    >
                      {isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Check className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                      className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-gray-200 transition-colors flex justify-center items-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-900">{userData.displayName || <span className="text-gray-400 italic">{t('notSet')}</span>}</h2>
                  <p className="text-gray-500 text-sm">{userData.email || user?.phoneNumber || <span className="text-gray-400 italic">{t('notSet')}</span>}</p>
                  <div className="inline-block mt-2 px-3 py-1 bg-blue-100 text-[#00209F] text-xs font-bold uppercase tracking-wider rounded-full">
                    {userData.grade_level || 'Student'}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl p-5 shadow-sm flex flex-col items-center text-center space-y-2">
            <div className="bg-blue-50 p-3 rounded-full">
              <Star className="w-8 h-8 text-[#00209F]" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{userData.points || 0}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{t('points')}</p>
          </div>
          
          <div className="bg-white rounded-3xl p-5 shadow-sm flex flex-col items-center text-center space-y-2">
            <div className="bg-red-50 p-3 rounded-full">
              <Flame className="w-8 h-8 text-[#D21034]" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{userData.streak_days || 0}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{t('streak')}</p>
          </div>
        </div>

        {/* Badges Section */}
        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 flex items-center space-x-2">
            <Award className="w-5 h-5 text-[#00209F]" />
            <span>{t('badges')}</span>
          </h3>
          
          <div className="flex flex-wrap gap-3">
            {userData.badges?.map((badge: string, i: number) => (
              <div key={i} className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl flex items-center space-x-2">
                <span className="text-xl">🏅</span>
                <span className="font-medium text-[#00209F]">{badge}</span>
              </div>
            ))}
            {(!userData.badges || userData.badges.length === 0) && (
              <p className="text-sm text-gray-500">Ou poko gen badj. Fè devwa pou w genyen!</p>
            )}
          </div>
        </div>

        {/* About Link */}
        <Link to="/about" className="bg-white rounded-3xl p-4 shadow-sm flex items-center justify-between hover:bg-gray-50 transition-colors">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-50 p-2 rounded-full">
              <Info className="w-5 h-5 text-[#00209F]" />
            </div>
            <span className="font-bold text-gray-900">{t('about')}</span>
          </div>
        </Link>

        {/* Danger Zone */}
        <div className="pt-4">
          {!showDeleteConfirm ? (
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center justify-center space-x-2 text-red-500 text-sm font-medium p-4 hover:bg-red-50 rounded-2xl transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>{t('deleteAccount')}</span>
            </button>
          ) : (
            <div className="bg-red-50 border border-red-100 rounded-3xl p-6 space-y-4 animate-in fade-in zoom-in duration-200">
              <div className="flex items-center space-x-3 text-red-600">
                <AlertTriangle className="w-6 h-6" />
                <p className="font-bold">{t('confirmDeleteAccount')}</p>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={handleDeleteAccount}
                  disabled={isSaving}
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-red-700 transition-colors flex justify-center items-center"
                >
                  {isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : t('delete')}
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isSaving}
                  className="flex-1 bg-white text-gray-600 py-3 rounded-xl font-bold text-sm border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
                >
                  {t('cancel')}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
