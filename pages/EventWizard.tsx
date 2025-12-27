
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X, Info, Tag as TagIcon, Search, Check, Sparkles } from 'lucide-react';
import { Evento, EventVersion, EventApplication } from '../types';

interface EventWizardProps {
  onSave: (event: Evento, initialVersion: EventVersion) => void;
  existingCodes: string[];
  globalTags: string[];
  onAddTag: (tag: string) => void;
}

export const EventWizard: React.FC<EventWizardProps> = ({ onSave, existingCodes, globalTags, onAddTag }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    codigo: '',
    nome: '',
    descricao: '',
    resumo_resultado_esperado: '',
    aplicacao_evento: 'proventos' as EventApplication,
    casas_decimais: 2,
    aparece_no_holerite: true,
    ativo: true,
    tags: [] as string[]
  });
  
  const [tagSearch, setTagSearch] = useState('');
  const [showTagModal, setShowTagModal] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [error, setError] = useState('');

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
    }));
  };

  const filteredTags = globalTags.filter(t => 
    t.toLowerCase().includes(tagSearch.toLowerCase())
  );

  const frequentTags = globalTags.slice(0, 5);

  const handleAddNewTag = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (newTagName.trim()) {
      onAddTag(newTagName.trim());
      if (!formData.tags.includes(newTagName.trim())) toggleTag(newTagName.trim());
      setNewTagName('');
      setShowTagModal(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (existingCodes.includes(formData.codigo)) {
      setError('Código já em uso.');
      return;
    }

    const eventId = crypto.randomUUID();
    const versionId = crypto.randomUUID();
    const now = new Date().toISOString();

    const newEvent: Evento = {
      ...formData,
      id: eventId,
      versao_vigente_id: undefined,
      criado_em: now,
      atualizado_em: now
    };

    const initialVersion: EventVersion = {
      id: versionId,
      evento_id: eventId,
      numero_versao: 1,
      status_versao: 'RASCUNHO',
      criado_por: 'Admin',
      criado_em: now,
      snapshot_json: {
        normatives: [],
        rules: {
          legacyErgom: '',
          hideLegacyFromReaders: false,
          currentSiarh: '',
          semantics: '',
          formulaPortugol: '',
          expectedResults: ''
        },
        links: [],
        notes: []
      }
    };

    onSave(newEvent, initialVersion);
    navigate(`/eventos/${eventId}/gerenciar?versao=v1`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/')} className="p-3 hover:bg-white rounded-2xl transition-all text-slate-400 hover:text-indigo-600 shadow-sm bg-slate-50">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Novo Evento</h2>
          <p className="text-slate-500 font-medium italic">Inicie o ciclo de vida da regra técnica</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 space-y-6">
            <h3 className="font-black text-slate-800 flex items-center gap-3 uppercase text-xs tracking-widest border-b border-slate-50 pb-4">
              <Info size={18} className="text-indigo-500" />
              Identificação Mestra
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Código Técnico *</label>
                <input 
                  required
                  type="text"
                  className={`w-full px-5 py-3 bg-slate-50 border rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-black text-indigo-600 ${error ? 'border-rose-200 bg-rose-50' : 'border-slate-100'}`}
                  value={formData.codigo}
                  onChange={(e) => { setFormData(p => ({ ...p, codigo: e.target.value })); setError(''); }}
                  placeholder="Ex: 1022"
                />
                {error && <p className="mt-2 text-[10px] text-rose-500 font-bold">{error}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Nome Comercial/Folha *</label>
                <input 
                  required
                  type="text"
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700"
                  value={formData.nome}
                  onChange={(e) => setFormData(p => ({ ...p, nome: e.target.value }))}
                  placeholder="Ex: Adicional de Titulação"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Resumo da Descrição</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none"
                  value={formData.descricao}
                  onChange={(e) => setFormData(p => ({ ...p, descricao: e.target.value }))}
                  placeholder="Explique a finalidade deste evento..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 space-y-8">
            <div className="space-y-6">
              <h3 className="font-black text-slate-800 flex items-center gap-3 uppercase text-xs tracking-widest border-b border-slate-50 pb-4">
                <TagIcon size={18} className="text-indigo-500" />
                Classificação & Taxonomia
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      type="text"
                      className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="Pesquisar tags globais..."
                      value={tagSearch}
                      onChange={(e) => setTagSearch(e.target.value)}
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setShowTagModal(true)}
                    className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Sparkles size={10}/> Mais usadas:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {frequentTags.map(t => (
                      <button 
                        key={t}
                        type="button"
                        onClick={() => toggleTag(t)}
                        className={`px-2 py-1 text-[9px] font-black rounded-lg border transition-all ${formData.tags.includes(t) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-100 text-slate-400'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100 shadow-inner max-h-40 overflow-y-auto">
                  <div className="flex flex-wrap gap-2">
                    {filteredTags.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all border flex items-center gap-2 ${formData.tags.includes(tag) ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200'}`}
                      >
                        {formData.tags.includes(tag) && <Check size={10} />}
                        {tag}
                      </button>
                    ))}
                    {filteredTags.length === 0 && (
                      <p className="text-[10px] text-slate-400 italic py-2">Nenhuma tag encontrada.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Aplicação</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-bold text-slate-700"
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
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Casas Decimais</label>
                  <input 
                    type="number" min={0} max={6}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-bold"
                    value={formData.casas_decimais}
                    onChange={(e) => setFormData(p => ({ ...p, casas_decimais: parseInt(e.target.value) }))}
                  />
                </div>
              </div>
            </div>
            
            <button 
              type="submit"
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-2xl shadow-indigo-200 transition-all flex items-center justify-center gap-3"
            >
              <Save size={20} />
              Criar Rascunho Inicial
            </button>
          </div>
        </div>
      </form>

      {/* Modal Adicionar Tag */}
      {showTagModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-sm animate-in zoom-in-95 duration-200 border border-white">
            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <TagIcon size={24} className="text-indigo-600" />
              Nova Tag Global
            </h3>
            <form onSubmit={handleAddNewTag} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Nome da Tag</label>
                <input 
                  autoFocus
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-black text-slate-700"
                  placeholder="Ex: Gratificação Lei"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setShowTagModal(false)} className="flex-1 py-3 text-slate-400 font-bold hover:bg-slate-50 rounded-2xl transition-all">Cancelar</button>
                <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Adicionar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
