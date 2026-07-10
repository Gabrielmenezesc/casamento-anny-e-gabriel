import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Lock, LayoutDashboard, Users, Gift, Heart, Coins, LogOut, Search, Trash2, Edit2, Plus, Save, Download, Printer, Settings, Check, RefreshCw
} from 'lucide-react';
import { RSVP, GiftItem, GodparentConfirmation, HoneymoonSettings, AppSettings } from '../types';
import { GIFT_CATEGORIES } from '../initialGifts';

interface AdminPanelProps {
  rsvps: RSVP[];
  gifts: GiftItem[];
  godparents: GodparentConfirmation[];
  honeymoon: HoneymoonSettings;
  appSettings: AppSettings;
  onUpdateGifts: (updatedGifts: GiftItem[]) => void;
  onUpdateRsvps: (updatedRsvps: RSVP[]) => void;
  onUpdateGodparents: (updatedGodparents: GodparentConfirmation[]) => void;
  onUpdateHoneymoon: (updatedHoneymoon: HoneymoonSettings) => void;
  onUpdateAppSettings: (updatedSettings: AppSettings) => void;
}

export default function AdminPanel({
  rsvps, gifts, godparents, honeymoon, appSettings,
  onUpdateGifts, onUpdateRsvps, onUpdateGodparents, onUpdateHoneymoon, onUpdateAppSettings
}: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'stats' | 'rsvps' | 'gifts' | 'godparents' | 'settings'>('stats');

  // Search query states
  const [rsvpSearch, setRsvpSearch] = useState('');
  const [giftSearch, setGiftSearch] = useState('');
  const [godparentSearch, setGodparentSearch] = useState('');

  // Sizing/Creation States
  const [newGiftName, setNewGiftName] = useState('');
  const [newGiftCategory, setNewGiftCategory] = useState(GIFT_CATEGORIES[0]);
  
  // Custom Edit States
  const [editingGiftId, setEditingGiftId] = useState<string | null>(null);
  const [editingGiftName, setEditingGiftName] = useState('');
  const [editingGiftCategory, setEditingGiftCategory] = useState('');
  const [editingGiftStatus, setEditingGiftStatus] = useState<'available' | 'reserved'>('available');

  // Settings Edit form states
  const [editCouple1, setEditCouple1] = useState(appSettings.coupleName1);
  const [editCouple2, setEditCouple2] = useState(appSettings.coupleName2);
  const [editDate, setEditDate] = useState(appSettings.weddingDate);
  const [editTime, setEditTime] = useState(appSettings.weddingTime);
  const [editLocation, setEditLocation] = useState(appSettings.locationName);
  const [editAddress, setEditAddress] = useState(appSettings.locationAddress);
  const [editPixKey, setEditPixKey] = useState(honeymoon.pixKey);
  const [editHoneymoonGoal, setEditHoneymoonGoal] = useState(honeymoon.goal);
  const [editHoneymoonDesc, setEditHoneymoonDesc] = useState(honeymoon.description);
  const [editGodparentsCode, setEditGodparentsCode] = useState(appSettings.godparentsCode || 'padrinho');

  // Stats calculation
  const totalRsvpGuests = rsvps.reduce((acc, curr) => acc + curr.adultsCount + curr.childrenCount, 0);
  const totalRsvpAdults = rsvps.reduce((acc, curr) => acc + curr.adultsCount, 0);
  const totalRsvpChildren = rsvps.reduce((acc, curr) => acc + curr.childrenCount, 0);
  const rsvpsCount = rsvps.length;

  const totalGiftsCount = gifts.length;
  const reservedGiftsCount = gifts.filter(g => g.status === 'reserved').length;
  const deliveredGiftsCount = gifts.filter(g => g.status === 'delivered').length;
  const availableGiftsCount = gifts.filter(g => g.status === 'available').length;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  // RSVPs administration
  const handleDeleteRsvp = (id: string) => {
    if (window.confirm('Excluir esta confirmação permanentemente?')) {
      const updated = rsvps.filter(r => r.id !== id);
      onUpdateRsvps(updated);
    }
  };

  // Godparents administration
  const handleDeleteGodparent = (id: string) => {
    if (window.confirm('Excluir esta confirmação de padrinho permanentemente?')) {
      const updated = godparents.filter(g => g.id !== id);
      onUpdateGodparents(updated);
    }
  };

  // Gifts administration
  const handleAddGift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGiftName.trim()) return;

    const newGift: GiftItem = {
      id: Math.random().toString(36).substring(2, 9),
      name: newGiftName.trim(),
      category: newGiftCategory,
      status: 'available'
    };

    onUpdateGifts([newGift, ...gifts]);
    setNewGiftName('');
    alert('Presente adicionado com sucesso!');
  };

  const handleDeleteGift = (id: string) => {
    if (window.confirm('Deseja realmente remover este item da lista de presentes?')) {
      const updated = gifts.filter(g => g.id !== id);
      onUpdateGifts(updated);
    }
  };

  const handleStartEditGift = (gift: GiftItem) => {
    setEditingGiftId(gift.id);
    setEditingGiftName(gift.name);
    setEditingGiftCategory(gift.category);
    setEditingGiftStatus(gift.status as 'available' | 'reserved');
  };

  const handleSaveGiftEdit = () => {
    if (!editingGiftName.trim()) return;
    const updated = gifts.map(g => {
      if (g.id === editingGiftId) {
        return {
          ...g,
          name: editingGiftName.trim(),
          category: editingGiftCategory,
          status: editingGiftStatus,
          // Clear reservation details if marked as available
          reservedBy: editingGiftStatus === 'available' ? undefined : g.reservedBy,
          reservedPhone: editingGiftStatus === 'available' ? undefined : g.reservedPhone,
          reservationMessage: editingGiftStatus === 'available' ? undefined : g.reservationMessage,
          isAnonymous: editingGiftStatus === 'available' ? undefined : g.isAnonymous
        };
      }
      return g;
    });

    onUpdateGifts(updated);
    setEditingGiftId(null);
    alert('Alterações salvas com sucesso!');
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedAppSettings: AppSettings = {
      ...appSettings,
      coupleName1: editCouple1,
      coupleName2: editCouple2,
      weddingDate: editDate,
      weddingTime: editTime,
      locationName: editLocation,
      locationAddress: editAddress,
      godparentsCode: editGodparentsCode
    };

    const updatedHoneymoon: HoneymoonSettings = {
      ...honeymoon,
      pixKey: editPixKey,
      goal: Number(editHoneymoonGoal),
      description: editHoneymoonDesc
    };

    onUpdateAppSettings(updatedAppSettings);
    onUpdateHoneymoon(updatedHoneymoon);

    alert('Configurações do casamento atualizadas com sucesso!');
  };

  // EXPORTS
  const exportToCSV = (type: 'rsvps' | 'gifts' | 'godparents') => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let filename = '';

    if (type === 'rsvps') {
      headers = ['Nome', 'Telefone', 'Email', 'Adultos', 'Crianças', 'Observações', 'Data Confirmação'];
      rows = rsvps.map(r => [
        r.fullName,
        r.phone,
        r.email || '',
        String(r.adultsCount),
        String(r.childrenCount),
        r.notes || '',
        new Date(r.confirmedAt).toLocaleDateString('pt-BR')
      ]);
      filename = 'Confirmacoes_Presenca.csv';
    } else if (type === 'godparents') {
      headers = ['Nome', 'Telefone', 'Email', 'Presença', 'Tamanho Roupa', 'Tamanho Sapato', 'Acompanhante', 'Restrição Alimentar', 'Mensagem'];
      rows = godparents.map(g => [
        g.fullName,
        g.phone,
        g.email || '',
        g.isConfirmed ? 'Confirmado' : 'Cancelado',
        g.clothingSize,
        g.shoeSize,
        g.companionName || '',
        g.dietaryRestrictions || '',
        g.message || ''
      ]);
      filename = 'Fichas_Padrinhos.csv';
    } else if (type === 'gifts') {
      headers = ['Presente', 'Categoria', 'Status', 'Reservado Por', 'Telefone Reservante', 'Mensagem', 'Anonimo'];
      rows = gifts.map(g => [
        g.name,
        g.category,
        g.status === 'available' ? 'Disponível' : 'Reservado',
        g.reservedBy || '',
        g.reservedPhone || '',
        g.reservationMessage || '',
        g.isAnonymous ? 'Sim' : 'Não'
      ]);
      filename = 'Lista_Presentes_Relatorio.csv';
    }

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter lists
  const filteredRsvps = rsvps.filter(r => r.fullName.toLowerCase().includes(rsvpSearch.toLowerCase()) || r.phone.includes(rsvpSearch));
  const filteredGodparents = godparents.filter(g => g.fullName.toLowerCase().includes(godparentSearch.toLowerCase()) || g.phone.includes(godparentSearch));
  const filteredGifts = gifts.filter(g => g.name.toLowerCase().includes(giftSearch.toLowerCase()) || g.category.toLowerCase().includes(giftSearch.toLowerCase()));

  if (!isAuthenticated) {
    return (
      <div className="py-32 px-4 max-w-md mx-auto text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-6">
          <Lock className="w-8 h-8" />
        </div>
        
        <h2 className="text-3xl font-serif text-gray-900 dark:text-white mb-2">Painel Restrito</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-8 uppercase tracking-widest">Acesso Exclusivo dos Noivos</p>

        <form onSubmit={handleLogin} className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-bold text-left mb-1.5">Insira a Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Senha de Acesso (Digite: admin)"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500 text-sm text-center"
            />
          </div>

          {loginError && (
            <p className="text-xs text-rose-500 font-semibold italic">Senha incorreta. Digite "admin" para testar.</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold uppercase tracking-widest cursor-pointer shadow-md shadow-rose-600/10 transition-colors"
          >
            Entrar no Painel
          </button>
        </form>
        
        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-4 italic">Utilize a senha de demonstração <span className="font-bold underline">admin</span> para testar todos os relatórios e gerenciar dados.</p>
      </div>
    );
  }

  return (
    <div className="py-24 px-4 max-w-7xl mx-auto printable-section">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 border-b border-gray-100 dark:border-gray-800 pb-6 non-printable">
        <div>
          <h2 className="text-3xl font-serif text-gray-900 dark:text-white flex items-center gap-2">
            <LayoutDashboard className="w-8 h-8 text-rose-500" />
            Painel dos Noivos
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Laoanny & Gabriel | Gerenciamento de Dados</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handlePrint}
            className="py-2 px-3.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-850 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4" />
            Imprimir PDF
          </button>
          <button
            onClick={handleLogout}
            className="py-2 px-3.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 mb-10 non-printable">
        <button
          onClick={() => setActiveSubTab('stats')}
          className={`py-2 px-4 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${activeSubTab === 'stats' ? 'bg-rose-600 text-white shadow-sm' : 'bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850'}`}
        >
          📊 Visão Geral & Estatísticas
        </button>
        <button
          onClick={() => setActiveSubTab('rsvps')}
          className={`py-2 px-4 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${activeSubTab === 'rsvps' ? 'bg-rose-600 text-white shadow-sm' : 'bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850'}`}
        >
          👥 Convidados ({rsvps.length})
        </button>
        <button
          onClick={() => setActiveSubTab('godparents')}
          className={`py-2 px-4 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${activeSubTab === 'godparents' ? 'bg-rose-600 text-white shadow-sm' : 'bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850'}`}
        >
          🤵 Padrinhos ({godparents.length})
        </button>
        <button
          onClick={() => setActiveSubTab('gifts')}
          className={`py-2 px-4 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${activeSubTab === 'gifts' ? 'bg-rose-600 text-white shadow-sm' : 'bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850'}`}
        >
          🎁 Presentes ({gifts.length})
        </button>
        <button
          onClick={() => setActiveSubTab('settings')}
          className={`py-2 px-4 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${activeSubTab === 'settings' ? 'bg-rose-600 text-white shadow-sm' : 'bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850'}`}
        >
          ⚙️ Editar Site / Dados
        </button>
      </div>

      {/* TAB CONTENT */}
      <div className="space-y-8">
        
        {/* STATS SUBTAB */}
        {activeSubTab === 'stats' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Numeric Counters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800/80 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Total RSVP</span>
                  <Users className="w-5 h-5 text-rose-500" />
                </div>
                <h3 className="text-3xl font-mono font-bold text-gray-900 dark:text-white">{totalRsvpGuests}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Convidados confirmados ({totalRsvpAdults} adultos, {totalRsvpChildren} crianças)
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800/80 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Padrinhos Fichas</span>
                  <Heart className="w-5 h-5 text-rose-500" />
                </div>
                <h3 className="text-3xl font-mono font-bold text-gray-900 dark:text-white">{godparents.length}</h3>
                <p className="text-xs text-gray-500 mt-1">Fichas de padrinhos/madrinhas respondidas</p>
              </div>

              <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800/80 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Presentes Reservados</span>
                  <Gift className="w-5 h-5 text-rose-500" />
                </div>
                <h3 className="text-3xl font-mono font-bold text-gray-900 dark:text-white">{reservedGiftsCount}</h3>
                <p className="text-xs text-gray-500 mt-1">De {totalGiftsCount} presentes totais ({availableGiftsCount} disponíveis)</p>
              </div>

              <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800/80 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Fundo Lua de Mel</span>
                  <Coins className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="text-3xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  R$ {honeymoon.currentAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </h3>
                <p className="text-xs text-gray-500 mt-1">Meta de R$ {honeymoon.goal.toLocaleString('pt-BR')}</p>
              </div>
            </div>

            {/* Analytical Custom SVG Charts Dashboard (Visual Harmony) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Chart 1: Gifts Status Gauge */}
              <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-widest text-gray-400 mb-1">Status dos Presentes</h4>
                  <p className="text-sm text-gray-500 mb-6">Proporção de itens reservados contra disponíveis</p>
                </div>
                
                <div className="flex items-center justify-around gap-6 h-48">
                  {/* Clean SVG Circular Donut Chart */}
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                      {/* Gray Circle background */}
                      <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="currentColor" strokeWidth="3" className="text-gray-100 dark:text-gray-850" />
                      
                      {/* Accent Circle showing percentage reserved */}
                      {totalGiftsCount > 0 && (
                        <circle
                          cx="18"
                          cy="18"
                          r="15.915"
                          fill="transparent"
                          stroke="#E11D48" // Rose 600
                          strokeWidth="3.2"
                          strokeDasharray={`${(reservedGiftsCount / totalGiftsCount) * 100} ${100 - (reservedGiftsCount / totalGiftsCount) * 100}`}
                          strokeDashoffset="0"
                        />
                      )}
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-2xl font-mono font-bold text-gray-900 dark:text-white">
                        {Math.round((reservedGiftsCount / totalGiftsCount) * 100) || 0}%
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-gray-400">Reservados</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-600 block" />
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Reservados: {reservedGiftsCount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-800 block" />
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Disponíveis: {availableGiftsCount}</span>
                    </div>
                    <div className="border-t border-gray-100 dark:border-gray-800 pt-2 text-[10px] text-gray-400">
                      Total na Lista: {totalGiftsCount}
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart 2: RSVP Growth / Distribution */}
              <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <h4 className="text-xs uppercase font-bold tracking-widest text-gray-400 mb-1">Distribuição de Idade</h4>
                <p className="text-sm text-gray-500 mb-6">Divisão de convidados confirmados por categoria</p>

                <div className="space-y-5 py-4">
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                      <span>Adultos (Buffet Pleno)</span>
                      <span className="font-mono font-bold text-gray-900 dark:text-white">
                        {totalRsvpAdults} ({totalRsvpGuests > 0 ? Math.round((totalRsvpAdults / totalRsvpGuests) * 100) : 0}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-rose-500 h-full rounded-full"
                        style={{ width: `${totalRsvpGuests > 0 ? (totalRsvpAdults / totalRsvpGuests) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                      <span>Crianças (Espaço Kids / Buffet Reduzido)</span>
                      <span className="font-mono font-bold text-gray-900 dark:text-white">
                        {totalRsvpChildren} ({totalRsvpGuests > 0 ? Math.round((totalRsvpChildren / totalRsvpGuests) * 100) : 0}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full"
                        style={{ width: `${totalRsvpGuests > 0 ? (totalRsvpChildren / totalRsvpGuests) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-150 dark:border-gray-800 text-[10px] text-gray-400 leading-relaxed italic">
                    💡 Estas proporções ajudam o buffet do Espaço Villa Rose a preparar com precisão o estoque e as opções de recreação infantil.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RSVPS MANAGEMENT SUBTAB */}
        {activeSubTab === 'rsvps' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
              <div>
                <h3 className="text-xl font-serif text-gray-900 dark:text-white font-bold">Confirmações de Presença</h3>
                <p className="text-xs text-gray-500">Total de {rsvps.length} fichas confirmadas</p>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => exportToCSV('rsvps')}
                  className="py-2 px-3.5 bg-gray-150 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-750 dark:text-gray-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Exportar CSV
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={rsvpSearch}
                onChange={e => setRsvpSearch(e.target.value)}
                placeholder="Pesquisar convidado por nome ou telefone..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white text-sm"
              />
            </div>

            {/* RSVPs Table list */}
            {filteredRsvps.length > 0 ? (
              <div className="border border-gray-100 dark:border-gray-800 rounded-3xl bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-950 text-gray-500 uppercase tracking-wider text-[10px] font-bold border-b border-gray-150 dark:border-gray-800">
                        <th className="p-4">Nome</th>
                        <th className="p-4">Contato</th>
                        <th className="p-4 text-center">Adultos</th>
                        <th className="p-4 text-center">Crianças</th>
                        <th className="p-4">Observações</th>
                        <th className="p-4">Data</th>
                        <th className="p-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
                      {filteredRsvps.map(rsvp => (
                        <tr key={rsvp.id} className="hover:bg-gray-50/40 dark:hover:bg-gray-950/20">
                          <td className="p-4 font-semibold text-gray-900 dark:text-white">{rsvp.fullName}</td>
                          <td className="p-4">
                            <span className="block font-mono text-xs">{rsvp.phone}</span>
                            {rsvp.email && <span className="block text-[11px] text-gray-400">{rsvp.email}</span>}
                          </td>
                          <td className="p-4 text-center font-mono font-bold text-gray-950 dark:text-white">{rsvp.adultsCount}</td>
                          <td className="p-4 text-center font-mono font-bold text-gray-950 dark:text-white">{rsvp.childrenCount}</td>
                          <td className="p-4 text-xs italic text-gray-500 dark:text-gray-400 max-w-xs truncate" title={rsvp.notes}>
                            {rsvp.notes || '-'}
                          </td>
                          <td className="p-4 text-xs font-mono text-gray-400">
                            {new Date(rsvp.confirmedAt).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteRsvp(rsvp.id)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer transition-colors"
                              title="Remover RSVP"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-center py-12 text-sm italic text-gray-400 bg-gray-50 dark:bg-gray-950 rounded-2xl">Nenhum convidado encontrado.</p>
            )}
          </div>
        )}

        {/* GODPARENTS MANAGEMENT TAB */}
        {activeSubTab === 'godparents' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
              <div>
                <h3 className="text-xl font-serif text-gray-900 dark:text-white font-bold">Fichas de Confirmação de Padrinhos</h3>
                <p className="text-xs text-gray-500">Gerenciamento de trajes, acompanhantes e contatos de {godparents.length} padrinhos</p>
              </div>

              <button
                onClick={() => exportToCSV('godparents')}
                className="py-2 px-3.5 bg-gray-150 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-750 dark:text-gray-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Exportar CSV
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={godparentSearch}
                onChange={e => setGodparentSearch(e.target.value)}
                placeholder="Pesquisar padrinho por nome..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white text-sm"
              />
            </div>

            {/* Godparents Confirmation List */}
            {filteredGodparents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredGodparents.map(god => (
                  <div key={god.id} className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4 relative overflow-hidden">
                    {/* Status corner decoration */}
                    <div className="absolute top-0 right-0 p-3 flex gap-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-widest ${god.isConfirmed ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400'}`}>
                        {god.isConfirmed ? 'Confirmado' : 'Não Comparecerá'}
                      </span>
                      <button
                        onClick={() => handleDeleteGodparent(god.id)}
                        className="text-gray-400 hover:text-rose-600 cursor-pointer"
                        title="Excluir padrinho"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <h4 className="text-base font-serif font-bold text-gray-900 dark:text-white max-w-[70%]">{god.fullName}</h4>
                      <p className="text-xs font-mono text-gray-400">{god.phone} {god.email && `| ${god.email}`}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-gray-100 dark:border-gray-800 py-3">
                      <div>👕 Traje/Vestido: <span className="font-bold text-gray-900 dark:text-white">{god.clothingSize}</span></div>
                      <div>👟 Sapato: <span className="font-bold text-gray-900 dark:text-white">{god.shoeSize}</span></div>
                      <div>👥 Acompanhante: <span className="font-semibold">{god.companionName || 'Nenhum'}</span></div>
                      <div>🥗 Alimentos: <span className="font-semibold">{god.dietaryRestrictions || 'Nenhuma'}</span></div>
                    </div>

                    {god.message && (
                      <div className="p-3 bg-gray-50 dark:bg-gray-950 text-xs italic rounded-xl text-gray-500 dark:text-gray-400 leading-relaxed">
                        "{god.message}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-12 text-sm italic text-gray-400 bg-gray-50 dark:bg-gray-950 rounded-2xl">Nenhuma ficha de padrinho encontrada.</p>
            )}
          </div>
        )}

        {/* GIFTS LIST MANAGEMENT TAB */}
        {activeSubTab === 'gifts' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Split layout: Gift creation form vs lists of current gifts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Add New Gift Form */}
              <div className="lg:col-span-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-md space-y-4">
                <h4 className="text-sm uppercase font-bold tracking-wider text-gray-450 dark:text-gray-500 mb-2">➕ Novo Item de Presente</h4>
                
                <form onSubmit={handleAddGift} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-1">Nome do Item *</label>
                    <input
                      type="text"
                      required
                      value={newGiftName}
                      onChange={e => setNewGiftName(e.target.value)}
                      placeholder="Ex: Micro-ondas Digital"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-1">Categoria *</label>
                    <select
                      value={newGiftCategory}
                      onChange={e => setNewGiftCategory(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-sm text-gray-900 dark:text-white focus:outline-none"
                    >
                      {GIFT_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gray-950 hover:bg-gray-900 dark:bg-white dark:hover:bg-gray-50 text-white dark:text-gray-950 rounded-xl text-xs font-semibold uppercase tracking-widest cursor-pointer transition-all"
                  >
                    Adicionar à Lista
                  </button>
                </form>
              </div>

              {/* Gift Management Search and Edit List */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-gray-900 dark:text-white">Gerenciar Itens da Lista</h3>
                    <p className="text-xs text-gray-500">Pesquise, edite, cancele reservas, ou exclua itens da lista de presentes</p>
                  </div>

                  <button
                    onClick={() => exportToCSV('gifts')}
                    className="py-2 px-3.5 bg-gray-150 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-755 dark:text-gray-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Exportar Lista
                  </button>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={giftSearch}
                    onChange={e => setGiftSearch(e.target.value)}
                    placeholder="Pesquisar presente por nome ou categoria..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white text-sm"
                  />
                </div>

                {/* Edit details form overlay */}
                {editingGiftId && (
                  <div className="p-4 bg-rose-50/40 dark:bg-rose-950/10 border border-rose-100/50 dark:border-rose-900/20 rounded-2xl space-y-4">
                    <h4 className="text-xs uppercase font-bold text-rose-700 dark:text-rose-400">📝 Editando Item selecionado</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={editingGiftName}
                        onChange={e => setEditingGiftName(e.target.value)}
                        placeholder="Nome do presente"
                        className="px-3 py-2 bg-white dark:bg-gray-950 text-xs rounded-xl border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
                      />
                      <select
                        value={editingGiftCategory}
                        onChange={e => setEditingGiftCategory(e.target.value)}
                        className="px-3 py-2 bg-white dark:bg-gray-950 text-xs rounded-xl border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
                      >
                        {GIFT_CATEGORIES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <select
                        value={editingGiftStatus}
                        onChange={e => setEditingGiftStatus(e.target.value as 'available' | 'reserved')}
                        className="px-3 py-2 bg-white dark:bg-gray-950 text-xs rounded-xl border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="available">Disponível</option>
                        <option value="reserved">Reservado</option>
                      </select>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setEditingGiftId(null)}
                        className="py-1 px-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-semibold cursor-pointer text-gray-500"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSaveGiftEdit}
                        className="py-1 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Salvar
                      </button>
                    </div>
                  </div>
                )}

                {/* Gifts admin rendering list */}
                {filteredGifts.length > 0 ? (
                  <div className="border border-gray-150 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 overflow-hidden">
                    <div className="overflow-y-auto max-h-[500px]">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-gray-50 dark:bg-gray-950 text-gray-500 uppercase tracking-widest font-bold border-b border-gray-100 dark:border-gray-800">
                            <th className="p-3">Presente</th>
                            <th className="p-3">Categoria</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Quem reservou</th>
                            <th className="p-3">Recado</th>
                            <th className="p-3 text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                          {filteredGifts.map(gift => (
                            <tr key={gift.id} className="hover:bg-gray-50/30 dark:hover:bg-gray-950/10">
                              <td className="p-3 font-semibold text-gray-850 dark:text-white">{gift.name}</td>
                              <td className="p-3 text-gray-400">{gift.category.replace(/[^a-zA-Z0-9\s]/g, '')}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-widest ${gift.status === 'available' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                  {gift.status === 'available' ? 'Disponível' : 'Reservado'}
                                </span>
                              </td>
                              <td className="p-3">
                                {gift.status !== 'available' ? (
                                  <div>
                                    <span className="font-bold text-gray-900 dark:text-white">
                                      {gift.isAnonymous ? 'Anônimo' : gift.reservedBy || '-'}
                                    </span>
                                    {gift.reservedPhone && (
                                      <span className="block text-[10px] text-gray-400 font-mono">{gift.reservedPhone}</span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                              <td className="p-3 italic text-gray-400 max-w-xs truncate" title={gift.reservationMessage}>
                                {gift.reservationMessage || '-'}
                              </td>
                              <td className="p-3 text-right flex gap-1 justify-end">
                                <button
                                  onClick={() => handleStartEditGift(gift)}
                                  className="p-1 rounded bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-rose-500 cursor-pointer"
                                  title="Editar item"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteGift(gift.id)}
                                  className="p-1 rounded bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-rose-500 cursor-pointer"
                                  title="Excluir item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <p className="text-center py-10 italic text-gray-400">Nenhum presente atende à busca.</p>
                )}
              </div>

            </div>
          </div>
        )}

        {/* WEBSITE DATA SETTINGS SUBTAB */}
        {activeSubTab === 'settings' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-md animate-fadeIn">
            <h3 className="text-lg font-serif font-bold text-gray-900 dark:text-white mb-2">Editar Parâmetros Globais do Casamento</h3>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed uppercase tracking-wider">Configure textos, datas, valores e chave PIX exibidos no site</p>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 mb-1">Nome Convidado 1</label>
                  <input
                    type="text"
                    required
                    value={editCouple1}
                    onChange={e => setEditCouple1(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 mb-1">Nome Convidado 2</label>
                  <input
                    type="text"
                    required
                    value={editCouple2}
                    onChange={e => setEditCouple2(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 mb-1">Data do Casamento (AAAA-MM-DD)</label>
                  <input
                    type="date"
                    required
                    value={editDate}
                    onChange={e => setEditDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 mb-1">Horário (HH:MM)</label>
                  <input
                    type="text"
                    required
                    value={editTime}
                    onChange={e => setEditTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 mb-1">Nome do Local</label>
                  <input
                    type="text"
                    required
                    value={editLocation}
                    onChange={e => setEditLocation(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 mb-1">Endereço Completo</label>
                  <input
                    type="text"
                    required
                    value={editAddress}
                    onChange={e => setEditAddress(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 mb-1">Chave PIX (Telefone)</label>
                  <input
                    type="text"
                    required
                    value={editPixKey}
                    onChange={e => setEditPixKey(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 mb-1">Meta Financeira Lua de Mel (R$)</label>
                  <input
                    type="number"
                    required
                    value={editHoneymoonGoal}
                    onChange={e => setEditHoneymoonGoal(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 mb-1">Código de Acesso dos Padrinhos</label>
                  <input
                    type="text"
                    required
                    value={editGodparentsCode}
                    onChange={e => setEditGodparentsCode(e.target.value)}
                    placeholder="Ex: padrinho"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-xs font-semibold"
                  />
                  <p className="text-[10px] text-gray-400 mt-1 italic">Este código restringe o acesso à página exclusiva dos padrinhos.</p>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 mb-1">Texto Descritivo Lua de Mel</label>
                <textarea
                  value={editHoneymoonDesc}
                  onChange={e => setEditHoneymoonDesc(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-xs resize-none"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                <button
                  type="submit"
                  className="py-3 px-6 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold uppercase tracking-widest cursor-pointer shadow-md shadow-rose-600/10 transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  Salvar Configurações
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
