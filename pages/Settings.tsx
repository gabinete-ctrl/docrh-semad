
import React, { useState } from 'react';
import { Tag, Plus, X, Settings as SettingsIcon, Save, Info } from 'lucide-react';

interface SettingsProps {
  globalTags: string[];
  setGlobalTags: React.Dispatch<React.SetStateAction<string[]>>;
}

export const Settings: React.FC<SettingsProps> = ({ globalTags, setGlobalTags }) => {
  const [newTag, setNewTag] = useState('');

  const addTag = (e?: React.FormEvent) => {
    e?.preventDefault();
    const tag = newTag.trim();
    if (tag && !globalTags.includes(tag)) {
      setGlobalTags(prev => [...prev, tag].sort());
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    if (confirm(`Deseja remover a tag "${tagToRemove}"? Isso não afetará eventos que já a utilizam, mas ela não aparecerá mais como opção.`)) {
      setGlobalTags(prev => prev.filter(t => t !== tagToRemove));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 text-indigo-600">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Configurações do Sistema</h2>
          <p className="text-slate-500 text-sm">Gerencie parâmetros globais da documentação</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Tag size={20} className="text-indigo-500" />
            <h3 className="font-bold text-slate-800">Dicionário de Tags</h3>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex gap-3 text-blue-700">
            <Info size={20} className="shrink-0" />
            <p className="text-xs font-medium leading-relaxed">
              As tags cadastradas aqui aparecem como sugestões rápidas ao criar ou editar eventos, mantendo a padronização taxonômica do RH.
            </p>
          </div>

          <form onSubmit={addTag} className="flex gap-2">
            <input 
              type="text"
              className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              placeholder="Nova tag (ex: Gratificação)"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
            />
            <button 
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-sm flex items-center gap-2"
            >
              <Plus size={18} />
              Adicionar
            </button>
          </form>

          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tags Ativas ({globalTags.length})</p>
            <div className="flex flex-wrap gap-2">
              {globalTags.map(tag => (
                <div key={tag} className="group flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl transition-all hover:border-indigo-200">
                  <span className="text-xs font-bold text-slate-700">{tag}</span>
                  <button 
                    onClick={() => removeTag(tag)}
                    className="p-0.5 hover:bg-rose-100 text-rose-400 hover:text-rose-600 rounded transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-100 p-8 rounded-3xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
            <Save size={32} />
          </div>
          <p className="text-slate-500 text-sm font-medium">Outras configurações<br/>disponíveis em breve</p>
        </div>
      </div>
    </div>
  );
};
