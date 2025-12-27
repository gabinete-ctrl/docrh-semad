
import React, { useState } from 'react';
import { X, FileBadge, AlertCircle } from 'lucide-react';

interface PublishModalProps {
  onClose: () => void;
  onConfirm: (motivo: string, objetivo: string) => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({ onClose, onConfirm }) => {
  const [motivo, setMotivo] = useState('');
  const [objetivo, setObjetivo] = useState('');

  const isValid = motivo.trim().length > 5 && objetivo.trim().length > 5;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-indigo-950/40 backdrop-blur-md">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
              <FileBadge size={28} />
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-800">Publicar esta versão?</h3>
            <p className="text-sm text-slate-500">
              Esta ação tornará esta versão a **vigente** para este evento. A versão publicada anterior será arquivada automaticamente.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Motivo da Alteração *</label>
              <textarea 
                rows={2}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none"
                placeholder="Ex: Atualização do percentual conforme lei municipal..."
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Objetivo Esperado *</label>
              <textarea 
                rows={2}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none"
                placeholder="Ex: Ajustar o cálculo para o exercício de 2024..."
                value={objetivo}
                onChange={(e) => setObjetivo(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 flex gap-3">
            <AlertCircle size={20} className="text-amber-500 shrink-0" />
            <p className="text-xs text-amber-700 font-medium leading-relaxed">
              Versões publicadas são **imutáveis**. Se precisar alterar algo depois, deverá criar um novo rascunho.
            </p>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-all"
          >
            Voltar
          </button>
          <button 
            disabled={!isValid}
            onClick={() => onConfirm(motivo, objetivo)}
            className="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-black rounded-xl shadow-lg shadow-indigo-200 transition-all"
          >
            Confirmar Publicação
          </button>
        </div>
      </div>
    </div>
  );
};
