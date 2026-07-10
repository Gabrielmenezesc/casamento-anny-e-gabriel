import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, UserCheck, Shirt, MessageSquare, Clipboard, AlertCircle, Sparkles } from 'lucide-react';
import { GodparentConfirmation, AppSettings } from '../types';

interface GodparentsProps {
  godparents: GodparentConfirmation[];
  onAddGodparent: (godparent: GodparentConfirmation) => void;
  settings: AppSettings;
}

export default function Godparents({ godparents, onAddGodparent, settings }: GodparentsProps) {
  // Password Lock Screen State
  const [accessCode, setAccessCode] = useState('');
  const [hasAccess, setHasAccess] = useState<boolean>(() => {
    return localStorage.getItem('wedding_godparents_accessed') === 'true';
  });
  const [accessError, setAccessError] = useState(false);

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    const correctCode = (settings.godparentsCode || 'padrinho').trim().toLowerCase();
    if (accessCode.trim().toLowerCase() === correctCode) {
      setHasAccess(true);
      setAccessError(false);
      localStorage.setItem('wedding_godparents_accessed', 'true');
    } else {
      setAccessError(true);
    }
  };

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(true);
  const [clothingSize, setClothingSize] = useState('');
  const [shoeSize, setShoeSize] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [companionName, setCompanionName] = useState('');
  const [message, setMessage] = useState('');

  // Form Status
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!hasAccess) {
    return (
      <div className="py-32 px-4 max-w-md mx-auto text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-6 animate-bounce">
          <Heart className="w-8 h-8 fill-rose-500 text-rose-500" />
        </div>
        
        <h2 className="text-3xl font-serif text-gray-900 dark:text-white mb-2">Área Exclusiva</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-8 uppercase tracking-widest font-mono">Padrinhos & Madrinhas</p>

        <div className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed text-left">
            Olá querido(a) padrinho ou madrinha! Esta área é reservada para coordenarmos as especificações dos trajes, buffet e darmos orientações especiais para o nosso grande dia.
          </p>
          <p className="text-xs text-rose-600 dark:text-rose-400 leading-relaxed text-left font-medium">
            Por favor, insira a palavra-chave de acesso enviada no seu convite:
          </p>
          
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <input
                type="text"
                required
                value={accessCode}
                onChange={e => {
                  setAccessCode(e.target.value);
                  setAccessError(false);
                }}
                placeholder="Digite a palavra-chave..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500 text-sm text-center font-semibold tracking-wide"
              />
            </div>

            {accessError && (
              <p className="text-xs text-rose-500 font-semibold italic">Palavra-chave incorreta. Verifique o seu convite de padrinho!</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold uppercase tracking-widest cursor-pointer shadow-md shadow-rose-600/10 transition-colors flex items-center justify-center gap-1.5"
            >
              Acessar Área de Padrinhos
            </button>
          </form>
        </div>
        
        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-4 italic">Dica: A senha padrão de demonstração é <span className="font-bold underline">padrinho</span>.</p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !clothingSize || !shoeSize) return;

    setSubmitting(true);
    setTimeout(() => {
      const confirmation: GodparentConfirmation = {
        id: Math.random().toString(36).substring(2, 9),
        fullName,
        phone,
        email: email || undefined,
        isConfirmed,
        clothingSize,
        shoeSize,
        dietaryRestrictions: dietaryRestrictions || undefined,
        companionName: companionName || undefined,
        message: message || undefined,
        confirmedAt: new Date().toISOString(),
      };

      onAddGodparent(confirmation);
      setSubmitting(false);
      setSubmitted(true);
      resetForm();
    }, 800);
  };

  const resetForm = () => {
    setFullName('');
    setPhone('');
    setEmail('');
    setIsConfirmed(true);
    setClothingSize('');
    setShoeSize('');
    setDietaryRestrictions('');
    setCompanionName('');
    setMessage('');
  };

  return (
    <div className="py-24 px-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-sans tracking-tight font-light text-gray-900 dark:text-gray-100">
          Área dos <span className="font-serif italic text-rose-600 dark:text-rose-400 font-normal">Padrinhos</span>
        </h2>
        <div className="w-12 h-[1px] bg-rose-500 mx-auto mt-4" />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 uppercase tracking-widest">Nossos conselheiros e guardiões do amor</p>
      </div>

      {/* Outfits Visual Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <div className="p-6 rounded-3xl bg-rose-50/40 dark:bg-rose-950/15 border border-rose-100/50 dark:border-rose-900/20 shadow-sm">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">👰♀️</div>
            <h3 className="text-lg font-serif font-bold text-gray-800 dark:text-gray-200">Para as Madrinhas</h3>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            Queridas madrinhas, escolhemos uma paleta suave e romântica para que todas fiquem harmônicas no altar. Solicitamos o uso de vestidos longos no tom <span className="font-bold text-rose-600 dark:text-rose-400">Rosé Gold / Rose Quartz</span>.
          </p>
          <div className="flex gap-2">
            <span className="w-8 h-8 rounded-full bg-[#E8C5C8] border border-white shadow-sm" title="Rose Quartz" />
            <span className="w-8 h-8 rounded-full bg-[#D4A373] border border-white shadow-sm" title="Rose Gold" />
            <span className="w-8 h-8 rounded-full bg-[#E2B1B1] border border-white shadow-sm" title="Blush Rose" />
            <span className="w-8 h-8 rounded-full bg-[#F4D1D1] border border-white shadow-sm" title="Soft Rose" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-900/40 border border-gray-200/40 dark:border-gray-800/60 shadow-sm">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 flex items-center justify-center font-bold">🤵</div>
            <h3 className="text-lg font-serif font-bold text-gray-800 dark:text-gray-200">Para os Padrinhos</h3>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            Queridos padrinhos, solicitamos o uso de <span className="font-bold text-gray-800 dark:text-gray-200">Terno Cinza Chumbo</span> (calça e paletó), camisa branca social, sapatos pretos e a gravata que entregamos no convite oficial.
          </p>
          <div className="flex gap-2">
            <span className="w-8 h-8 rounded-full bg-[#343A40] border border-white shadow-sm" title="Cinza Chumbo" />
            <span className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-gray-200 shadow-sm" title="Camisa Branca" />
            <span className="w-8 h-8 rounded-full bg-[#E2B1B1] border border-white shadow-sm" title="Gravata Rosé" />
            <span className="w-8 h-8 rounded-full bg-[#212529] border border-white shadow-sm" title="Sapato Preto" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        {/* Description panel */}
        <div className="md:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-rose-500" />
              <h4 className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 font-bold">Papel Especial</h4>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Ser padrinho ou madrinha vai muito além do altar. Significa abençoar, orar, aconselhar e apoiar nossa família em todas as fases da vida.
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mt-2">
              Por favor, preencha o formulário ao lado para registrarmos as especificações dos seus trajes e nos prepararmos para recebê-los de forma impecável!
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/30 flex items-start gap-2 text-amber-800 dark:text-amber-400 text-xs">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="leading-relaxed">
              O preenchimento destas informações é estritamente confidencial e serve para coordenarmos terno/vestido e buffet específico para o dia do evento.
            </p>
          </div>
        </div>

        {/* Confirmation Form */}
        <div className="md:col-span-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-xl relative">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
                  <Heart className="w-8 h-8 fill-emerald-500 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-serif text-gray-900 dark:text-white mb-3">Ficha de Padrinho Salva!</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-8">
                  Amamos vocês! Suas respostas e confirmação foram salvas no sistema com sucesso. Obrigado por fazerem parte da nossa história de forma tão única.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2 rounded-xl text-xs font-semibold uppercase tracking-widest text-rose-600 border border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                >
                  Enviar Outra Ficha
                </button>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center gap-2 mb-6">
                  <UserCheck className="w-5 h-5 text-rose-500" />
                  <h3 className="text-lg font-serif text-gray-800 dark:text-gray-200 font-bold">Ficha de Confirmação de Padrinho</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-bold mb-1">Nome Completo *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        placeholder="Ex: Roberto Souza Santos"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-bold mb-1">Telefone *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="Ex: (61) 99888-7777"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-bold mb-1">E-mail <span className="text-gray-400 font-normal">(Opcional)</span></label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Ex: roberto@exemplo.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-bold mb-1">Presença no Casamento *</label>
                      <select
                        value={isConfirmed ? 'yes' : 'no'}
                        onChange={e => setIsConfirmed(e.target.value === 'yes')}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                      >
                        <option value="yes">Confirmado de forma definitiva</option>
                        <option value="no">Infelizmente não poderei comparecer</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-bold mb-1 flex items-center gap-1">
                        <Shirt className="w-3.5 h-3.5 text-rose-500" />
                        Tamanho do Terno / Vestido *
                      </label>
                      <input
                        type="text"
                        required
                        value={clothingSize}
                        onChange={e => setClothingSize(e.target.value)}
                        placeholder="Ex: M, G, 42, 48"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-bold mb-1 flex items-center gap-1">
                        <Clipboard className="w-3.5 h-3.5 text-rose-500" />
                        Número do Calçado *
                      </label>
                      <input
                        type="text"
                        required
                        value={shoeSize}
                        onChange={e => setShoeSize(e.target.value)}
                        placeholder="Ex: 38, 40, 42"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-bold mb-1">Nome do Acompanhante <span className="text-gray-400 font-normal">(Se houver)</span></label>
                      <input
                        type="text"
                        value={companionName}
                        onChange={e => setCompanionName(e.target.value)}
                        placeholder="Ex: Esposa(o) ou Namorada(o)"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-bold mb-1">Restrição Alimentar <span className="text-gray-400 font-normal">(Opcional)</span></label>
                      <input
                        type="text"
                        value={dietaryRestrictions}
                        onChange={e => setDietaryRestrictions(e.target.value)}
                        placeholder="Ex: Vegano, Alérgico a Camarão, Sem lactose"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-bold mb-1 flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-rose-500" />
                      Mensagem Especial para os Noivos
                    </label>
                    <textarea
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Deixe uma mensagem especial ou conselho para o lar de Laoanny e Gabriel..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold uppercase tracking-wider text-sm transition-all shadow-md shadow-rose-600/10 cursor-pointer"
                  >
                    {submitting ? 'Salvando Ficha...' : 'CONFIRMAR FICHA DE PADRINHO'}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
