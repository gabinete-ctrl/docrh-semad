
import React, { useState } from 'react';
import { SnapshotJSON, Note, Attachment } from '../../types';
import { 
  Plus, 
  Trash2, 
  Search, 
  User, 
  Calendar, 
  StickyNote, 
  X, 
  MessageSquare,
  Filter,
  Upload,
  Paperclip,
  Eye,
  FileCheck
} from 'lucide-react';
import { AttachmentPreviewModal } from '../AttachmentPreviewModal';

interface NotesTabProps {
  snapshot: SnapshotJSON;
  isReadOnly: boolean;
  onUpdate: (snapshot: SnapshotJSON) => void;
}

export const NotesTab: React.FC<NotesTabProps> = ({ snapshot, isReadOnly, onUpdate }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);
  const [newNote, setNewNote] = useState<{
    title: string;
    description: string;
    attachments: Attachment[];
  }>({ title: '', description: '', attachments: [] });

  const filteredNotes = (snapshot.notes || []).filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    if (!newNote.title || !newNote.description) return;
    const note: Note = {
      id: crypto.randomUUID(),
      title: newNote.title,
      description: newNote.description,
      attachments: newNote.attachments,
      author: 'Admin',
      createdAt: new Date().toISOString()
    };
    onUpdate({ ...snapshot, notes: [note, ...(snapshot.notes || [])] });
    setNewNote({ title: '', description: '', attachments: [] });
    setShowAdd(false);
  };

  const removeNote = (id: string) => {
    if (confirm('Deseja excluir esta nota?')) {
      onUpdate({ ...snapshot, notes: (snapshot.notes || []).filter(n => n.id !== id) });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    const newAttachments: Attachment[] = files.map(f => ({
      id: crypto.randomUUID(),
      name: f.name,
      type: f.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'jpeg',
      url: '#' // Simulação de URL para protótipo
    }));
    setNewNote(prev => ({ ...prev, attachments: [...prev.attachments, ...newAttachments] }));
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Notas Gerais</h3>
          <p className="text-xs text-slate-500">Observações incrementais e orientações desta versão</p>
        </div>
        {!isReadOnly && (
          <button 
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-black shadow-md transition-all"
          >
            <Plus size={20} />
            Nova Nota
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text"
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Filtrar notas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
          <Filter size={20} />
        </button>
      </div>

      {showAdd && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-indigo-200 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-black text-indigo-900 uppercase text-xs tracking-widest">Adicionar Nota</h4>
            <button onClick={() => setShowAdd(false)} className="p-1 hover:bg-slate-100 rounded">
              <X size={20} className="text-slate-400" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5">Assunto/Título</label>
                <input 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm"
                  placeholder="Ex: Alinhamento de arredondamento"
                  value={newNote.title}
                  onChange={(e) => setNewNote(p => ({ ...p, title: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5">Conteúdo da Nota</label>
                <textarea 
                  rows={6}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none"
                  placeholder="Escreva as observações aqui..."
                  value={newNote.description}
                  onChange={(e) => setNewNote(p => ({ ...p, description: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Anexos de Nota (PDF/JPEG)</label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 bg-slate-50/50">
                  <Upload className="text-slate-300" size={32} />
                  <p className="text-[10px] text-slate-500 text-center font-bold">Arraste ou clique para anexar<br/>evidências ou documentos extras</p>
                  <input 
                    type="file" 
                    multiple 
                    accept=".pdf,.jpg,.jpeg"
                    className="hidden" 
                    id="note-attachment-upload"
                    onChange={handleFileUpload}
                  />
                  <label 
                    htmlFor="note-attachment-upload"
                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 hover:bg-slate-50 cursor-pointer shadow-sm transition-all uppercase tracking-widest"
                  >
                    Selecionar Arquivos
                  </label>
                </div>

                <div className="mt-4 space-y-2">
                  {newNote.attachments.map(att => (
                    <div key={att.id} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Paperclip size={14} className="text-indigo-400" />
                        <span className="text-[10px] font-bold text-slate-700 truncate max-w-[150px]">{att.name}</span>
                      </div>
                      <button 
                        onClick={() => setNewNote(prev => ({ ...prev, attachments: prev.attachments.filter(a => a.id !== att.id) }))}
                        className="p-1 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-8 border-t border-slate-50 mt-6">
             <button onClick={() => setShowAdd(false)} className="px-6 py-2 text-xs font-bold text-slate-500">Descartar</button>
             <button 
              onClick={handleAdd}
              className="px-10 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
             >
               Salvar Nota com Anexos
             </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredNotes.length > 0 ? filteredNotes.map(note => (
          <div key={note.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group relative">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-1">
                <h4 className="font-black text-slate-800 tracking-tight">{note.title}</h4>
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><User size={12}/> {note.author}</span>
                  <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(note.createdAt).toLocaleString()}</span>
                </div>
              </div>
              {!isReadOnly && (
                <button 
                  onClick={() => removeNote(note.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 hover:bg-rose-50 text-rose-500 rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            
            <p className="text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-wrap mb-6">{note.description}</p>
            
            {(note.attachments && note.attachments.length > 0) && (
              <div className="pt-4 border-t border-slate-50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Documentos Anexos ({note.attachments.length})</p>
                <div className="flex flex-wrap gap-2">
                  {note.attachments.map(att => (
                    <button 
                      key={att.id} 
                      onClick={() => setPreviewAttachment(att)}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-500 flex items-center gap-2 hover:bg-indigo-50 hover:border-indigo-200 transition-all group/att"
                    >
                      {att.type === 'pdf' ? <FileCheck size={14} className="text-rose-500" /> : <Eye size={14} className="text-indigo-500" />}
                      {att.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )) : (
          <div className="py-16 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center gap-3">
             <MessageSquare size={48} className="text-slate-200" />
             <p className="text-sm text-slate-400 font-medium">Nenhuma nota encontrada.</p>
          </div>
        )}
      </div>

      {previewAttachment && (
        <AttachmentPreviewModal 
          attachment={previewAttachment} 
          onClose={() => setPreviewAttachment(null)} 
        />
      )}
    </div>
  );
};
