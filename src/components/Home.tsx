import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, MapPin, CheckCircle, Gift, Heart, Plane, Map, CreditCard, Sparkles, Image as ImageIcon, Upload } from 'lucide-react';
import { AppSettings } from '../types';

interface HomeProps {
  onNavigate: (tabId: string) => void;
  settings: AppSettings;
  onUpdateSettings?: (updated: AppSettings) => void;
}

export default function Home({ onNavigate, settings, onUpdateSettings }: HomeProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
  });

  // State to handle photo customization directly on Home for demo convenience
  const [currentPhoto, setCurrentPhoto] = useState(settings.couplePhotoUrl || 'https://images.unsplash.com/photo-1464518017462-7b4700147cb3?q=80&w=1200');
  const [showPhotoForm, setShowPhotoForm] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (settings.couplePhotoUrl) {
      setCurrentPhoto(settings.couplePhotoUrl);
    }
  }, [settings.couplePhotoUrl]);

  const savePhotoData = (photoUrlOrBase64: string) => {
    setCurrentPhoto(photoUrlOrBase64);
    
    // Save to localStorage so it persists instantly
    const saved = localStorage.getItem('wedding_app_settings');
    let parsed = saved ? JSON.parse(saved) : { ...settings };
    parsed.couplePhotoUrl = photoUrlOrBase64;
    localStorage.setItem('wedding_app_settings', JSON.stringify(parsed));
    
    if (onUpdateSettings) {
      onUpdateSettings(parsed);
    }
  };

  const handleUpdatePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;
    savePhotoData(newPhotoUrl.trim());
    setShowPhotoForm(false);
    setNewPhotoUrl('');
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        savePhotoData(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  useEffect(() => {
    // Casamento em 25 de Abril de 2027 às 15:00 (Fuso Brasília -03:00)
    const targetDate = new Date(`${settings.weddingDate}T${settings.weddingTime}:00-03:00`).getTime();


    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isOver: false });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [settings.weddingDate, settings.weddingTime]);

  return (
    <div id="home-section" className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-4 overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-rose-200/20 dark:bg-rose-950/10 blur-3xl -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-100/30 dark:bg-emerald-950/10 blur-3xl -z-10" />

      {/* Hero Content */}
      <div className="w-full max-w-4xl mx-auto text-center z-10 py-12 md:py-20 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-200/50 bg-rose-50/50 dark:bg-rose-950/30 dark:border-rose-900/30 text-rose-700 dark:text-rose-300 text-xs font-semibold tracking-wider uppercase backdrop-blur-md"
        >
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
          Salve esta Data
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-5xl md:text-8xl font-sans tracking-tight font-light text-gray-900 dark:text-gray-100 mb-2 leading-none"
        >
          {settings.coupleName1} <span className="font-serif italic text-rose-600 dark:text-rose-400 font-normal">&</span> {settings.coupleName2}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-lg md:text-2xl tracking-widest font-light text-gray-500 dark:text-gray-400 uppercase mb-8"
        >
          Os Noivos
        </motion.p>

        {/* Elegant Interactive Photo Frame */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="relative w-full max-w-xl mx-auto mb-12 group"
        >
          {/* Decorative glowing gradient backdrop */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-rose-500 to-amber-500 rounded-[2.2rem] blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-500" />
          
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative overflow-hidden rounded-[2rem] border-4 ${isDragging ? 'border-dashed border-rose-500 bg-rose-50/20 dark:bg-rose-950/20' : 'border-white dark:border-gray-900 bg-white dark:bg-gray-950'} shadow-2xl flex flex-col items-center transition-all duration-300`}
          >
            {/* The photo display/upload element */}
            <div className="relative w-full aspect-[4/3] bg-gray-100 dark:bg-gray-900 overflow-hidden">
              <img
                src={currentPhoto}
                alt="Laoanny & Gabriel"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              
              {/* Overlay for Drag & Drop / Click upload */}
              <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center cursor-pointer text-white backdrop-blur-[2px]">
                <div className="p-4 rounded-full bg-white/10 border border-white/20 mb-3 animate-pulse">
                  <Upload className="w-8 h-8 text-rose-300" />
                </div>
                <span className="text-sm font-semibold tracking-wide">Clique ou Arraste a Foto do Piquenique!</span>
                <span className="text-[10px] text-gray-300 mt-1 uppercase tracking-widest font-mono">JPG, PNG ou WEBP</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
            
            {/* Sub-label bar */}
            <div className="py-4 px-6 w-full bg-gray-50/80 dark:bg-gray-900/80 border-t border-gray-100 dark:border-gray-800/80 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
              <span className="font-serif italic font-medium">👰 Laoanny & 🤵 Gabriel</span>
              <button 
                onClick={() => setShowPhotoForm(!showPhotoForm)}
                className="text-rose-600 dark:text-rose-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-500" />
                Alterar via Link
              </button>
            </div>
          </div>

          {/* Quick link update input */}
          <AnimatePresence>
            {showPhotoForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleUpdatePhoto}
                className="mt-4 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-lg flex gap-2 overflow-hidden"
              >
                <input
                  type="url"
                  placeholder="Cole aqui o link da imagem (ex: do Unsplash ou Imgur)..."
                  required
                  value={newPhotoUrl}
                  onChange={e => setNewPhotoUrl(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                >
                  Salvar Link
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Wedding Details Dashboard (Glassmorphism) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mb-12"
        >
          <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-white/60 dark:bg-gray-900/40 backdrop-blur-md shadow-sm flex flex-col items-center">
            <Calendar className="w-6 h-6 text-rose-500 mb-3" />
            <h3 className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 font-medium">Data</h3>
            <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mt-1">25 de Abril de 2027</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Domingo</p>
          </div>

          <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-white/60 dark:bg-gray-900/40 backdrop-blur-md shadow-sm flex flex-col items-center">
            <Clock className="w-6 h-6 text-rose-500 mb-3" />
            <h3 className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 font-medium">Horário</h3>
            <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mt-1">{settings.weddingTime} Horas</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Pontual</p>
          </div>

          <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-white/60 dark:bg-gray-900/40 backdrop-blur-md shadow-sm flex flex-col items-center">
            <MapPin className="w-6 h-6 text-rose-500 mb-3" />
            <h3 className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 font-medium">Local</h3>
            <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mt-1">{settings.locationName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">{settings.locationAddress}</p>
          </div>
        </motion.div>

        {/* Elegant Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full max-w-2xl bg-gray-950/5 dark:bg-white/5 border border-gray-200/30 dark:border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-inner mb-16"
        >
          <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-medium mb-6">Contagem Regressiva</p>
          
          {timeLeft.isOver ? (
            <p className="text-2xl font-serif text-rose-600 dark:text-rose-400">Chegou o Grande Dia! ❤️</p>
          ) : (
            <div className="grid grid-cols-4 gap-2 md:gap-4">
              <div className="flex flex-col">
                <span className="text-3xl md:text-5xl font-light tracking-tight text-gray-900 dark:text-white font-mono">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="text-[10px] md:text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 mt-1">Dias</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl md:text-5xl font-light tracking-tight text-gray-900 dark:text-white font-mono">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] md:text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 mt-1">Horas</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl md:text-5xl font-light tracking-tight text-gray-900 dark:text-white font-mono">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] md:text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 mt-1">Minutos</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl md:text-5xl font-light tracking-tight text-gray-900 dark:text-white font-mono">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] md:text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 mt-1">Segundos</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Major Elegant Interactive Action Buttons - High End Bento Design */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full"
        >
          {/* Button 1: RSVP */}
          <button
            onClick={() => onNavigate('rsvp')}
            className="group relative flex flex-col items-center justify-center p-6 rounded-3xl bg-gradient-to-br from-rose-500 to-rose-600 dark:from-rose-600 dark:to-rose-700 text-white shadow-lg shadow-rose-500/20 hover:shadow-xl hover:shadow-rose-500/30 transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer border border-rose-400/30 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-base font-bold tracking-wide">Confirmar Presença</span>
            <span className="text-[10px] text-rose-100 mt-1 uppercase tracking-wider font-light">Garanta o seu lugar</span>
          </button>

          {/* Button 2: Gifts */}
          <button
            onClick={() => onNavigate('gifts')}
            className="group relative flex flex-col items-center justify-center p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-50/50 dark:hover:bg-gray-850/50 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 border border-transparent group-hover:border-rose-500/10 rounded-3xl transition-colors" />
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Gift className="w-6 h-6 text-rose-500" />
            </div>
            <span className="text-base font-bold tracking-wide">Lista da Casa</span>
            <span className="text-[10px] text-gray-450 dark:text-gray-500 mt-1 uppercase tracking-wider font-light">Presentes & Mimos</span>
          </button>

          {/* Button 3: Godparents */}
          <button
            onClick={() => onNavigate('godparents')}
            className="group relative flex flex-col items-center justify-center p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-50/50 dark:hover:bg-gray-850/50 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 border border-transparent group-hover:border-rose-500/10 rounded-3xl transition-colors" />
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6 text-rose-500 animate-pulse" />
            </div>
            <span className="text-base font-bold tracking-wide">Padrinhos</span>
            <span className="text-[10px] text-gray-450 dark:text-gray-500 mt-1 uppercase tracking-wider font-light">Área Especial</span>
          </button>

          {/* Button 4: Honeymoon */}
          <button
            onClick={() => onNavigate('honeymoon')}
            className="group relative flex flex-col items-center justify-center p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-50/50 dark:hover:bg-gray-850/50 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 border border-transparent group-hover:border-rose-500/10 rounded-3xl transition-colors" />
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Plane className="w-6 h-6 text-rose-500" />
            </div>
            <span className="text-base font-bold tracking-wide">Lua de Mel</span>
            <span className="text-[10px] text-gray-450 dark:text-gray-500 mt-1 uppercase tracking-wider font-light">Nossa Viagem</span>
          </button>

          {/* Button 5: Location */}
          <button
            onClick={() => onNavigate('location')}
            className="group relative flex flex-col items-center justify-center p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-50/50 dark:hover:bg-gray-850/50 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 border border-transparent group-hover:border-rose-500/10 rounded-3xl transition-colors" />
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Map className="w-6 h-6 text-rose-500" />
            </div>
            <span className="text-base font-bold tracking-wide">Localização</span>
            <span className="text-[10px] text-gray-450 dark:text-gray-500 mt-1 uppercase tracking-wider font-light">Espaço Villa Rose</span>
          </button>

          {/* Button 6: Contribute */}
          <button
            onClick={() => onNavigate('honeymoon')}
            className="group relative flex flex-col items-center justify-center p-6 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 text-white shadow-lg shadow-emerald-500/15 hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer border border-emerald-400/30 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <span className="text-base font-bold tracking-wide">Contribuir</span>
            <span className="text-[10px] text-emerald-100 mt-1 uppercase tracking-wider font-light">Presente via PIX</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
