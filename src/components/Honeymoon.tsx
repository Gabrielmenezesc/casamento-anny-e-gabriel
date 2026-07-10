import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, Copy, Check, CreditCard, Heart, Coins, ArrowRight, Sparkles } from 'lucide-react';
import { HoneymoonSettings } from '../types';

interface HoneymoonProps {
  settings: HoneymoonSettings;
  onAddContribution: (name: string, amount: number, message?: string) => void;
}

export default function Honeymoon({ settings, onAddContribution }: HoneymoonProps) {
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Contribution reporting form
  const [donorName, setDonorName] = useState('');
  const [contributedAmount, setContributedAmount] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleCopyPix = () => {
    navigator.clipboard.writeText(settings.pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitContribution = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(contributedAmount);
    if (!donorName || isNaN(amount) || amount <= 0) return;

    onAddContribution(donorName, amount, message || undefined);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDonorName('');
      setContributedAmount('');
      setMessage('');
    }, 4000);
  };

  // Calculate percentage of honeymoon goal reached
  const percentage = Math.min(Math.round((settings.currentAmount / settings.goal) * 100), 100);

  return (
    <div className="py-24 px-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-sans tracking-tight font-light text-gray-900 dark:text-gray-100">
          Nossa <span className="font-serif italic text-rose-600 dark:text-rose-400 font-normal">Lua de Mel</span>
        </h2>
        <div className="w-12 h-[1px] bg-rose-500 mx-auto mt-4" />
        <p className="text-sm text-gray-650 dark:text-gray-300 max-w-2xl mx-auto mt-6 leading-relaxed font-serif italic">
          "{settings.description}"
        </p>
      </div>

      {/* Goal Progress Tracker */}
      <div className="mb-16 p-6 rounded-3xl bg-gradient-to-r from-rose-50 to-amber-50 dark:from-rose-950/20 dark:to-amber-950/10 border border-rose-100/40 dark:border-rose-900/10 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-rose-600 dark:text-rose-400 flex items-center gap-1.5 mb-1">
              <Coins className="w-3.5 h-3.5" />
              Vaquinha da Viagem
            </span>
            <h3 className="text-lg font-serif font-bold text-gray-800 dark:text-gray-100">Meta Lua de Mel</h3>
          </div>
          <div className="text-left md:text-right">
            <span className="text-2xl font-mono font-semibold text-gray-950 dark:text-white">
              R$ {settings.currentAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500 block">
              de R$ {settings.goal.toLocaleString('pt-BR', { minimumFractionDigits: 0 })} arrecadados ({percentage}%)
            </span>
          </div>
        </div>

        <div className="w-full bg-gray-200/60 dark:bg-gray-800 h-3 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        {/* PIX Details */}
        <div className="md:col-span-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col items-center">
          <span className="px-3 py-1 rounded-full text-[10px] uppercase font-mono font-bold tracking-widest bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 mb-6 flex items-center gap-1.5">
            ⚡ Transfira via PIX
          </span>

          {/* Styled vector QR Code representation of their Pix key */}
          <div className="w-48 h-48 bg-white p-3 rounded-2xl border border-gray-200/80 shadow-md flex items-center justify-center relative group">
            {/* Elegant illustrative custom SVG QR Code representing a real QR structure */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-gray-900">
              <rect x="0" y="0" width="25" height="25" fill="currentColor" />
              <rect x="5" y="5" width="15" height="15" fill="white" />
              <rect x="8" y="8" width="9" height="9" fill="currentColor" />

              <rect x="75" y="0" width="25" height="25" fill="currentColor" />
              <rect x="80" y="5" width="15" height="15" fill="white" />
              <rect x="83" y="8" width="9" height="9" fill="currentColor" />

              <rect x="0" y="75" width="25" height="25" fill="currentColor" />
              <rect x="5" y="80" width="15" height="15" fill="white" />
              <rect x="8" y="83" width="9" height="9" fill="currentColor" />

              <rect x="35" y="35" width="30" height="30" fill="currentColor" />
              <rect x="40" y="40" width="20" height="20" fill="white" />
              <rect x="45" y="45" width="10" height="10" fill="currentColor" />

              {/* Random pixels simulating dynamic QR Code matrix data */}
              <rect x="30" y="5" width="5" height="10" fill="currentColor" />
              <rect x="45" y="0" width="10" height="5" fill="currentColor" />
              <rect x="60" y="10" width="10" height="15" fill="currentColor" />
              <rect x="5" y="35" width="15" height="5" fill="currentColor" />
              <rect x="15" y="45" width="10" height="15" fill="currentColor" />
              <rect x="0" y="65" width="5" height="5" fill="currentColor" />
              <rect x="45" y="75" width="15" height="5" fill="currentColor" />
              <rect x="35" y="85" width="10" height="10" fill="currentColor" />
              <rect x="60" y="80" width="5" height="15" fill="currentColor" />
              <rect x="75" y="35" width="10" height="5" fill="currentColor" />
              <rect x="85" y="45" width="15" height="15" fill="currentColor" />
              <rect x="90" y="70" width="10" height="10" fill="currentColor" />
            </svg>
            <div className="absolute inset-0 bg-white/95 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 text-center rounded-2xl">
              <span className="text-[10px] font-semibold text-rose-650 uppercase tracking-widest">Escaneie no app do seu Banco</span>
            </div>
          </div>
          
          <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-2">QR Code Ilustrativo do PIX</span>

          <div className="w-full mt-6 space-y-4">
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 text-center relative overflow-hidden">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 block mb-1">Chave Pix (Telefone)</span>
              <span className="font-mono text-base font-bold text-gray-800 dark:text-gray-100 tracking-wider">
                {settings.pixKey}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopyPix}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copiado!' : 'Copiar Chave PIX'}
              </button>
            </div>
          </div>
        </div>

        {/* Credit Card Details & Contributor Form */}
        <div className="md:col-span-6 space-y-6">
          {/* Card Link box */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-xl">
            <span className="px-3 py-1 rounded-full text-[10px] uppercase font-mono font-bold tracking-widest bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 mb-4 inline-flex items-center gap-1.5">
              💳 Via Cartão de Crédito
            </span>
            <h3 className="text-lg font-serif font-bold text-gray-800 dark:text-gray-100 mb-2">Contribuir por Link de Pagamento</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              Caso prefira parcelar no cartão ou efetuar o pagamento por crédito de forma segura, você pode utilizar o link direto de nossa fatura oficial na InfinitePay.
            </p>

            <a
              href={settings.cardPaymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-xl bg-gray-950 hover:bg-gray-900 dark:bg-white dark:hover:bg-gray-50 text-white dark:text-gray-950 font-semibold uppercase tracking-wider text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              Contribuir com Cartão
            </a>
          </div>

          {/* Record donation form */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Plane className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-serif font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide">Já transferiu? Nos informe!</h3>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Caso tenha efetuado um Pix ou contribuição via link, registre abaixo para adicionarmos ao painel e podermos lhe agradecer pessoalmente!
            </p>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="form-success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/20 text-emerald-800 dark:text-emerald-350 text-xs text-center flex flex-col items-center"
                >
                  <Heart className="w-6 h-6 text-rose-500 animate-pulse mb-2 fill-rose-500" />
                  <span className="font-bold">Notificação enviada!</span> Muito obrigado pelo presente para nossa lua de mel. Seu carinho aquece nossos corações.
                </motion.div>
              ) : (
                <form onSubmit={handleSubmitContribution} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-bold mb-1">Seu Nome *</label>
                      <input
                        type="text"
                        required
                        value={donorName}
                        onChange={e => setDonorName(e.target.value)}
                        placeholder="Ex: Tio João"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-bold mb-1">Valor Contribuído (R$) *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        step="any"
                        value={contributedAmount}
                        onChange={e => setContributedAmount(e.target.value)}
                        placeholder="Ex: 150"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-bold mb-1">Recadinho Carinhoso <span className="text-gray-400 font-normal">(Opcional)</span></label>
                    <textarea
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Deixe um recado especial sobre sua torcida pela nossa viagem..."
                      rows={2}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500 text-xs resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/30 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Registrar Envio de Presente
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
