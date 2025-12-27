
export type EventApplication = 'proventos' | 'descontos' | 'informativo' | 'base_calculo' | 'outros';
export type VersionStatus = 'RASCUNHO' | 'PUBLICADA' | 'ARQUIVADA';

export interface Attachment {
  id: string;
  name: string;
  type: 'pdf' | 'jpeg' | 'jpg';
  url: string;
}

export interface Normative {
  id: string;
  name: string;
  description: string;
  context: string;
  attachments: Attachment[];
}

export interface Rule {
  legacyErgom: string;
  hideLegacyFromReaders: boolean;
  currentSiarh: string;
  semantics: string;
  formulaPortugol: string;
  expectedResults: string;
}

export interface Link {
  id: string;
  originId: string;
  destinationId: string; // Event ID or Code
  type: 'CHAMA' | 'DEPENDE' | 'COMPOE_BASE';
  observation: string;
}

export interface Note {
  id: string;
  title: string;
  description: string;
  author: string;
  createdAt: string;
  attachments?: Attachment[];
}

export interface Library {
  id: string;
  nome: string;
  ativo: boolean;
  objetivo: string;
  ordemExecucao: number;
  comandoChamada: string;
  formulasDependentes: string;
  blocoExecucao: string;
  observacao?: string;
  attachments?: Attachment[];
}

export interface SnapshotJSON {
  normatives: Normative[];
  rules: Rule;
  links: Link[];
  notes: Note[];
  libraries?: Library[];
}

export interface EventVersion {
  id: string;
  evento_id: string;
  numero_versao: number;
  status_versao: VersionStatus;
  criado_por: string;
  criado_em: string;
  publicado_por?: string;
  publicado_em?: string;
  motivo_mudanca?: string;
  objetivo_mudanca?: string;
  snapshot_json: SnapshotJSON;
}

export interface Evento {
  id: string;
  codigo: string;
  nome: string;
  ativo: boolean;
  aparece_no_holerite: boolean;
  aplicacao_evento: EventApplication;
  casas_decimais: number;
  tags: string[];
  descricao: string;
  resumo_resultado_esperado: string;
  versao_vigente_id?: string;
  criado_em: string;
  atualizado_em: string;
}
