
import React from 'react';
import { X, Eye, Copy, Calendar, User, History } from 'lucide-react';
import { EventVersion } from '../types';

interface VersionHistoryModalProps {
  versions: EventVersion[];
  currentVersionId: string;
  onClose: () => void;
  onView: (versionNumber: number) => void;
  onDuplicate: (version: EventVersion) => void;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({ 
  versions, 
  currentVersionId, 
  onClose, 
  onView, 
  onDuplicate 
}) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="text-indigo-600" size={20} />
            <h3 className="text-lg font-bold text-slate-800">Histórico de Versões</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {versions.map((v) => {
            const isCurrent = v.id === currentVersionId;
            const statusBadge = {
              RASCUNHO: 'bg-amber-100 text-amber-700',
              PUBLICADA: 'bg-emerald-100 text-emerald-700',
              ARQUIVADA: 'bg-slate-100 text-slate-500'
            };

            return (
              <div 
                key={v.id} 
                className={`p-4 rounded-2xl border-2 transition-all ${isCurrent ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-100 hover:border-slate-200'}`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-slate-800">
                        v{v.numero_versao}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${statusBadge[v.status_versao]}`}>
                            {v.status_versao}
                          </span>
                          {isCurrent && <span className="text-[10px] font-bold text-indigo-600 italic">Visualizando agora</span>}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 font-medium">
                          <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(v.criado_em).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><User size={12}/> {v.criado_por}</span>
                        </div>
                      </div>
                    </div>

                    {(v.motivo_mudanca || v.objetivo_mudanca) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Motivo</p>
                          <p className="text-xs text-slate-600 font-medium italic">"{v.motivo_mudanca || 'N/A'}"</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Objetivo</p>
                          <p className="text-xs text-slate-600 font-medium italic">"{v.objetivo_mudanca || 'N/A'}"</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 self-end md:self-start">
                    {!isCurrent && (
                      <button 
                        onClick={() => onView(v.numero_versao)}
                        className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all flex items-center gap-2 text-xs font-bold"
                      >
                        <Eye size={16} />
                        Ver
                      </button>
                    )}
                    <button 
                      onClick={() => onDuplicate(v)}
                      className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all flex items-center gap-2 text-xs font-bold"
                    >
                      <Copy size={16} />
                      Novo Rascunho
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
