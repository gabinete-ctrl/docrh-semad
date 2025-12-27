
import React from 'react';
import { X, Download, FileText, Image as ImageIcon } from 'lucide-react';
import { Attachment } from '../types';

interface AttachmentPreviewModalProps {
  attachment: Attachment;
  onClose: () => void;
}

export const AttachmentPreviewModal: React.FC<AttachmentPreviewModalProps> = ({ attachment, onClose }) => {
  const isImage = attachment.type === 'jpeg' || attachment.type === 'jpg';

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            {isImage ? <ImageIcon className="text-indigo-600" size={20} /> : <FileText className="text-rose-600" size={20} />}
            <span className="font-bold text-slate-800 truncate max-w-md">{attachment.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <a 
              href={attachment.url} 
              download 
              className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-full text-slate-600 transition-all"
              title="Download"
            >
              <Download size={20} />
            </a>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-slate-100 flex items-center justify-center p-8">
          {isImage ? (
            <img 
              src="https://images.unsplash.com/photo-1586281380349-631531a34d4f?q=80&w=1000&auto=format&fit=crop" 
              alt={attachment.name} 
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-full h-full bg-white rounded-xl shadow-lg flex flex-col items-center justify-center space-y-4">
              <FileText size={80} className="text-slate-200" />
              <p className="text-slate-500 font-medium italic">Pré-visualização de PDF (Simulada)</p>
              <div className="w-2/3 space-y-3 opacity-20">
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-4/6"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
