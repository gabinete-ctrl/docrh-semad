
import React, { useState } from 'react';
import { Evento, EventApplication } from '../../types';
import { Info, Tag as TagIcon, Save, AlertCircle, Search, Plus, Check } from 'lucide-react';

interface MetadataTabProps {
  event: Evento;
  isReadOnly: boolean;
  onUpdate: (event: Evento) => void;
  globalTags: string[];
  onAddGlobalTag: (tag: string) => void;
}

export const MetadataTab: React.FC<MetadataTabProps> = ({ event, isReadOnly, onUpdate, globalTags, onAddGlobalTag }) => {
  const [formData, setFormData] = React.useState(event);
  const [tagSearch, setTagSearch] = useState('');
  const [showTagModal, setShowTagModal] = useState(false);
  const [newGlobalTagName, setNewGlobalTagName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ ...formData, atualizado_em: new Date().toISOString() });
    alert('Metadados atualizados com sucesso!');
  };

  const toggleTag = (tag: string) => {
    if (isReadOnly) return;
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag) 
        : [...prev.tags, tag]
    }));
  };

  const handleAddNewTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGlobalTagName.trim()) {
      onAddGlobalTag(newGlobalTagName.trim());
      toggleTag(newGlobalTagName.trim());
      setNewGlobalTagName('');
      setShowTagModal(false);
    }
  };

  const filteredGlobalTags = globalTags.filter(t => 
    t.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      {isReadOnly && (
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-center gap-3 text-amber-800 shadow-sm">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">Os metadados mestres só podem ser editados em versões de **RASCUNHO**.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Info size={18} className="text-indigo-500" />
              Dados Principais
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Código</label>
                  <input 
                    disabled
                    type="text"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed text-sm font-black"
                    value={formData.codigo}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Nome do Evento</label>
                  <input 
                    disabled={isReadOnly}
                    required
                    type="text"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold"
                    value={formData.nome}
                    onChange={(e) => setFormData(p => ({ ...p, nome: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Descrição Técnica</label>
                <textarea 
                  disabled={isReadOnly}
                  rows={6}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none"
                  value={formData.descricao}
                  onChange={(e) => setFormData(p => ({ ...p, descricao: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
             <div className="space-y-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <TagIcon size={18} className="text-indigo-500" />
                Categorização e Tags
              </h3>

              <div className="space-y-3">
                {!isReadOnly && (
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input 
                        type="text"
                        className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="Buscar ou filtrar tags..."
                        value={tagSearch}
                        onChange={(e) => setTagSearch(e.target.value)}
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={() => setShowTagModal(true)}
                      className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                      title="Criar nova tag"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                )}

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-wrap gap-2 max-h-40 overflow-y-auto shadow-inner">
                  {filteredGlobalTags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      disabled={isReadOnly}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase border transition-all flex items-center gap-1.5 ${
                        formData.tags.includes(tag)
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300 disabled:opacity-50'
                      }`}
                    >
                      {formData.tags.includes(tag) && <Check size={10} />}
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Aplicação</label>
                  <select 
                    disabled={isReadOnly}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-sm"
                    value={formData.aplicacao_evento}
                    onChange={(e) => setFormData(p => ({ ...p, aplicacao_evento: e.target.value as EventApplication }))}
                  >
                    <option value="proventos">Proventos</option>
                    <option value="descontos">Descontos</option>
                    <option value="informativo">Informativo</option>
                    <option value="base_calculo">Base de Cálculo</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Casas Decimais</label>
                  <input 
                    disabled={isReadOnly}
                    type="number"
                    min={0}
                    max={6}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    value={formData.casas_decimais}
                    onChange={(e) => setFormData(p => ({ ...p, casas_decimais: parseInt(e.target.value) }))}
                  />
                </div>
              </div>
             </div>
          </div>
        </div>

        {!isReadOnly && (
          <div className="flex justify-end">
            <button 
              type="submit"
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center gap-2"
            >
              <Save size={20} />
              Salvar Alterações
            </button>
          </div>
        )}
      </form>

      {/* Modal para Adicionar Tag Global */}
      {showTagModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-sm animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <TagIcon size={20} className="text-indigo-600" />
              Nova Tag Global
            </h3>
            <form onSubmit={handleAddNewTag} className="space-y-4">
              <input 
                autoFocus
                type="text"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                placeholder="Nome da tag..."
                value={newGlobalTagName}
                onChange={(e) => setNewGlobalTagName(e.target.value)}
              />
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowTagModal(false)}
                  className="flex-1 py-2 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
