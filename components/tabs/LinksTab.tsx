
import React, { useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { SnapshotJSON, Link as LinkType, Evento, EventVersion } from '../../types';
import { 
  GitBranch, 
  Search, 
  Trash2, 
  Plus, 
  X,
  ChevronRight,
  ArrowRightLeft,
  Layers,
  Zap,
  ShieldAlert,
  Network,
  List as ListIcon,
  ChevronDown
} from 'lucide-react';

interface LinksTabProps {
  snapshot: SnapshotJSON;
  isReadOnly: boolean;
  onUpdate: (snapshot: SnapshotJSON) => void;
  events: Evento[];
  allVersions: EventVersion[];
}

export const LinksTab: React.FC<LinksTabProps> = ({ snapshot, isReadOnly, onUpdate, events, allVersions }) => {
  const { id: currentEventId } = useParams();
  const [viewMode, setViewMode] = useState<'direct' | 'hierarchy'>('direct');
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newLink, setNewLink] = useState<Partial<LinkType>>({
    type: 'CHAMA',
    observation: ''
  });

  const availableEvents = events.filter(e => 
    e.id !== currentEventId && (
      e.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
      e.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleAddLink = () => {
    if (!newLink.destinationId || !currentEventId) return;

    const links = snapshot.links || [];
    if (links.some(l => l.destinationId === newLink.destinationId && l.type === newLink.type)) {
      alert('Este vínculo já existe.');
      return;
    }

    const link: LinkType = {
      id: crypto.randomUUID(),
      originId: currentEventId,
      destinationId: newLink.destinationId,
      type: newLink.type as any,
      observation: newLink.observation || ''
    };

    onUpdate({ ...snapshot, links: [...links, link] });
    setShowAddForm(false);
    setNewLink({ type: 'CHAMA', observation: '' });
  };

  const removeLink = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onUpdate({ ...snapshot, links: (snapshot.links || []).filter(l => l.id !== id) });
  };

  const links = snapshot.links || [];
  const currentEvent = events.find(e => e.id === currentEventId);

  // Função para renderizar a árvore de dependências recursivamente
  const renderDependencyTree = (targetId: string, depth: number = 0, visited: Set<string> = new Set()) => {
    if (depth > 5 || visited.has(targetId)) {
      if (visited.has(targetId)) return (
        <div key={`loop-${targetId}`} className="ml-8 p-2 border-l-2 border-dashed border-rose-200 text-rose-400 text-[10px] font-bold italic">
          ⚠️ Referência Circular Detectada
        </div>
      );
      return null;
    }

    const currentTarget = events.find(e => e.id === targetId);
    if (!currentTarget) return null;

    // Busca os links da versão vigente do alvo
    const latestVersion = allVersions
      .filter(v => v.evento_id === targetId)
      .sort((a, b) => b.numero_versao - a.numero_versao)[0];
    
    const childLinks = latestVersion?.snapshot_json?.links || [];
    const newVisited = new Set(visited).add(targetId);

    return (
      <div key={`${targetId}-${depth}`} className={`${depth > 0 ? 'ml-8 mt-2' : ''} space-y-2`}>
        <RouterLink 
          to={`/eventos/${currentTarget.id}/gerenciar`}
          className={`flex items-center gap-3 p-3 rounded-2xl border transition-all hover:shadow-md group ${
            depth === 0 ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-100 hover:border-indigo-300'
          }`}
        >
          <div className="relative">
             {depth > 0 && <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-4 h-0.5 bg-slate-200" />}
             <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[10px] ${
               depth === 0 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
             }`}>
               {currentTarget.codigo}
             </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">{currentTarget.nome}</p>
            <p className="text-[9px] font-medium text-slate-400 uppercase">{currentTarget.aplicacao_evento.replace('_', ' ')}</p>
          </div>
          <ChevronRight size={14} className="text-slate-200 group-hover:text-indigo-400" />
        </RouterLink>
        
        {childLinks.map(l => (
          <div key={l.id} className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-100" />
            <div className="flex items-center gap-2 ml-4 px-2">
              <div className="w-2 h-0.5 bg-slate-100" />
              <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase flex items-center gap-1 ${
                l.type === 'CHAMA' ? 'bg-blue-50 text-blue-600' : 
                l.type === 'DEPENDE' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
              }`}>
                {l.type === 'CHAMA' && <Zap size={8} />}
                {l.type === 'DEPENDE' && <ShieldAlert size={8} />}
                {l.type === 'COMPOE_BASE' && <Layers size={8} />}
                {l.type.replace('_', ' ')}
              </div>
            </div>
            {renderDependencyTree(l.destinationId, depth + 1, newVisited)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-800">Interdependências</h3>
          <p className="text-sm text-slate-500">Mapeamento de relações técnicas para "{currentEvent?.nome}"</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-1 flex shadow-sm">
            <button 
              onClick={() => setViewMode('direct')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'direct' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <ListIcon size={16} />
              Vista Direta
            </button>
            <button 
              onClick={() => setViewMode('hierarchy')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'hierarchy' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Network size={16} />
              Mapa de Impacto
            </button>
          </div>
          
          {!isReadOnly && (
            <button 
              onClick={() => {
                setViewMode('direct');
                setShowAddForm(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all"
            >
              <Plus size={20} />
              Novo Vínculo
            </button>
          )}
        </div>
      </div>

      {viewMode === 'direct' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            {showAddForm ? (
              <div className="bg-white p-6 rounded-3xl shadow-xl border-2 border-indigo-500 sticky top-4 animate-in slide-in-from-left-4 duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-bold text-slate-800 text-sm">Vincular Evento</h4>
                  <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Buscar Evento</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                      <input 
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                        placeholder="Nome ou Código..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    {searchTerm && (
                      <div className="mt-2 max-h-48 overflow-y-auto border border-slate-100 rounded-xl bg-white shadow-xl z-20">
                        {availableEvents.slice(0, 8).map(e => (
                          <button 
                            key={e.id}
                            onClick={() => {
                              setNewLink(prev => ({ ...prev, destinationId: e.id }));
                              setSearchTerm('');
                            }}
                            className="w-full p-3 text-left hover:bg-indigo-50 flex items-center justify-between group transition-all border-b border-slate-50 last:border-0"
                          >
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-indigo-600">{e.codigo}</span>
                              <span className="text-xs font-bold text-slate-700 truncate">{e.nome}</span>
                            </div>
                            <ChevronRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100" />
                          </button>
                        ))}
                      </div>
                    )}
                    {newLink.destinationId && (
                      <div className="mt-3 p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between">
                        <div className="truncate">
                          <p className="text-[8px] font-black text-indigo-400 uppercase">Selecionado</p>
                          <p className="text-xs font-bold text-indigo-700 truncate">{events.find(e => e.id === newLink.destinationId)?.nome}</p>
                        </div>
                        <button onClick={() => setNewLink(prev => ({ ...prev, destinationId: undefined }))} className="p-1 text-indigo-400 hover:text-indigo-600">
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Natureza do Vínculo</label>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { id: 'CHAMA', icon: <Zap size={14} />, label: 'Disparo (Chama)' },
                        { id: 'DEPENDE', icon: <ShieldAlert size={14} />, label: 'Dependência' },
                        { id: 'COMPOE_BASE', icon: <Layers size={14} />, label: 'Incidência de Base' }
                      ].map(t => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setNewLink(prev => ({ ...prev, type: t.id as any }))}
                          className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${newLink.type === t.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-200'}`}
                        >
                          {t.icon}
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    disabled={!newLink.destinationId}
                    onClick={handleAddLink}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-black rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
                  >
                    Confirmar Vínculo
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-100 p-6 rounded-3xl border border-dashed border-slate-300 space-y-4 text-center">
                <GitBranch className="mx-auto text-slate-300" size={32} />
                <p className="text-xs text-slate-500 font-medium italic">A Vista Direta exibe apenas as relações de 1º nível desta versão específica.</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-3 space-y-6">
            {['CHAMA', 'DEPENDE', 'COMPOE_BASE'].map(type => {
              const typedLinks = links.filter(l => l.type === type);
              if (typedLinks.length === 0 && isReadOnly) return null;

              const config = {
                CHAMA: { title: 'Eventos Chamados', icon: <Zap />, color: 'text-blue-600', bg: 'bg-blue-50' },
                DEPENDE: { title: 'Depende de', icon: <ShieldAlert />, color: 'text-amber-600', bg: 'bg-amber-50' },
                COMPOE_BASE: { title: 'Compõe Base de', icon: <Layers />, color: 'text-emerald-600', bg: 'bg-emerald-50' }
              }[type as any];

              return (
                <div key={type} className="space-y-3">
                  <div className="flex items-center gap-2 px-2">
                    <div className={`p-1.5 rounded-lg ${config?.bg} ${config?.color}`}>
                      {React.cloneElement(config?.icon as any, { size: 16 })}
                    </div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">{config?.title}</h4>
                    <span className="ml-auto text-[10px] font-bold text-slate-300">{typedLinks.length} vínculo(s)</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {typedLinks.map(link => {
                      const target = events.find(e => e.id === link.destinationId);
                      if (!target) return null;
                      return (
                        <RouterLink 
                          to={`/eventos/${target.id}/gerenciar`}
                          key={link.id} 
                          className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-indigo-400 hover:shadow-md transition-all active:scale-[0.98]"
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs ${config?.bg} ${config?.color}`}>
                            {target.codigo}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">{target.nome}</p>
                            <p className="text-[10px] font-medium text-slate-400 uppercase">{target.aplicacao_evento.replace('_', ' ')}</p>
                          </div>
                          {!isReadOnly && (
                            <button 
                              onClick={(e) => removeLink(link.id, e)}
                              className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                          <ChevronRight size={16} className="text-slate-200 group-hover:text-indigo-400" />
                        </RouterLink>
                      );
                    })}
                    {typedLinks.length === 0 && !isReadOnly && (
                      <div className="md:col-span-2 py-4 border-2 border-dashed border-slate-50 rounded-2xl text-center text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                        Nenhum vínculo deste tipo
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-inner min-h-[400px]">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 flex items-center gap-4 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
              <Network className="text-indigo-600" size={24} />
              <div>
                <h4 className="font-black text-indigo-900 text-sm">Explorador de Árvore de Cálculo</h4>
                <p className="text-[11px] text-indigo-700 font-medium">Esta visualização percorre recursivamente todos os vínculos ativos para mostrar a cadeia de impacto completa na folha.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {currentEventId && renderDependencyTree(currentEventId)}
            </div>
            
            {links.length === 0 && (
              <div className="py-20 text-center space-y-4">
                <ArrowRightLeft size={48} className="mx-auto text-slate-100" />
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Sem dependências para mapear</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
