import React from 'react';
import { motion } from 'motion/react';
import { Heart, Camera, Calendar, Award, Sparkles, MapPin } from 'lucide-react';

export default function About() {
  const timelineEvents = [
    {
      year: '2021',
      title: 'O Primeiro Encontro',
      description: 'O destino deu uma ajudinha e nossos caminhos se cruzaram pela primeira vez. Uma conversa despretensiosa que parecia não ter fim, e a certeza imediata de que algo muito especial estava começando.',
      icon: Sparkles,
      color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
    },
    {
      year: '2023',
      title: 'O Início do Namoro',
      description: 'Entre risadas compartilhadas, viagens de fim de semana e o apoio mútuo no dia a dia, decidimos dar o próximo passo. O pedido oficial veio cercado de cumplicidade e muito amor.',
      icon: Heart,
      color: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
    },
    {
      year: '2025',
      title: 'O Pedido de Casamento',
      description: 'Um momento mágico, planejado nos mínimos detalhes. Com o coração acelerado e a certeza do futuro, dissemos o "Sim" mais importante das nossas vidas rumo à construção da nossa família.',
      icon: Award,
      color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
    },
    {
      year: '2027',
      title: 'O Grande Dia',
      description: 'O início do nosso felizes para sempre. Dia de celebrar todo o nosso caminho e brindar o amor cercados pelas pessoas que mais amamos nesta vida.',
      icon: Calendar,
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
    }
  ];

  const galleryItems = [
    { title: 'Primeiro Ano Juntos', date: 'Julho de 2022', desc: 'Sempre lado a lado.', emoji: '✨' },
    { title: 'O Pedido de Casamento', date: 'Novembro de 2025', desc: 'O "Sim" inesquecível.', emoji: '💍' },
    { title: 'Nossa Primeira Viagem', date: 'Janeiro de 2024', desc: 'Colecionando memórias pelo mundo.', emoji: '✈️' },
    { title: 'Momentos Simples', date: 'Rotina de Domingo', desc: 'Onde o amor mora nos detalhes.', emoji: '🏡' },
  ];

  return (
    <div className="py-24 px-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-sans tracking-tight font-light text-gray-900 dark:text-gray-100">
          Nossa <span className="font-serif italic text-rose-600 dark:text-rose-400 font-normal">História</span>
        </h2>
        <div className="w-12 h-[1px] bg-rose-500 mx-auto mt-4" />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 uppercase tracking-widest">Laoanny & Gabriel</p>
      </div>

      {/* Main Couple Profile Frame (CSS/SVG illustration + intro message) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center mb-24">
        <div className="md:col-span-5 flex justify-center">
          {/* Elegant Artistic Glassmorphism frame as portrait */}
          <div className="relative w-72 h-96 rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-gradient-to-tr from-rose-100 to-amber-50 dark:from-rose-950/30 dark:to-gray-900 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-white/20 dark:bg-black/10 backdrop-blur-[2px]" />
            <div className="relative z-10 flex flex-col items-center text-center p-6 bg-white/80 dark:bg-gray-950/80 rounded-2xl border border-white/40 shadow-xl max-w-[90%]">
              <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950 flex items-center justify-center mb-4 text-rose-600 dark:text-rose-400">
                <Heart className="w-8 h-8 fill-rose-500 text-rose-500" />
              </div>
              <h4 className="text-xl font-serif text-gray-800 dark:text-gray-100">Laoanny & Gabriel</h4>
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1">25.04.2027</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 italic">"O amor não consiste em olhar um para o outro, mas sim em olhar juntos na mesma direção."</p>
            </div>
            {/* Subtle light effect */}
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-amber-200/40 dark:bg-amber-950/20 rounded-full blur-2xl" />
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-rose-200/40 dark:bg-rose-950/20 rounded-full blur-2xl" />
          </div>
        </div>

        <div className="md:col-span-7 flex flex-col justify-center">
          <h3 className="text-2xl font-serif text-gray-800 dark:text-gray-200 mb-6">Aos nossos queridos convidados,</h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            É com imensa alegria que abrimos nosso coração e nosso site para vocês! Criamos este espaço para compartilhar cada detalhe do nosso grande sonho. O casamento é a união de duas vidas, mas também a celebração da nossa história ao lado daqueles que tanto amamos.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
            Aqui vocês encontrarão informações sobre o local da cerimônia, lista de presentes, confirmação de presença (RSVP) e as formas de nos ajudar na realização de nossa inesquecível viagem de Lua de Mel.
          </p>
          <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-950 text-rose-800 dark:text-rose-300 text-sm italic font-serif shadow-inner">
            "Sua presença e seu carinho são os nossos maiores presentes. Mal podemos esperar para abraçar cada um de vocês em Brasília!"
          </div>
        </div>
      </div>

      {/* Relationship Interactive Timeline */}
      <div className="mb-24">
        <h3 className="text-2xl font-serif text-center text-gray-800 dark:text-gray-100 mb-12">Nossa Linha do Tempo</h3>
        
        <div className="relative border-l border-gray-200 dark:border-gray-800 ml-4 md:ml-32 md:mr-32">
          {timelineEvents.map((event, index) => {
            const IconComponent = event.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="mb-12 ml-6 relative"
              >
                {/* Timeline dot */}
                <span className={`absolute -left-[38px] top-1 flex items-center justify-center w-8 h-8 rounded-full ring-4 ring-white dark:ring-gray-950 ${event.color}`}>
                  <IconComponent className="w-4 h-4" />
                </span>
                
                <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">{event.year}</span>
                  <h4 className="text-lg font-serif font-bold text-gray-800 dark:text-gray-200 mt-1 mb-2">{event.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{event.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Memory Gallery */}
      <div>
        <div className="flex items-center justify-center gap-3 mb-10">
          <Camera className="w-5 h-5 text-rose-500" />
          <h3 className="text-2xl font-serif text-gray-800 dark:text-gray-100">Galeria de Memórias</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryItems.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6 }}
              className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-white/60 dark:bg-gray-900/40 backdrop-blur-md shadow-sm flex flex-col justify-between h-48 group cursor-pointer relative overflow-hidden"
            >
              {/* Overlay gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex justify-between items-start z-10">
                <span className="text-3xl">{item.emoji}</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500">{item.date}</span>
              </div>
              <div className="z-10 mt-4">
                <h4 className="text-base font-serif text-gray-800 dark:text-gray-200 font-bold group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">{item.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
