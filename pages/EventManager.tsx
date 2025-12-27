
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
import { 
  FileText, 
  History, 
  Plus, 
  Link as LinkIcon, 
  BookOpen, 
  StickyNote, 
  Settings as SettingsIcon,
  FileBadge,
  Power,
  PowerOff,
  AlertTriangle,
  ChevronRight,
  X,
  Library as LibraryIcon
} from 'lucide-react';
import { Evento, EventVersion, SnapshotJSON } from '../types';
import { VersionHistoryModal } from '../components/VersionHistoryModal';
import { PublishModal } from '../components/PublishModal';

import { MetadataTab } from '../components/tabs/MetadataTab';
import { NormativesTab } from '../components/tabs/NormativesTab';
import { RulesTab } from '../components/tabs/RulesTab';
import { LinksTab } from '../components/tabs/LinksTab';
import { NotesTab } from '../components/tabs/NotesTab';
import { LibrariesTab } from '../components/tabs/LibrariesTab';

interface EventManagerProps {
  events: Evento[];
  versions: EventVersion[];
  onUpdateEvent: (event: Evento) => void;
  onAddVersion: (version: EventVersion) => void;
  onPublish: (versionId: string, eventId: string, motivo: string, objetivo: string) => void;
  onUpdateSnapshot: (versionId: string, snapshot: SnapshotJSON) => void;
  globalTags: string[];
  onAddGlobalTag: (tag: string) => void;
}

