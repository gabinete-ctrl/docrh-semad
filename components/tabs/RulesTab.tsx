
import React, { useState } from 'react';
import { SnapshotJSON, Rule } from '../../types';
import { FileCode, Save, HelpCircle, Eye, EyeOff, Sparkles, Loader2, Settings, Target } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface RulesTabProps {
  snapshot: SnapshotJSON;
  isReadOnly: boolean;
  onUpdate: (snapshot: SnapshotJSON) => void;
}

export const RulesTab: React.FC<RulesTabProps> = ({ snapshot, isReadOnly, onUpdate }) => {
  const [ruleForm, setRuleForm] = useState<Rule>(snapshot.rules || {
    legacyErgom: '',
    hideLegacyFromReaders: false,
    currentSiarh: '',
    semantics: '',
    formulaPortugol: '',
    expectedResults: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSave = () => {
    onUpdate({ ...snapshot, rules: ruleForm });
    alert('Regras salvas temporariamente no rascunho.');
  };

  const handleAIAssist = async () => {
    if (!ruleForm.semantics) {
      alert('Por favor, descreva a semântica da regra primeiro para que a IA possa ajudar.');
      return;
    }

    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Com base na seguinte descrição de regra de RH: "${ruleForm.semantics}", escreva uma fórmula em Portugol (estilo SIARH). Use uma sintaxe clara com SE, ENTAO, FIMSE, RETORNE. Retorne APENAS o código da fórmula sem blocos de markdown.`,
      });
      
      if (response.text) {
        setRuleForm(prev => ({ ...prev, formulaPortugol: response.text.trim().replace(/```[a-z]*\n/g, '').replace(/\n```/g, '') }));
      }
    } catch (error) {
      console.error('Erro ao chamar Gemini:', error);
      alert('Não foi possível gerar a sugestão agora. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Configurações e Semântica */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Settings size={18} className="text-indigo-500" />
              Sistemas e Legado
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Configuração Legada (ERGOM)</label>
                  {!isReadOnly && (
                    <button 
                      onClick={() => setRuleForm(r => ({ ...r, hideLegacyFromReaders: !r.hideLegacyFromReaders }))}
                      className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${ruleForm.hideLegacyFromReaders ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}
                    >
                      {ruleForm.hideLegacyFromReaders ? <EyeOff size={12}/> : <Eye size={12}/>}
                      {ruleForm.hideLegacyFromReaders ? 'Oculto p/ Leitores' : 'Visível'}
                    </button>
                  )}
                </div>
                <textarea 
                  disabled={isReadOnly}
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-mono disabled:bg-slate-50 disabled:text-slate-500 resize-none"
                  value={ruleForm.legacyErgom}
                  onChange={(e) => setRuleForm(r => ({ ...r, legacyErgom: e.target.value }))}
                  placeholder="Cole aqui o trecho de código ou parâmetros do sistema Legado..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Configuração Atual (SIARH)</label>
                <textarea 
                  disabled={isReadOnly}
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-mono disabled:bg-slate-50 disabled:text-slate-500 resize-none"
                  value={ruleForm.currentSiarh}
                  onChange={(e) => setRuleForm(r => ({ ...r, currentSiarh: e.target.value }))}
                  placeholder="Cole aqui as definições técnicas atuais do SIARH..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
              <HelpCircle size={18} className="text-indigo-500" />
              Semântica da Regra
            </h3>
            <textarea 
              disabled={isReadOnly}
              rows={6}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium resize-none disabled:bg-slate-50 disabled:text-slate-500"
              value={ruleForm.semantics}
              onChange={(e) => setRuleForm(r => ({ ...r, semantics: e.target.value }))}
              placeholder="Explique detalhadamente a lógica de cálculo em linguagem natural..."
            />
          </div>
        </div>

        {/* Editor de Código e Resultados */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-3xl shadow-xl flex flex-col gap-4 border border-slate-800 h-[450px]">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-indigo-400 flex items-center gap-2">
                <FileCode size={18} />
                Fórmula (Portugol / Lógica de Cálculo)
              </h3>
              {!isReadOnly && (
                <button 
                  onClick={handleAIAssist}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 rounded-lg text-[10px] font-bold border border-indigo-500/30 transition-all disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  {isGenerating ? 'Gerando...' : 'IA: Sugerir Fórmula'}
                </button>
              )}
            </div>
            
            <div className="flex-1 relative">
              <textarea 
                disabled={isReadOnly}
                spellCheck={false}
                className="w-full h-full bg-slate-800/50 text-emerald-400 font-mono text-sm p-4 rounded-2xl outline-none focus:ring-1 focus:ring-indigo-500/50 resize-none disabled:opacity-70 disabled:cursor-not-allowed"
                value={ruleForm.formulaPortugol}
                onChange={(e) => setRuleForm(r => ({ ...r, formulaPortugol: e.target.value }))}
                placeholder="SE servidor.percentual > 0 ENTAO..."
              />
              {!isReadOnly && (
                <div className="absolute bottom-4 right-4 text-[10px] font-medium text-slate-500 italic">
                  Sintaxe SIARH v3.1
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Target size={18} className="text-emerald-500" />
              Resultado(s) Esperado(s)
            </h3>
            <textarea 
              disabled={isReadOnly}
              rows={4}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-slate-700 bg-slate-50/50 resize-none disabled:text-slate-500"
              value={ruleForm.expectedResults}
              onChange={(e) => setRuleForm(r => ({ ...r, expectedResults: e.target.value }))}
              placeholder="Descreva o impacto final esperado no holerite ou base de cálculo..."
            />
          </div>
        </div>
      </div>

      {!isReadOnly && (
        <div className="flex justify-end">
          <button 
            onClick={handleSave}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center gap-2"
          >
            <Save size={20} />
            Salvar Regras e Resultados
          </button>
        </div>
      )}
    </div>
  );
};
