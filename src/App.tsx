import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart, Sun, Moon, Menu, X, Home as HomeIcon, CheckCircle, Gift, Plane, MapPin, ShieldAlert, BookOpen
} from 'lucide-react';

// Data types & templates
import { RSVP, GiftItem, GodparentConfirmation, HoneymoonSettings, AppSettings } from './types';
import { INITIAL_GIFTS } from './initialGifts';

// Components
import Home from './components/Home';
import About from './components/About';
import Rsvp from './components/Rsvp';
import Gifts from './components/Gifts';
import Godparents from './components/Godparents';
import Honeymoon from './components/Honeymoon';
import Location from './components/Location';
import AdminPanel from './components/AdminPanel';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('wedding_dark_mode');
    return saved === 'true' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core Data States with localStorage persistence
  const [rsvps, setRsvps] = useState<RSVP[]>(() => {
    const saved = localStorage.getItem('wedding_rsvps');
    return saved ? JSON.parse(saved) : [];
  });

  const [gifts, setGifts] = useState<GiftItem[]>(() => {
    const saved = localStorage.getItem('wedding_gifts');
    return saved ? JSON.parse(saved) : INITIAL_GIFTS;
  });

  const [godparents, setGodparents] = useState<GodparentConfirmation[]>(() => {
    const saved = localStorage.getItem('wedding_godparents');
    return saved ? JSON.parse(saved) : [];
  });

  const [honeymoon, setHoneymoon] = useState<HoneymoonSettings>(() => {
    const saved = localStorage.getItem('wedding_honeymoon');
    return saved ? JSON.parse(saved) : {
      goal: 25000,
      currentAmount: 3850, // Initial dummy collected amount to make progress bar beautiful
      pixKey: '38991621135',
      qrCodeUrl: '',
      cardPaymentUrl: 'https://link.infinitepay.io/gabrielmen10?origin=link-na-bio',
      description: 'Se preferir nos presentear de outra forma, você também pode contribuir para realizarmos nossa Lua de Mel. Qualquer valor será recebido com muito carinho.'
    };
  });

  const [appSettings, setAppSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('wedding_app_settings');
    const defaultSettings: AppSettings = {
      coupleName1: 'Laoanny',
      coupleName2: 'Gabriel',
      weddingDate: '2027-04-25',
      weddingTime: '15:00',
      locationName: 'Espaço Villa Rose',
      locationAddress: 'Samambaia Sul, Brasília - DF',
      locationMapUrl: 'https://maps.app.goo.gl/EuzcXbutFQzt9vD48',
      locationMapIframeUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15350.31603525265!2d-48.06456073836102!3d-15.878953185387431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a32ec4ef301db%3A0xc67f70b7978b7bd9!2sEspa%C3%A7o%20Villa%20Rose!5e0!3m2!1spt-BR!2sbr!4v1700000000000',
      couplePhotoUrl: 'https://images.unsplash.com/photo-1464518017462-7b4700147cb3?q=80&w=1200',
      godparentsCode: 'padrinho'
    };
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...defaultSettings, ...parsed };
      } catch (e) {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  // Apply Theme class list on document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('wedding_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('wedding_dark_mode', 'false');
    }
  }, [darkMode]);

  // Synchronize localStorage
  useEffect(() => {
    localStorage.setItem('wedding_rsvps', JSON.stringify(rsvps));
  }, [rsvps]);

  useEffect(() => {
    localStorage.setItem('wedding_gifts', JSON.stringify(gifts));
  }, [gifts]);

  useEffect(() => {
    localStorage.setItem('wedding_godparents', JSON.stringify(godparents));
  }, [godparents]);

  useEffect(() => {
    localStorage.setItem('wedding_honeymoon', JSON.stringify(honeymoon));
  }, [honeymoon]);

  useEffect(() => {
    localStorage.setItem('wedding_app_settings', JSON.stringify(appSettings));
  }, [appSettings]);

  // Handle new RSVP
  const handleAddRsvp = (newRsvp: RSVP) => {
    setRsvps(prev => [newRsvp, ...prev]);
  };

  const handleUpdateRsvp = (updatedRsvp: RSVP) => {
    setRsvps(prev => prev.map(item => item.id === updatedRsvp.id ? updatedRsvp : item));
  };

  const handleDeleteRsvp = (id: string) => {
    setRsvps(prev => prev.filter(item => item.id !== id));
  };

  // Handle gift reservation
  const handleReserveGift = (id: string, reservation: {
    reservedBy?: string;
    reservedPhone?: string;
    reservationMessage?: string;
    isAnonymous: boolean;
  }) => {
    setGifts(prev => prev.map(gift => {
      if (gift.id === id) {
        return {
          ...gift,
          status: 'reserved' as const,
          reservedBy: reservation.reservedBy,
          reservedPhone: reservation.reservedPhone,
          reservationMessage: reservation.reservationMessage,
          isAnonymous: reservation.isAnonymous,
          reservedAt: new Date().toISOString()
        };
      }
      return gift;
    }));
  };

  // Handle new Godparent confirmation
  const handleAddGodparent = (newGod: GodparentConfirmation) => {
    setGodparents(prev => [newGod, ...prev]);
  };

  // Handle Honeymoon Contributions
  const handleAddContribution = (name: string, amount: number, message?: string) => {
    setHoneymoon(prev => ({
      ...prev,
      currentAmount: prev.currentAmount + amount
    }));

    // Generate a simulated contribution to godparent or just add as a simple guest RSVP note
    const systemNotice: RSVP = {
      id: Math.random().toString(36).substring(2, 9),
      fullName: `Cota Lua de Mel - ${name}`,
      phone: '(Pix/Cartão)',
      email: undefined,
      adultsCount: 0,
      childrenCount: 0,
      notes: `Contribuição de R$ ${amount.toLocaleString('pt-BR')} para Lua de Mel. Recado: "${message || 'Sem recado.'}"`,
      confirmedAt: new Date().toISOString()
    };
    setRsvps(prev => [systemNotice, ...prev]);
  };

  // Quick action navigation
  const navigateTo = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigation Items
  const navItems = [
    { id: 'home', label: '🏠 Início' },
    { id: 'about', label: '👰 Os Noivos' },
    { id: 'rsvp', label: '👨‍👩‍👧 Convidados' },
    { id: 'gifts', label: '🎁 Lista da Casa' },
    { id: 'godparents', label: '🤵 Padrinhos' },
    { id: 'honeymoon', label: '💝 Lua de Mel' },
    { id: 'location', label: '📍 Localização' },
    { id: 'admin', label: '⚙️ Painel' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 transition-colors duration-300 font-sans selection:bg-rose-500/30">
      
      {/* Sticky top glassmorphic navigation bar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/70 dark:bg-gray-950/70 backdrop-blur-md border-b border-gray-100 dark:border-gray-900 transition-colors duration-300 non-printable">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div onClick={() => navigateTo('home')} className="flex items-center gap-2 cursor-pointer group">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500 group-hover:scale-110 transition-transform" />
            <span className="font-serif text-lg tracking-tight font-medium text-gray-900 dark:text-white">
              Laoanny <span className="text-rose-500 italic">&</span> Gabriel
            </span>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all ${activeTab === item.id ? 'bg-rose-500 text-white shadow-md shadow-rose-500/10' : 'text-gray-500 dark:text-gray-400 hover:text-rose-600 hover:bg-rose-50/50 dark:hover:bg-rose-950/20'}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action Widgets */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full border border-gray-150 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-500 dark:text-gray-400 cursor-pointer transition-all"
              title="Alternar Tema"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-rose-500" />}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full border border-gray-150 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-500 dark:text-gray-400 cursor-pointer transition-all"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Sliding Glass Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 z-30 bg-white/95 dark:bg-gray-950/95 backdrop-blur-lg border-b border-gray-150 dark:border-gray-900 shadow-xl p-4 flex flex-col gap-2 lg:hidden transition-all non-printable"
          >
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`w-full py-3 px-4 rounded-xl text-left text-xs font-semibold uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-rose-500 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'}`}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === 'home' && (
              <Home 
                onNavigate={navigateTo} 
                settings={appSettings} 
                onUpdateSettings={setAppSettings} 
              />
            )}
            
            {activeTab === 'about' && (
              <About />
            )}

            {activeTab === 'rsvp' && (
              <Rsvp
                rsvps={rsvps}
                onAddRsvp={handleAddRsvp}
                onUpdateRsvp={handleUpdateRsvp}
                onDeleteRsvp={handleDeleteRsvp}
              />
            )}

            {activeTab === 'gifts' && (
              <Gifts
                gifts={gifts}
                onReserveGift={handleReserveGift}
              />
            )}

            {activeTab === 'godparents' && (
              <Godparents
                godparents={godparents}
                onAddGodparent={handleAddGodparent}
                settings={appSettings}
              />
            )}

            {activeTab === 'honeymoon' && (
              <Honeymoon
                settings={honeymoon}
                onAddContribution={handleAddContribution}
              />
            )}

            {activeTab === 'location' && (
              <Location settings={appSettings} />
            )}

            {activeTab === 'admin' && (
              <AdminPanel
                rsvps={rsvps}
                gifts={gifts}
                godparents={godparents}
                honeymoon={honeymoon}
                appSettings={appSettings}
                onUpdateGifts={setGifts}
                onUpdateRsvps={setRsvps}
                onUpdateGodparents={setGodparents}
                onUpdateHoneymoon={setHoneymoon}
                onUpdateAppSettings={setAppSettings}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer / FAQ section (Informaçoes) */}
      <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-150 dark:border-gray-900/60 py-16 px-4 transition-colors duration-300 non-printable">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-rose-600 dark:text-rose-450 font-bold">❓ Informações Gerais</h4>
            <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              <p>📍 <strong>Local:</strong> Espaço Villa Rose, Samambaia Sul, Brasília - DF.</p>
              <p>⏰ <strong>Traje:</strong> Esporte Fino / Social. Evite branco e tons muito claros.</p>
              <p>🚗 <strong>Estacionamento:</strong> O local possui estacionamento fechado e segurança privada para os convidados.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-rose-600 dark:text-rose-450 font-bold">🌸 Nosso Lema</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 italic leading-relaxed font-serif">
              "Assim, eles já não são dois, mas sim uma só carne. Portanto, o que Deus uniu, ninguém separe." <br />
              <span className="block mt-2 font-semibold font-sans">— Mateus 19:6</span>
            </p>
          </div>

          <div className="space-y-4 flex flex-col justify-between">
            <div>
              <h4 className="text-xs uppercase tracking-widest text-rose-600 dark:text-rose-450 font-bold">💍 Laoanny & Gabriel</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Preparado com amor e carinho para todos os nossos familiares e amigos de Brasília e de todo o Brasil.
              </p>
            </div>

            <div className="pt-4 flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-gray-400" />
              <button
                onClick={() => navigateTo('admin')}
                className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-rose-600 dark:hover:text-rose-450 underline transition-colors cursor-pointer"
              >
                Acesso Noivos (Painel)
              </button>
            </div>
          </div>

        </div>

        <div className="max-w-4xl mx-auto border-t border-gray-150 dark:border-gray-900/40 mt-12 pt-6 text-center text-[10px] text-gray-400">
          © 2026 Laoanny & Gabriel. Todos os direitos reservados. Crafted with care in Brasília - DF.
        </div>
      </footer>

    </div>
  );
}
