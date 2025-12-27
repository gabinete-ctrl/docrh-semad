
import React, { useState } from 'react';
import { SnapshotJSON, Library, Attachment } from '../../types';
import { 
  Plus, 
  Trash2, 
  Code2, 
  X, 
  ChevronRight, 
  Library as LibraryIcon, 
  Save, 
  Edit3,
  Terminal,
  Upload,
  Paperclip,
  Eye,
  FileCheck,
  MessageSquare
} from 'lucide-react';
import { AttachmentPreviewModal } from '../AttachmentPreviewModal';

interface LibrariesTabProps {
  snapshot: SnapshotJSON;
  isReadOnly: boolean;
  onUpdate: (snapshot: SnapshotJSON) => void;
}

export const LibrariesTab: React.FC<LibrariesTabProps> = ({ snapshot, isReadOnly, onUpdate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Library>>({});
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);

  const startEdit = (lib?: Library) => {
    if (isReadOnly) return;
    if (lib) {
      setEditingId(lib.id);
      setForm(lib);
    } else {
      setEditingId('new');
      setForm({ 
        nome: '', 
        ativo: true, 
        objetivo: '', 
        ordemExecucao: 1, 
        comandoChamada: '', 
        formulasDependentes: '', 
        blocoExecucao: '',
        observacao: '',
        attachments: []
      });
    }
  };

  const handleSave = () => {
    let updatedLibs = [...(snapshot.libraries || [])];
    if (editingId === 'new') {
      const newLib = { ...form, id: crypto.randomUUID(), attachments: form.attachments || [] } as Library;
      updatedLibs.push(newLib);
    } else {
      updatedLibs = updatedLibs.map(l => l.id === editingId ? { ...form, id: editingId, attachments: form.attachments || [] } as Library : l);
    }
    onUpdate({ ...snapshot, libraries: updatedLibs });
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja excluir este registro de biblioteca?')) {
      onUpdate({ ...snapshot, libraries: (snapshot.libraries || []).filter(l => l.id !== id) });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    const newAttachments: Attachment[] = files.map(f => ({
      id: crypto.randomUUID(),
      name: f.name,
      type: f.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'jpeg',
      url: '#' // Simulação de URL
    }));
    setForm(prev => ({ ...prev, attachments: [...(prev.attachments || []), ...newAttachments] }));
  };

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Bibliotecas Técnicas</h3>
          <p className="text-xs text-slate-500">Gestão de funções auxiliares e blocos de código do SIARH/Legado</p>
        </div>
        {!isReadOnly && (
          <button 
            onClick={() => startEdit()}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-black shadow-md hover:bg-indigo-700 transition-all"
          >
            <Plus size={20} />
            Nova Biblioteca
          </button>
        )}
      </div>

      {editingId ? (
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden animate-in slide-in-from-top-4 duration-300">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                <LibraryIcon size={20} />
              </div>
              <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">
                {editingId === 'new' ? 'Nova Definição de Biblioteca' : 'Editar Definição'}
              </h4>
            </div>
            <button onClick={() => setEditingId(null)} className="p-2 hover:bg-white rounded-full text-slate-400 transition-all shadow-sm">
              <X size={24} />
            </button>
          </div>

          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Nome da Biblioteca *</label>
                <input 
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700"
                  value={form.nome}
                  onChange={(e) => setForm(f => ({ ...f, nome: e.target.value }))}
                  placeholder="Ex: DIASFERIASMES"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Status</label>
                <select 
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700"
                  value={form.ativo ? 'sim' : 'nao'}
                  onChange={(e) => setForm(f => ({ ...f, ativo: e.target.value === 'sim' }))}
                >
                  <option value="sim">Ativo (Sim)</option>
                  <option value="nao">Inativo (Não)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Objetivo / Finalidade</label>
                    <textarea 
                      rows={3}
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none font-medium"
                      value={form.objetivo}
                      onChange={(e) => setForm(f => ({ ...f, objetivo: e.target.value }))}
                      placeholder="Descreva a finalidade técnica desta biblioteca..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Observações Adicionais</label>
                    <textarea 
                      rows={3}
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none font-medium"
                      value={form.observacao}
                      onChange={(e) => setForm(f => ({ ...f, observacao: e.target.value }))}
                      placeholder="Notas extras, alertas ou históricos de mudança..."
                    />
                  </div>
               </div>
               
               <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Ordem Execução</label>
                      <input 
                        type="number"
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                        value={form.ordemExecucao}
                        onChange={(e) => setForm(f => ({ ...f, ordemExecucao: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Comando Chamada</label>
                      <input 
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-black text-indigo-600"
                        value={form.comandoChamada}
                        onChange={(e) => setForm(f => ({ ...f, comandoChamada: e.target.value }))}
                        placeholder="Ex: DIASFERIASMES"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Documentação / Anexos (PDF/JPEG)</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 bg-slate-50/50 group hover:border-indigo-300 transition-all">
                      <Upload className="text-slate-300 group-hover:text-indigo-400" size={24} />
                      <p className="text-[10px] text-slate-500 text-center font-bold uppercase tracking-tighter">Clique para anexar normativos ou evidências</p>
                      <input 
                        type="file" 
                        multiple 
                        accept=".pdf,.jpg,.jpeg"
                        className="hidden" 
                        id="library-attachment-upload"
                        onChange={handleFileUpload}
                      />
                      <label 
                        htmlFor="library-attachment-upload"
                        className="mt-2 px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 hover:bg-slate-50 cursor-pointer shadow-sm transition-all"
                      >
                        Selecionar Arquivos
                      </label>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {form.attachments?.map(att => (
                        <div key={att.id} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-xl">
                          <Paperclip size={12} className="text-indigo-400" />
                          <span className="text-[10px] font-bold text-indigo-700 truncate max-w-[120px]">{att.name}</span>
                          <button 
                            onClick={() => setForm(prev => ({ ...prev, attachments: prev.attachments?.filter(a => a.id !== att.id) }))}
                            className="p-1 hover:bg-white text-rose-500 rounded-lg transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
               </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Fórmulas Dependentes</label>
              <textarea 
                rows={2}
                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none font-medium"
                value={form.formulasDependentes}
                onChange={(e) => setForm(f => ({ ...f, formulasDependentes: e.target.value }))}
                placeholder="Listagem de fórmulas que utilizam esta biblioteca..."
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Bloco de Execução (Código Fonte)</label>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 bg-indigo-50 px-2 py-0.5 rounded uppercase">
                  <Terminal size={10} /> PL/SQL Format
                </div>
              </div>
              <textarea 
                rows={12}
                spellCheck={false}
                className="w-full px-6 py-6 bg-slate-900 text-emerald-400 font-mono text-xs rounded-[2rem] focus:ring-4 focus:ring-indigo-500/20 outline-none resize-none border-2 border-slate-800"
                value={form.blocoExecucao}
                onChange={(e) => setForm(f => ({ ...f, blocoExecucao: e.target.value }))}
                placeholder="declare cursor a is select ..."
              />
            </div>
          </div>

          <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            <button 
              onClick={() => setEditingId(null)}
              className="px-6 py-3 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded-xl transition-all"
            >
              Descartar
            </button>
            <button 
              onClick={handleSave}
              className="px-10 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
            >
              <Save size={16} />
              Salvar Biblioteca
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {(snapshot.libraries || []).length > 0 ? snapshot.libraries.map(lib => (
            <div key={lib.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all group overflow-hidden relative">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${lib.ativo ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-300'}`}>
                      <Code2 size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{lib.nome}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`w-2 h-2 rounded-full ${lib.ativo ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{lib.ativo ? 'Ativa' : 'Inativa'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Comando Chamada</p>
                      <code className="px-2 py-1 bg-slate-50 text-indigo-600 rounded-lg text-[10px] font-black border border-slate-100">
                        {lib.comandoChamada}
                      </code>
                    </div>
                    {lib.attachments && lib.attachments.length > 0 && (
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Anexos ({lib.attachments.length})</p>
                        <div className="flex flex-wrap gap-1">
                          {lib.attachments.map(att => (
                            <button 
                              key={att.id} 
                              onClick={() => setPreviewAttachment(att)}
                              className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
                              title={att.name}
                            >
                              {att.type === 'pdf' ? <FileCheck size={12} /> : <Eye size={12} />}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-4 md:border-l md:border-slate-50 md:pl-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Objetivo</p>
                      <p className="text-xs text-slate-600 font-medium italic leading-relaxed line-clamp-2">
                        {lib.objetivo || "Sem descrição de objetivo cadastrada."}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <MessageSquare size={10} /> Observações
                      </p>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                        {lib.observacao || "--"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-2xl p-4 overflow-hidden relative">
                    <div className="absolute top-3 right-3 text-[9px] font-bold text-slate-500 uppercase tracking-tighter bg-slate-800 px-2 py-0.5 rounded">Código Fonte</div>
                    <pre className="text-[10px] text-emerald-400 font-mono line-clamp-3 opacity-80">
                      {lib.blocoExecucao || "-- Bloco de execução vazio"}
                    </pre>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:px-4">
                   {!isReadOnly && (
                     <>
                      <button 
                        onClick={() => startEdit(lib)}
                        className="p-3 bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all shadow-sm"
                      >
                        <Edit3 size={20} />
                      </button>
                      <button 
                        onClick={() => handleDelete(lib.id)}
                        className="p-3 bg-slate-50 text-slate-400 hover:bg-rose-600 hover:text-white rounded-2xl transition-all shadow-sm"
                      >
                        <Trash2 size={20} />
                      </button>
                     </>
                   )}
                   <button 
                    onClick={() => startEdit(lib)}
                    className="p-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all shadow-sm"
                   >
                     <ChevronRight size={24} />
                   </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200 flex flex-col items-center gap-4">
              <LibraryIcon size={48} className="text-slate-100" />
              <div className="space-y-1">
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Nenhuma biblioteca registrada</p>
                <p className="text-slate-300 text-xs font-medium">Cadastre funções de apoio ou blocos de código específicos para o SIARH.</p>
              </div>
              {!isReadOnly && (
                <button 
                  onClick={() => startEdit()}
                  className="px-6 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black hover:bg-indigo-100 transition-all"
                >
                  Criar Primeiro Registro
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {previewAttachment && (
        <AttachmentPreviewModal 
          attachment={previewAttachment} 
          onClose={() => setPreviewAttachment(null)} 
        />
      )}
    </div>
  );
};
