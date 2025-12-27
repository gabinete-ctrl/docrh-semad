
import React, { useState } from 'react';
import { SnapshotJSON, Normative, Attachment } from '../../types';
import { 
  Plus, 
  Trash2, 
  FileText, 
  Upload, 
  Paperclip, 
  X,
  FileCheck,
  Eye,
  BookOpen,
  Edit3
} from 'lucide-react';
import { AttachmentPreviewModal } from '../AttachmentPreviewModal';

interface NormativesTabProps {
  snapshot: SnapshotJSON;
  isReadOnly: boolean;
  onUpdate: (snapshot: SnapshotJSON) => void;
}

export const NormativesTab: React.FC<NormativesTabProps> = ({ snapshot, isReadOnly, onUpdate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Normative>>({});
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);

  const startEdit = (norm?: Normative) => {
    if (isReadOnly) return;
    if (norm) {
      setEditingId(norm.id);
      setForm(norm);
    } else {
      setEditingId('new');
      setForm({ name: '', description: '', context: '', attachments: [] });
    }
  };

  const handleSave = () => {
    let updatedNorms = [...(snapshot.normatives || [])];
    if (editingId === 'new') {
      const newNorm = { ...form, id: crypto.randomUUID(), attachments: form.attachments || [] } as Normative;
      updatedNorms.push(newNorm);
    } else {
      updatedNorms = updatedNorms.map(n => n.id === editingId ? { ...form, id: editingId } as Normative : n);
    }
    onUpdate({ ...snapshot, normatives: updatedNorms });
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja excluir este normativo?')) {
      onUpdate({ ...snapshot, normatives: (snapshot.normatives || []).filter(n => n.id !== id) });
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800">Normativos Legais</h3>
        {!isReadOnly && (
          <button 
            onClick={() => startEdit()}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 transition-all"
          >
            <Plus size={18} />
            Novo Normativo
          </button>
        )}
      </div>

      {editingId ? (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-indigo-200 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-indigo-900">{editingId === 'new' ? 'Novo Normativo' : 'Editar Normativo'}</h4>
            <button onClick={() => setEditingId(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
              <X size={20} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Nome/Título do Normativo</label>
                <input 
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
                  value={form.name}
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Ex: Lei Municipal 1.234/2023"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Contexto de Aplicação</label>
                <input 
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
                  value={form.context}
                  onChange={(e) => setForm(f => ({ ...f, context: e.target.value }))}
                  placeholder="Ex: Aplica-se a todos os servidores estatutários"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Descrição Detalhada</label>
                <textarea 
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium resize-none"
                  value={form.description}
                  onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Descreva o que este normativo estabelece..."
                />
              </div>
            </div>

            <div className="space-y-4">
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Anexos (PDF/JPEG)</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 bg-slate-50/50">
                    <Upload className="text-slate-300" size={32} />
                    <p className="text-xs text-slate-500 text-center font-medium">Arraste ou clique para selecionar<br/>Apenas PDF e Imagens</p>
                    <input 
                      type="file" 
                      multiple 
                      accept=".pdf,.jpg,.jpeg"
                      className="hidden" 
                      id="normative-upload"
                      onChange={(e) => {
                        // Fix: Explicitly cast to File[] to avoid 'unknown' type error on file properties
                        const files = Array.from(e.target.files || []) as File[];
                        const newAttachments: Attachment[] = files.map(f => ({
                          id: crypto.randomUUID(),
                          name: f.name,
                          type: f.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'jpeg',
                          url: '#' // Simulação de URL
                        }));
                        setForm(f => ({ ...f, attachments: [...(f.attachments || []), ...newAttachments] }));
                      }}
                    />
                    <label 
                      htmlFor="normative-upload"
                      className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer shadow-sm transition-all"
                    >
                      Selecionar Arquivos
                    </label>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    {form.attachments?.map(att => (
                      <div key={att.id} className="flex items-center justify-between p-2 bg-white border border-slate-100 rounded-lg shadow-sm">
                        <div className="flex items-center gap-2">
                          <Paperclip size={14} className="text-slate-400" />
                          <span className="text-[10px] font-bold text-slate-700 truncate max-w-[150px]">{att.name}</span>
                        </div>
                        <button 
                          onClick={() => setForm(f => ({ ...f, attachments: f.attachments?.filter(a => a.id !== att.id) }))}
                          className="p-1 hover:bg-rose-50 text-rose-500 rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
            <button 
              onClick={() => setEditingId(null)}
              className="px-6 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              className="px-8 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-black rounded-xl shadow-lg shadow-indigo-100"
            >
              Salvar Normativo
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(snapshot.normatives || []).length > 0 ? snapshot.normatives.map(norm => (
            <div key={norm.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all group relative">
              <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!isReadOnly && (
                   <>
                    <button onClick={() => startEdit(norm)} className="p-1.5 hover:bg-indigo-50 text-indigo-500 rounded-lg">
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => handleDelete(norm.id)} className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                   </>
                )}
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <h4 className="font-bold text-slate-800 truncate">{norm.name}</h4>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contexto</p>
              <p className="text-xs text-slate-600 font-medium line-clamp-2 mb-4">{norm.context}</p>
              
              <div className="pt-4 border-t border-slate-50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Anexos ({norm.attachments.length})</p>
                <div className="flex flex-wrap gap-2">
                  {norm.attachments.map(att => (
                    <button 
                      key={att.id} 
                      onClick={() => setPreviewAttachment(att)}
                      className="group/att relative"
                    >
                      <div className="px-2 py-1 bg-slate-50 border border-slate-100 rounded text-[10px] font-bold text-slate-500 flex items-center gap-1 hover:bg-indigo-50 hover:border-indigo-200 transition-colors">
                        {att.type === 'pdf' ? <FileCheck size={12} className="text-rose-500" /> : <Eye size={12} className="text-indigo-500" />}
                        {att.type.toUpperCase()}
                      </div>
                    </button>
                  ))}
                  {norm.attachments.length === 0 && <span className="text-[10px] text-slate-400 italic">Sem anexos</span>}
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-slate-200 flex flex-col items-center gap-3">
              <BookOpen className="text-slate-200" size={48} />
              <p className="text-slate-400 text-sm font-medium">Nenhum normativo cadastrado para esta versão.</p>
              {!isReadOnly && (
                <button 
                  onClick={() => startEdit()}
                  className="text-indigo-600 text-xs font-bold hover:underline"
                >
                  Cadastrar o primeiro normativo
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
