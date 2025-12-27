
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  FileText, 
  ChevronRight, 
  Filter, 
  LayoutGrid, 
  List, 
  X, 
  ChevronDown, 
  CheckCircle2, 
  Hash,
  Target,
  ArrowRight
} from 'lucide-react';
import { Evento, EventVersion, EventApplication } from '../types';

interface DashboardProps {
  events: Evento[];
  versions: EventVersion[];
}

export const Dashboard: React.FC<DashboardProps> = ({ events, versions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  const [filterApp, setFilterApp] = useState<EventApplication | 'todos'>('todos');
  const [filterStatus, setFilterStatus] = useState<'ativos' | 'inativos' | 'todos'>('todos');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    events.forEach(e => e.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [events]);

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         e.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesApp = filterApp === 'todos' || e.aplicacao_evento === filterApp;
    const matchesStatus = filterStatus === 'todos' || (filterStatus === 'ativos' ? e.ativo : !e.ativo);
    const matchesTags = selectedTags.length === 0 || selectedTags.every(t => e.tags.includes(t));
    return matchesSearch && matchesApp && matchesStatus && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const clearFilters = () => {
    setFilterApp('todos');
    setFilterStatus('todos');
    setSelectedTags([]);
    setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Eventos de Folha</h2>
          <p className="text-slate-500 font-medium">Gestão técnica de regras e interdependências</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-1 flex shadow-sm">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List size={20} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid size={20} />
            </button>
          </div>
          <Link 
            to="/eventos/novo"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-xl shadow-indigo-100 transition-all font-bold"
          >
            <Plus size={20} />
            Novo Evento
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/30 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Busque pelo nome ou código técnico..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-2xl border transition-all ${showAdvanced ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <Filter size={18} />
              Filtros
              <ChevronDown size={14} className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showAdvanced && (
            <div className="p-6 bg-white border border-slate-100 rounded-2xl space-y-6 animate-in slide-in-from-top-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Aplicação Técnica</label>
                  <div className="flex flex-wrap gap-2">
                    {['todos', 'proventos', 'descontos', 'informativo', 'base_calculo'].map(app => (
                      <button
                        key={app}
                        onClick={() => setFilterApp(app as any)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${filterApp === app ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'}`}
                      >
                        {app === 'todos' ? 'Todos' : app.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Status</label>
                  <div className="flex gap-2">
                    {['todos', 'ativos', 'inativos'].map(st => (
                      <button
                        key={st}
                        onClick={() => setFilterStatus(st as any)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${filterStatus === st ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'}`}
                      >
                        {st.charAt(0).toUpperCase() + st.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Tags Relacionadas</label>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-2">
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-2 py-1 text-[10px] font-bold rounded-md border transition-all ${selectedTags.includes(tag) ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-50">
                <button onClick={clearFilters} className="text-xs font-bold text-rose-500 flex items-center gap-1 hover:underline">
                  <X size={14} /> Limpar Filtros
                </button>
              </div>
            </div>
          )}
        </div>

        {viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                  <th className="px-8 py-4">Evento (Cód / Nome)</th>
                  <th className="px-8 py-4">Aplicação</th>
                  <th className="px-8 py-4">Vigência</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredEvents.map(event => {
                  const version = versions.find(v => v.id === event.versao_vigente_id);
                  return (
                    <tr key={event.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-black text-[10px] shadow-sm ${event.aplicacao_evento === 'proventos' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            {event.codigo}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{event.nome}</p>
                            <div className="flex gap-1 mt-1">
                              {event.tags.slice(0, 2).map(t => <span key={t} className="text-[9px] font-bold text-slate-400">#{t}</span>)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-xs font-bold text-slate-500 uppercase">{event.aplicacao_evento.replace('_', ' ')}</td>
                      <td className="px-8 py-5">
                        {version ? <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-black">v{version.numero_versao}</span> : <span className="text-xs text-slate-300 italic">Rascunho</span>}
                      </td>
                      <td className="px-8 py-5">
                        <div className={`w-2.5 h-2.5 rounded-full ${event.ativo ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      </td>
                      <td className="px-8 py-5 text-right">
                        <Link to={`/eventos/${event.id}/gerenciar`} className="p-2 bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white rounded-xl transition-all inline-block">
                          <ArrowRight size={20} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map(event => (
              <div key={event.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-xl hover:border-indigo-200 transition-all group flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 rounded-lg font-black text-[10px] ${event.aplicacao_evento === 'proventos' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {event.codigo}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${event.ativo ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                </div>
                <h3 className="font-bold text-slate-800 text-sm mb-2 group-hover:text-indigo-600 transition-colors min-h-[40px] leading-tight">{event.nome}</h3>
                <p className="text-[10px] text-slate-500 line-clamp-2 mb-4 flex-1 italic">{event.descricao}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {event.tags.slice(0, 3).map(t => <span key={t} className="px-1.5 py-0.5 bg-slate-50 text-slate-400 text-[9px] font-bold rounded uppercase">{t}</span>)}
                </div>
                <Link to={`/eventos/${event.id}/gerenciar`} className="w-full py-2 bg-slate-50 text-slate-600 group-hover:bg-indigo-600 group-hover:text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2">
                  Ver Detalhes <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        )}
        
        {filteredEvents.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center gap-4">
            <FileText size={48} className="text-slate-100" />
            <p className="text-slate-400 font-bold">Nenhum evento corresponde aos filtros.</p>
          </div>
        )}
      </div>
    </div>
  );
};
