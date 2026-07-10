import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Search, Filter, CheckCircle2, Lock, X, MessageSquare, Info } from 'lucide-react';
import { GiftItem } from '../types';
import { GIFT_CATEGORIES } from '../initialGifts';

interface GiftsProps {
  gifts: GiftItem[];
  onReserveGift: (id: string, reservation: {
    reservedBy?: string;
    reservedPhone?: string;
    reservationMessage?: string;
    isAnonymous: boolean;
  }) => void;
}

export default function Gifts({ gifts, onReserveGift }: GiftsProps) {
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'reserved'>('all');

  // Modal State
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorMessage, setDonorMessage] = useState('');
  const [successGiftName, setSuccessGiftName] = useState<string | null>(null);

  // Statistics
  const totalGifts = gifts.length;
  const reservedGifts = gifts.filter(g => g.status !== 'available').length;
  const percentageReserved = Math.round((reservedGifts / totalGifts) * 100) || 0;

  // Filtered Gifts
  const filteredGifts = gifts.filter(gift => {
    const matchesSearch = gift.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || gift.category === selectedCategory;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'available' && gift.status === 'available') ||
      (statusFilter === 'reserved' && gift.status !== 'available');

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenGiftModal = (gift: GiftItem) => {
    setSelectedGift(gift);
    setIsAnonymous(false);
    setDonorName('');
    setDonorPhone('');
    setDonorMessage('');
  };

  const handleCloseGiftModal = () => {
    setSelectedGift(null);
  };

  const handleGiftReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGift) return;

    if (!isAnonymous && (!donorName || !donorPhone)) {
      alert('Por favor, preencha os campos obrigatórios ou selecione "Reservar anonimamente".');
      return;
    }

    onReserveGift(selectedGift.id, {
      reservedBy: isAnonymous ? undefined : donorName,
      reservedPhone: isAnonymous ? undefined : donorPhone,
      reservationMessage: isAnonymous ? undefined : donorMessage,
      isAnonymous,
    });

    const giftName = selectedGift.name;
    setSelectedGift(null);
    setSuccessGiftName(giftName);
    
    // Clear success banner after 5 seconds
    setTimeout(() => {
      setSuccessGiftName(null);
    }, 6000);
  };

  return (
    <div className="py-24 px-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-sans tracking-tight font-light text-gray-900 dark:text-gray-100">
          Quem desejar nos <span className="font-serif italic text-rose-600 dark:text-rose-400 font-normal">Presentear ❤️</span>
        </h2>
        <div className="w-12 h-[1px] bg-rose-500 mx-auto mt-4" />
        
        <p className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mt-6 leading-relaxed font-serif italic">
          "Seu carinho e sua presença são os maiores presentes que poderíamos receber. Mas, caso deseje nos ajudar a construir nosso novo lar, preparamos uma lista com alguns itens que ainda precisamos. Muito obrigado por fazer parte deste momento tão especial."
        </p>
      </div>

      {/* Dynamic Statistics Bar (Apple/Zola-like style) */}
      <div className="mb-12 p-6 rounded-3xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h4 className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 font-bold mb-1">Engajamento dos Convidados</h4>
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
            Até agora, <span className="font-bold text-rose-600 dark:text-rose-400">{reservedGifts} de {totalGifts} itens</span> foram reservados ({percentageReserved}%).
          </p>
        </div>
        <div className="flex-1 max-w-md">
          <div className="w-full bg-gray-200 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentageReserved}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Search and Filters panel */}
      <div className="space-y-6 mb-12">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Pesquisar presente por nome..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all shadow-sm"
            />
          </div>

          <div className="flex bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-1 shadow-sm">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${statusFilter === 'all' ? 'bg-rose-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-950'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setStatusFilter('available')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${statusFilter === 'available' ? 'bg-rose-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-950'}`}
            >
              Disponíveis
            </button>
            <button
              onClick={() => setStatusFilter('reserved')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${statusFilter === 'reserved' ? 'bg-rose-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-950'}`}
            >
              Reservados
            </button>
          </div>
        </div>

        {/* Categories Pills scroll */}
        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${!selectedCategory ? 'bg-rose-600 border-rose-600 text-white shadow-sm' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850'}`}
          >
            📋 Todas as Categorias
          </button>
          {GIFT_CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${selectedCategory === category ? 'bg-rose-600 border-rose-600 text-white shadow-sm' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850'}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Success Notification Banner */}
      <AnimatePresence>
        {successGiftName && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="mb-8 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-300 flex items-center gap-3 shadow-md"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div className="text-sm">
              <span className="font-bold">Presente Reservado!</span> O item <span className="italic">"{successGiftName}"</span> foi reservado com carinho no seu nome. Muito obrigado! ❤️
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gifts Grid */}
      {filteredGifts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGifts.map((gift, idx) => (
            <motion.div
              layout
              key={gift.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: Math.min(idx * 0.03, 0.4) }}
              className={`rounded-2xl border p-5 bg-white dark:bg-gray-900 shadow-sm flex flex-col justify-between transition-all ${gift.status !== 'available' ? 'border-gray-200/50 dark:border-gray-800/40 opacity-70' : 'border-gray-100 dark:border-gray-850/60 hover:shadow-md'}`}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 uppercase tracking-widest max-w-[140px] truncate">
                    {gift.category.replace(/[^a-zA-Z0-9\s]/g, '').trim()}
                  </span>
                  
                  {gift.status !== 'available' ? (
                    <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full border border-rose-200/50 dark:border-rose-900/20 text-rose-600 dark:text-rose-400 flex items-center gap-1 bg-rose-50/50 dark:bg-rose-950/20">
                      <Lock className="w-3 h-3" />
                      Reservado
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-900/20 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20">
                      Disponível
                    </span>
                  )}
                </div>

                <h4 className="text-base font-serif font-bold text-gray-800 dark:text-gray-100 mt-2 mb-4 leading-tight">
                  {gift.name}
                </h4>
              </div>

              {/* Action Button */}
              {gift.status === 'available' ? (
                <button
                  onClick={() => handleOpenGiftModal(gift)}
                  className="w-full py-2.5 rounded-xl bg-gray-50 dark:bg-gray-950 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-700 border border-gray-100 dark:border-gray-800 text-rose-600 dark:text-rose-400 font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Gift className="w-3.5 h-3.5" />
                  Quero Presentear
                </button>
              ) : (
                <div className="w-full py-2.5 rounded-xl bg-gray-50/60 dark:bg-gray-950/40 border border-dashed border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-500 font-bold text-xs tracking-wider uppercase text-center flex items-center justify-center gap-1.5 select-none">
                  🎁 Reservado
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Info className="w-8 h-8 text-rose-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 font-medium italic">Nenhum presente encontrado para estes filtros.</p>
        </div>
      )}

      {/* Reservation Modal Backdrop */}
      <AnimatePresence>
        {selectedGift && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative overflow-hidden"
            >
              <button
                onClick={handleCloseGiftModal}
                className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-gray-900 dark:text-white">Presentear os Noivos</h3>
                  <p className="text-xs text-rose-600 dark:text-rose-400">Item: "{selectedGift.name}"</p>
                </div>
              </div>

              <form onSubmit={handleGiftReservation} className="space-y-4">
                {/* Ask if guest wants to identify */}
                <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-2xl border border-gray-100 dark:border-gray-800/80 space-y-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-2">Deseja informar seu nome?</p>
                  
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700 dark:text-gray-300">
                      <input
                        type="radio"
                        checked={!isAnonymous}
                        onChange={() => setIsAnonymous(false)}
                        className="accent-rose-600"
                      />
                      Sim, quero me identificar
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700 dark:text-gray-300">
                      <input
                        type="radio"
                        checked={isAnonymous}
                        onChange={() => setIsAnonymous(true)}
                        className="accent-rose-600"
                      />
                      Reservar anonimamente
                    </label>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {!isAnonymous && (
                    <motion.div
                      key="donor-details"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-bold mb-1">Seu Nome Completo *</label>
                        <input
                          type="text"
                          required={!isAnonymous}
                          value={donorName}
                          onChange={e => setDonorName(e.target.value)}
                          placeholder="Ex: Maria Clara Santos"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-bold mb-1">Seu Telefone *</label>
                        <input
                          type="tel"
                          required={!isAnonymous}
                          value={donorPhone}
                          onChange={e => setDonorPhone(e.target.value)}
                          placeholder="Ex: (61) 99999-9999"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-bold mb-1 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-rose-500" />
                          Mensagem para os Noivos <span className="text-gray-400 font-normal">(Opcional)</span>
                        </label>
                        <textarea
                          value={donorMessage}
                          onChange={e => setDonorMessage(e.target.value)}
                          placeholder="Deixe uma mensagem carinhosa para Laoanny e Gabriel..."
                          rows={3}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500 text-xs resize-none"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={handleCloseGiftModal}
                    className="flex-1 py-3 rounded-xl border border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-bold text-xs tracking-wider uppercase text-center hover:bg-gray-50 dark:hover:bg-gray-950 transition-all cursor-pointer"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs tracking-wider uppercase text-center transition-all cursor-pointer shadow-md shadow-rose-600/10"
                  >
                    Confirmar Reserva
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
