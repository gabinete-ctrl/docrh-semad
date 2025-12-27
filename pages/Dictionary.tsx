
import React, { useState, useMemo } from 'react';
import { Evento, EventVersion } from '../types';
import { BookText, Search, ChevronRight, Hash, Tag, Target, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DictionaryProps {
  events: Evento[];
  versions: EventVersion[];
}

export const Dictionary: React.FC<DictionaryProps> = ({ events, versions }) => {
  const [search, setSearch] = useState('');

  const filteredEvents = useMemo(() => {
    return events.filter(e => 
      e.nome.toLowerCase().includes(search.toLowerCase()) ||
      e.codigo.toLowerCase().includes(search.toLowerCase()) ||
      e.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    );
  }, [events, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 text-indigo-600">
            <BookText size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Dicionário de Eventos</h2>
            <p className="text-slate-500 text-sm">Consulte definições e resultados esperados de toda a folha</p>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text"
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-3xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-lg"
          placeholder="Pesquise por nome, código ou palavra-chave..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredEvents.map(event => {
          const publishedVersion = versions.find(v => v.id === event.versao_vigente_id);
          const rules = publishedVersion?.snapshot_json.rules;

          return (
            <div key={event.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:border-indigo-200 transition-all group">
              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-600">
                    <Hash size={16} />
                    <span className="font-black text-xl">{event.codigo}</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight">
                    {event.nome}
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {event.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex-1 space-y-4 md:border-l md:border-slate-50 md:pl-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <FileText size={10} /> Descrição Técnica
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium italic">
                      {event.descricao}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Target size={10} className="text-emerald-500" /> Resultado Esperado
                    </p>
                    <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                      <p className="text-xs text-emerald-800 font-bold">
                        {rules?.expectedResults || event.resumo_resultado_esperado || "Nenhum resultado detalhado cadastrado."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center md:px-4">
                   <Link 
                    to={`/eventos/${event.id}/gerenciar`}
                    className="p-3 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                   >
                     <ChevronRight size={24} />
                   </Link>
                </div>
              </div>
            </div>
          );
        })}

        {filteredEvents.length === 0 && (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <BookText size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold">Nenhum termo encontrado no dicionário.</p>
          </div>
        )}
      </div>
    </div>
  );
};