export const EventManager: React.FC<EventManagerProps> = ({ 
  events, 
  versions, 
  onUpdateEvent, 
  onAddVersion, 
  onPublish,
  onUpdateSnapshot,
  globalTags,
  onAddGlobalTag
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('regras');
  const [showHistory, setShowHistory] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showBlockerModal, setShowBlockerModal] = useState(false);

  const event = events.find(e => e.id === id);
  const eventVersions = versions.filter(v => v.evento_id === id).sort((a, b) => b.numero_versao - a.numero_versao);
  
  const versionParam = searchParams.get('versao');
  const activeVersion = useMemo(() => {
    if (versionParam) {
      return eventVersions.find(v => `v${v.numero_versao}` === versionParam);
    }
    const published = eventVersions.find(v => v.status_versao === 'PUBLICADA');
    return published || eventVersions[0];
  }, [eventVersions, versionParam]);

  const blockingEvents = useMemo(() => {
    if (!event) return [];
    return events.filter(e => {
      if (e.id === event.id) return false;
      const latestV = versions
        .filter(v => v.evento_id === e.id)
        .sort((a, b) => b.numero_versao - a.numero_versao)[0];
      
      return latestV?.snapshot_json.links?.some(l => l.destinationId === event.id);
    });
  }, [events, versions, event]);

  if (!event || !activeVersion) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <p>Evento não encontrado ou sem versões.</p>
        <button onClick={() => navigate('/')} className="text-indigo-600 hover:underline">Voltar ao início</button>
      </div>
    );
  }

  const isDraft = activeVersion.status_versao === 'RASCUNHO';
  const isPublished = activeVersion.status_versao === 'PUBLICADA';

  const handleCreateDraftFromCurrent = () => {
    const nextVersionNum = Math.max(...eventVersions.map(v => v.numero_versao)) + 1;
    const newVersion: EventVersion = {
      id: crypto.randomUUID(),
      evento_id: event.id,
      numero_versao: nextVersionNum,
      status_versao: 'RASCUNHO',
      criado_por: 'Admin',
      criado_em: new Date().toISOString(),
      snapshot_json: JSON.parse(JSON.stringify(activeVersion.snapshot_json))
    };
    onAddVersion(newVersion);
    setSearchParams({ versao: `v${nextVersionNum}` });
  };

  const handlePublish = (motivo: string, objetivo: string) => {
    onPublish(activeVersion.id, event.id, motivo, objetivo);
    setShowPublishModal(false);
  };

  const toggleEventStatus = () => {
    if (event.ativo && blockingEvents.length > 0) {
      setShowBlockerModal(true);
      return;
    }

    onUpdateEvent({
      ...event,
      ativo: !event.ativo,
      atualizado_em: new Date().toISOString()
    });
  };

  const updateSnapshot = (newSnapshot: SnapshotJSON) => {
    onUpdateSnapshot(activeVersion.id, newSnapshot);
  };

  const statusColors = {
    RASCUNHO: 'bg-amber-100 text-amber-700 border-amber-200',
    PUBLICADA: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    ARQUIVADA: 'bg-slate-100 text-slate-500 border-slate-200'
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center justify-between bg-gradient-to-br from-white to-slate-50">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg font-bold text-xs shadow-sm">
                {event.codigo}
              </span>
              <h1 className="text-2xl font-bold text-slate-800">{event.nome}</h1>
              
              <button 
                onClick={toggleEventStatus}
                className={`ml-2 flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all border shadow-sm ${
                  event.ativo 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100' 
                    : 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                }`}
              >
                {event.ativo ? <Power size={14} /> : <PowerOff size={14} />}
                {event.ativo ? 'Evento Ativo' : 'Evento Inativo'}
              </button>
            </div>
            <p className="text-slate-500 line-clamp-2 max-w-3xl">{event.descricao}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className={`px-4 py-2 rounded-xl border-2 flex flex-col items-center justify-center font-bold shadow-sm ${statusColors[activeVersion.status_versao]}`}>
              <span className="text-[10px] uppercase opacity-70 leading-none">Versão</span>
              <span className="text-lg">v{activeVersion.numero_versao}</span>
            </div>
            
            <div className="flex flex-col gap-2">
               <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColors[activeVersion.status_versao]}`}>
                  {activeVersion.status_versao}
                  {isPublished && <span className="ml-1 text-[8px] tracking-tighter">(VIGENTE)</span>}
                </span>
                <button 
                  onClick={() => setShowHistory(true)}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                >
                  <History size={14} />
                  Histórico
                </button>
               </div>
               
               <div className="flex gap-2">
                {isDraft && (
                  <button 
                    onClick={() => setShowPublishModal(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all"
                  >
                    <FileBadge size={16} />
                    Publicar
                  </button>
                )}
                {!isDraft && (
                  <button 
                    onClick={handleCreateDraftFromCurrent}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl shadow-sm transition-all"
                  >
                    <Plus size={16} />
                    Novo Rascunho
                  </button>
                )}
               </div>
            </div>
          </div>
        </div>

        <div className="flex border-t border-slate-200 px-4 bg-white sticky top-0 z-10 overflow-x-auto scrollbar-hide">
          {[
            { id: 'regras', label: 'Regra do Evento', icon: <FileText size={18} /> },
            { id: 'metadados', label: 'Metadados', icon: <SettingsIcon size={18} /> },
            { id: 'normativos', label: 'Normativos Legais', icon: <BookOpen size={18} /> },
            { id: 'vinculos', label: 'Vínculos', icon: <LinkIcon size={18} /> },
            { id: 'bibliotecas', label: 'Bibliotecas', icon: <LibraryIcon size={18} /> },
            { id: 'notas', label: 'Notas Gerais', icon: <StickyNote size={18} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-5 py-4 text-sm font-bold whitespace-nowrap transition-all border-b-2
                ${activeTab === tab.id 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="transition-all duration-300">
        {activeTab === 'metadados' && (
          <MetadataTab 
            event={event} 
            isReadOnly={!isDraft} 
            onUpdate={onUpdateEvent} 
            globalTags={globalTags}
            onAddGlobalTag={onAddGlobalTag}
          />
        )}
        {activeTab === 'normativos' && (
          <NormativesTab 
            snapshot={activeVersion.snapshot_json} 
            isReadOnly={!isDraft} 
            onUpdate={updateSnapshot}
          />
        )}
        {activeTab === 'regras' && (
          <RulesTab 
            snapshot={activeVersion.snapshot_json} 
            isReadOnly={!isDraft} 
            onUpdate={updateSnapshot}
          />
        )}
        {activeTab === 'vinculos' && (
          <LinksTab 
            snapshot={activeVersion.snapshot_json} 
            isReadOnly={!isDraft} 
            onUpdate={updateSnapshot}
            events={events}
            allVersions={versions}
          />
        )}
        {activeTab === 'bibliotecas' && (
          <LibrariesTab 
            snapshot={activeVersion.snapshot_json} 
            isReadOnly={!isDraft} 
            onUpdate={updateSnapshot}
          />
        )}
        {activeTab === 'notas' && (
          <NotesTab 
            snapshot={activeVersion.snapshot_json} 
            isReadOnly={!isDraft} 
            onUpdate={updateSnapshot}
          />
        )}
      </div>

      {showHistory && (
        <VersionHistoryModal 
          versions={eventVersions} 
          currentVersionId={activeVersion.id}
          onClose={() => setShowHistory(false)}
          onView={(num) => {
            setSearchParams({ versao: `v${num}` });
            setShowHistory(false);
          }}
          onDuplicate={(v) => {
            const nextVersionNum = Math.max(...eventVersions.map(v => v.numero_versao)) + 1;
            const newVersion: EventVersion = {
              id: crypto.randomUUID(),
              evento_id: event.id,
              numero_versao: nextVersionNum,
              status_versao: 'RASCUNHO',
              criado_por: 'Admin',
              criado_em: new Date().toISOString(),
              snapshot_json: JSON.parse(JSON.stringify(v.snapshot_json))
            };
            onAddVersion(newVersion);
            setSearchParams({ versao: `v${nextVersionNum}` });
            setShowHistory(false);
          }}
        />
      )}

      {showPublishModal && (
        <PublishModal 
          onClose={() => setShowPublishModal(false)}
          onConfirm={handlePublish}
        />
      )}

      {showBlockerModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white">
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 shadow-sm border border-rose-200">
                  <AlertTriangle size={32} />
                </div>
                <button onClick={() => setShowBlockerModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Desativação Impedida</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  O evento <span className="text-indigo-600 font-bold">{event.codigo} - {event.nome}</span> não pode ser desativado porque é uma dependência direta dos seguintes eventos:
                </p>
              </div>

              <div className="max-h-60 overflow-y-auto pr-2 space-y-2 scrollbar-hide">
                {blockingEvents.map(be => (
                  <RouterLink 
                    key={be.id}
                    to={`/eventos/${be.id}/gerenciar`}
                    onClick={() => setShowBlockerModal(false)}
                    className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-[10px] text-slate-500 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-colors">
                      {be.codigo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-700 truncate group-hover:text-indigo-700 transition-colors">{be.nome}</p>
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">Clique para gerenciar vínculos</p>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
                  </RouterLink>
                ))}
              </div>

              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                <p className="text-[11px] text-amber-700 font-bold leading-normal">
                  <span className="uppercase">Atenção:</span> Remova as vinculações nesses eventos antes de tentar desativar este código. A integridade das fórmulas da folha depende destes vínculos.
                </p>
              </div>

              <button 
                onClick={() => setShowBlockerModal(false)}
                className="w-full py-4 bg-slate-800 text-white font-black rounded-2xl hover:bg-slate-900 shadow-xl transition-all uppercase tracking-widest text-xs"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
