import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ClipboardList, HelpCircle, Search, Edit3, Trash2, CalendarDays } from 'lucide-react';
import { RSVP } from '../types';

interface RsvpProps {
  rsvps: RSVP[];
  onAddRsvp: (rsvp: RSVP) => void;
  onUpdateRsvp: (rsvp: RSVP) => void;
  onDeleteRsvp: (id: string) => void;
}

export default function Rsvp({ rsvps, onAddRsvp, onUpdateRsvp, onDeleteRsvp }: RsvpProps) {
  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [adultsCount, setAdultsCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [notes, setNotes] = useState('');

  // Statuses
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Edit & Search State
  const [searchPhone, setSearchPhone] = useState('');
  const [searchResult, setSearchResult] = useState<RSVP | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    setSubmitting(true);
    setTimeout(() => {
      if (isEditing && editId) {
        const updated: RSVP = {
          id: editId,
          fullName,
          phone,
          email: email || undefined,
          adultsCount,
          childrenCount,
          notes: notes || undefined,
          confirmedAt: new Date().toISOString(),
        };
        onUpdateRsvp(updated);
        setIsEditing(false);
        setEditId(null);
      } else {
        const newRsvp: RSVP = {
          id: Math.random().toString(36).substring(2, 9),
          fullName,
          phone,
          email: email || undefined,
          adultsCount,
          childrenCount,
          notes: notes || undefined,
          confirmedAt: new Date().toISOString(),
        };
        onAddRsvp(newRsvp);
      }
      setSubmitting(false);
      setSubmitted(true);
      resetForm();
    }, 800);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    const cleanSearch = searchPhone.replace(/\D/g, '');
    const found = rsvps.find(r => r.phone.replace(/\D/g, '') === cleanSearch || r.phone.includes(searchPhone));
    
    if (found) {
      setSearchResult(found);
    } else {
      setSearchResult(null);
    }
  };

  const handleEdit = (rsvp: RSVP) => {
    setFullName(rsvp.fullName);
    setPhone(rsvp.phone);
    setEmail(rsvp.email || '');
    setAdultsCount(rsvp.adultsCount);
    setChildrenCount(rsvp.childrenCount);
    setNotes(rsvp.notes || '');
    setIsEditing(true);
    setEditId(rsvp.id);
    setSearchResult(null);
    setSearchPhone('');
    setSubmitted(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Deseja realmente cancelar esta confirmação de presença?')) {
      onDeleteRsvp(id);
      setSearchResult(null);
      setSearchPhone('');
      alert('Presença cancelada com sucesso.');
    }
  };

  const resetForm = () => {
    setFullName('');
    setPhone('');
    setEmail('');
    setAdultsCount(1);
    setChildrenCount(0);
    setNotes('');
  };

  return (
    <div className="py-24 px-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-sans tracking-tight font-light text-gray-900 dark:text-gray-100">
          Confirmar <span className="font-serif italic text-rose-600 dark:text-rose-400 font-normal">Presença</span>
        </h2>
        <div className="w-12 h-[1px] bg-rose-500 mx-auto mt-4" />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 uppercase tracking-widest">Responda Por Favor (RSVP)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Main form card */}
        <div className="md:col-span-7 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
          {/* Accent decoration */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 to-amber-500" />
          
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
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif text-gray-900 dark:text-white mb-3">Presença Confirmada!</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-8">
                  Obrigado! Sua presença foi confirmada com sucesso. Mal podemos esperar para curtir esse momento maravilhoso com você!
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2 rounded-xl text-xs font-semibold uppercase tracking-widest text-rose-600 border border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                >
                  Confirmar Outro Convidado
                </button>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center gap-2 mb-6">
                  <ClipboardList className="w-5 h-5 text-rose-500" />
                  <h3 className="text-lg font-serif text-gray-800 dark:text-gray-200 font-bold">
                    {isEditing ? 'Editar Minha Confirmação' : 'Formulário de Confirmação'}
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-1.5">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="Ex: Maria Souza Santos"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-1.5">
                        Telefone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="Ex: (61) 99999-9999"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-1.5">
                        E-mail <span className="text-gray-400 font-normal">(Opcional)</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Ex: maria@exemplo.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-1.5">
                        Adultos
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setAdultsCount(Math.max(1, adultsCount - 1))}
                          className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-mono text-base font-bold text-gray-800 dark:text-gray-200">
                          {adultsCount}
                        </span>
                        <button
                          type="button"
                          onClick={() => setAdultsCount(adultsCount + 1)}
                          className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-1.5">
                        Crianças
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                          className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-mono text-base font-bold text-gray-800 dark:text-gray-200">
                          {childrenCount}
                        </span>
                        <button
                          type="button"
                          onClick={() => setChildrenCount(childrenCount + 1)}
                          className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-1.5">
                      Observações / Restrição Alimentar
                    </label>
                    <textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Alguma restrição de alimentação ou observação especial?"
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold uppercase tracking-wider text-sm transition-all shadow-md shadow-rose-600/10 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? 'Confirmando...' : isEditing ? 'Salvar Alterações' : 'CONFIRMAR PRESENÇA'}
                  </button>

                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setEditId(null);
                        resetForm();
                      }}
                      className="w-full py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 transition-all cursor-pointer"
                    >
                      Cancelar Edição
                    </button>
                  )}
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search & Manage section */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-serif font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide">Consultar Minha Presença</h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
              Já enviou sua confirmação e quer verificar ou realizar alterações/cancelamento? Busque pelo seu telefone abaixo.
            </p>

            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                required
                value={searchPhone}
                onChange={e => setSearchPhone(e.target.value)}
                placeholder="DDD + Telefone"
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gray-900 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Buscar
              </button>
            </form>

            {/* Search results display */}
            {isSearching && (
              <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
                {searchResult ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-rose-50/40 dark:bg-rose-950/10 border border-rose-100/50 dark:border-rose-900/20">
                      <p className="text-xs text-gray-400 uppercase tracking-widest font-mono">Confirmado em nosso RSVP</p>
                      <h4 className="text-base font-serif font-bold text-gray-800 dark:text-gray-100 mt-1 mb-2">
                        {searchResult.fullName}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300">
                        <div>👨 Adults: <span className="font-bold">{searchResult.adultsCount}</span></div>
                        <div>🧒 Kids: <span className="font-bold">{searchResult.childrenCount}</span></div>
                      </div>
                      {searchResult.notes && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-2 border-t border-rose-100/30 pt-2">
                          Obs: "{searchResult.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(searchResult)}
                        className="flex-1 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Editar Dados
                      </button>
                      <button
                        onClick={() => handleDelete(searchResult.id)}
                        className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Excluir
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-medium italic">
                    Nenhuma confirmação encontrada para esse telefone. Caso ainda não tenha feito, por favor utilize o formulário ao lado.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Guidelines box */}
          <div className="p-6 rounded-3xl border border-gray-100 dark:border-gray-800/80 bg-white/60 dark:bg-gray-900/40 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-3">
              <CalendarDays className="w-4 h-4 text-rose-500" />
              <h4 className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 font-bold">Por que confirmar?</h4>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              O buffet, as bebidas e o dimensionamento do Espaço Villa Rose estão sendo calculados de forma muito precisa para receber a todos com o maior conforto e sofisticação possível. 
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mt-2 font-semibold">
              Pedimos a gentileza de responder até o dia 10 de Março de 2027.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
