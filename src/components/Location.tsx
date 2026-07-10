import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Clock, Calendar, ExternalLink, Navigation, Compass } from 'lucide-react';

interface LocationProps {
  settings: {
    locationName: string;
    locationAddress: string;
    locationMapUrl: string;
    locationMapIframeUrl: string;
  };
}

export default function Location({ settings }: LocationProps) {
  return (
    <div className="py-24 px-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-sans tracking-tight font-light text-gray-900 dark:text-gray-100">
          Como <span className="font-serif italic text-rose-600 dark:text-rose-400 font-normal">Chegar</span>
        </h2>
        <div className="w-12 h-[1px] bg-rose-500 mx-auto mt-4" />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 uppercase tracking-widest">Local do Nosso Sonho</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        {/* Detail cards */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-xl flex-1 space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 font-bold">Endereço</h4>
                <h3 className="text-lg font-serif font-bold text-gray-800 dark:text-gray-200 mt-1">{settings.locationName}</h3>
                <p className="text-sm text-gray-650 dark:text-gray-350 mt-1 leading-relaxed">
                  {settings.locationAddress}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 font-bold">Data & Horário</h4>
                <p className="text-base font-serif font-bold text-gray-800 dark:text-gray-200 mt-1">25 de Abril de 2027</p>
                <p className="text-sm text-gray-650 dark:text-gray-350 mt-0.5">Pontualmente às 15:00 horas</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 font-bold">Dica de Traje</h4>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-1">Esporte Fino / Social</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  Recomendamos calçados confortáveis para aproveitar o jardim e a pista de dança do Espaço Villa Rose.
                </p>
              </div>
            </div>
          </div>

          <a
            href={settings.locationMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-4 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-semibold uppercase tracking-wider text-xs transition-all shadow-md shadow-rose-600/10 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Navigation className="w-4 h-4 fill-white" />
            Abrir no Google Maps
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Live Embed map Frame */}
        <div className="lg:col-span-7 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-4 shadow-xl h-96 md:h-auto min-h-[350px] relative overflow-hidden flex flex-col">
          {/* Map iframe */}
          <iframe
            title="Mapa Espaço Villa Rose"
            src={settings.locationMapIframeUrl}
            className="w-full h-full rounded-2xl border-0 flex-1"
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
