
import { Evento, EventVersion } from '../types';

const now = new Date().toISOString();

export const mockEvents: Evento[] = [
  // PROVENTOS
  { id: 'e1', codigo: '1001', nome: 'Vencimento Base', ativo: true, aparece_no_holerite: true, aplicacao_evento: 'proventos', casas_decimais: 2, tags: ['Salário', 'Base'], descricao: 'Remuneração básica do cargo efetivo.', resumo_resultado_esperado: 'Valor fixo mensal conforme tabela salarial.', versao_vigente_id: 'v1-e1', criado_em: now, atualizado_em: now },
  { id: 'e2', codigo: '1002', nome: 'Gratificação de Atividade', ativo: true, aparece_no_holerite: true, aplicacao_evento: 'proventos', casas_decimais: 2, tags: ['Vantagem', 'Gratificação'], descricao: 'Adicional por desempenho de funções técnicas.', resumo_resultado_esperado: '20% sobre o vencimento base.', versao_vigente_id: 'v1-e2', criado_em: now, atualizado_em: now },
  { id: 'e3', codigo: '1003', nome: 'Adicional de Insalubridade', ativo: true, aparece_no_holerite: true, aplicacao_evento: 'proventos', casas_decimais: 2, tags: ['Encargo', 'Vantagem'], descricao: 'Compensação por exposição a agentes nocivos.', resumo_resultado_esperado: 'Percentual variável sobre o salário mínimo.', versao_vigente_id: 'v1-e3', criado_em: now, atualizado_em: now },
  { id: 'e4', codigo: '1004', nome: 'Adicional Noturno', ativo: true, aparece_no_holerite: true, aplicacao_evento: 'proventos', casas_decimais: 2, tags: ['Vantagem'], descricao: 'Remuneração por trabalho em horário noturno.', resumo_resultado_esperado: '25% de acréscimo sobre a hora normal.', versao_vigente_id: 'v1-e4', criado_em: now, atualizado_em: now },
  { id: 'e5', codigo: '1005', nome: 'Hora Extra 50%', ativo: true, aparece_no_holerite: true, aplicacao_evento: 'proventos', casas_decimais: 2, tags: ['Vantagem', 'Variável'], descricao: 'Horas trabalhadas além da jornada normal.', resumo_resultado_esperado: 'Valor da hora com 50% de acréscimo.', versao_vigente_id: 'v1-e5', criado_em: now, atualizado_em: now },
  { id: 'e6', codigo: '1006', nome: 'Triênio', ativo: true, aparece_no_holerite: true, aplicacao_evento: 'proventos', casas_decimais: 2, tags: ['Salário', 'Base'], descricao: 'Adicional por tempo de serviço a cada 3 anos.', resumo_resultado_esperado: '3% sobre o vencimento base.', versao_vigente_id: 'v1-e6', criado_em: now, atualizado_em: now },
  { id: 'e7', codigo: '1007', nome: 'Décimo Terceiro Salário', ativo: true, aparece_no_holerite: true, aplicacao_evento: 'proventos', casas_decimais: 2, tags: ['Salário'], descricao: 'Gratificação natalina anual.', resumo_resultado_esperado: '1/12 da remuneração por mês trabalhado.', versao_vigente_id: 'v1-e7', criado_em: now, atualizado_em: now },
  
  // DESCONTOS
  { id: 'e8', codigo: '2001', nome: 'INSS Servidor', ativo: true, aparece_no_holerite: true, aplicacao_evento: 'descontos', casas_decimais: 2, tags: ['Encargo', 'Desconto Folha'], descricao: 'Contribuição previdenciária oficial.', resumo_resultado_esperado: 'Desconto progressivo conforme tabela do INSS.', versao_vigente_id: 'v1-e8', criado_em: now, atualizado_em: now },
  { id: 'e9', codigo: '2002', nome: 'IRRF Salário', ativo: true, aparece_no_holerite: true, aplicacao_evento: 'descontos', casas_decimais: 2, tags: ['Encargo', 'Desconto Folha'], descricao: 'Imposto de renda retido na fonte.', resumo_resultado_esperado: 'Desconto conforme tabela da Receita Federal.', versao_vigente_id: 'v1-e9', criado_em: now, atualizado_em: now },
  { id: 'e10', codigo: '2003', nome: 'Faltas Injustificadas', ativo: true, aparece_no_holerite: true, aplicacao_evento: 'descontos', casas_decimais: 2, tags: ['Desconto Folha'], descricao: 'Abatimento por ausência sem justificativa legal.', resumo_resultado_esperado: 'Proporcional aos dias de ausência sobre a base.', versao_vigente_id: 'v1-e10', criado_em: now, atualizado_em: now },
  { id: 'e11', codigo: '2004', nome: 'Vale Transporte', ativo: true, aparece_no_holerite: true, aplicacao_evento: 'descontos', casas_decimais: 2, tags: ['Desconto Folha'], descricao: 'Custeio parcial do deslocamento residência-trabalho.', resumo_resultado_esperado: 'Desconto de 6% sobre o vencimento base.', versao_vigente_id: 'v1-e11', criado_em: now, atualizado_em: now },
  { id: 'e12', codigo: '2005', nome: 'Empréstimo Consignado BB', ativo: true, aparece_no_holerite: true, aplicacao_evento: 'descontos', casas_decimais: 2, tags: ['Desconto Folha'], descricao: 'Parcelas de empréstimo bancário.', resumo_resultado_esperado: 'Valor fixo da parcela contratada.', versao_vigente_id: 'v1-e12', criado_em: now, atualizado_em: now },
  { id: 'e13', codigo: '2006', nome: 'Contribuição Sindical', ativo: true, aparece_no_holerite: true, aplicacao_evento: 'descontos', casas_decimais: 2, tags: ['Desconto Folha'], descricao: 'Mensalidade para o sindicato da categoria.', resumo_resultado_esperado: 'Percentual fixo aprovado em assembleia.', versao_vigente_id: 'v1-e13', criado_em: now, atualizado_em: now },

  // BASES DE CÁLCULO
  { id: 'e14', codigo: '3001', nome: 'Base INSS', ativo: true, aparece_no_holerite: false, aplicacao_evento: 'base_calculo', casas_decimais: 2, tags: ['Base', 'Encargo'], descricao: 'Somatório de eventos para incidência de previdência.', resumo_resultado_esperado: 'Total de proventos tributáveis.', versao_vigente_id: 'v1-e14', criado_em: now, atualizado_em: now },
  { id: 'e15', codigo: '3002', nome: 'Base IRRF', ativo: true, aparece_no_holerite: false, aplicacao_evento: 'base_calculo', casas_decimais: 2, tags: ['Base', 'Encargo'], descricao: 'Base para cálculo do imposto de renda mensal.', resumo_resultado_esperado: 'Base INSS deduzida da contribuição previdenciária.', versao_vigente_id: 'v1-e15', criado_em: now, atualizado_em: now },
  { id: 'e16', codigo: '3003', nome: 'Base FGTS', ativo: true, aparece_no_holerite: false, aplicacao_evento: 'base_calculo', casas_decimais: 2, tags: ['Base', 'Encargo'], descricao: 'Valor sobre o qual incide o depósito do FGTS.', resumo_resultado_esperado: 'Remuneração bruta para fins de garantia.', versao_vigente_id: 'v1-e16', criado_em: now, atualizado_em: now },

  // INFORMATIVOS
  { id: 'e17', codigo: '4001', nome: 'Margem Consignável 35%', ativo: true, aparece_no_holerite: false, aplicacao_evento: 'informativo', casas_decimais: 2, tags: ['Informativo'], descricao: 'Limite máximo permitido para empréstimos.', resumo_resultado_esperado: '35% da remuneração líquida.', versao_vigente_id: 'v1-e17', criado_em: now, atualizado_em: now },
  { id: 'e18', codigo: '4002', nome: 'Saldo de Férias', ativo: true, aparece_no_holerite: false, aplicacao_evento: 'informativo', casas_decimais: 0, tags: ['Informativo'], descricao: 'Dias de férias acumulados e não gozados.', resumo_resultado_esperado: 'Quantidade de dias restantes.', versao_vigente_id: 'v1-e18', criado_em: now, atualizado_em: now },
  { id: 'e19', codigo: '4003', nome: 'Horas Mensais', ativo: true, aparece_no_holerite: true, aplicacao_evento: 'informativo', casas_decimais: 0, tags: ['Informativo'], descricao: 'Carga horária total do mês.', resumo_resultado_esperado: 'Ex: 200h ou 160h conforme contrato.', versao_vigente_id: 'v1-e19', criado_em: now, atualizado_em: now },

  // OUTROS
  { id: 'e20', codigo: '5001', nome: 'Reembolso Despesas', ativo: true, aparece_no_holerite: true, aplicacao_evento: 'outros', casas_decimais: 2, tags: ['Vantagem'], descricao: 'Devolução de gastos realizados em serviço.', resumo_resultado_esperado: 'Valor exato comprovado por notas fiscais.', versao_vigente_id: 'v1-e20', criado_em: now, atualizado_em: now },
];

export const mockVersions: EventVersion[] = mockEvents.map(event => ({
  id: `v1-${event.id}`,
  evento_id: event.id,
  numero_versao: 1,
  status_versao: 'PUBLICADA',
  criado_por: 'Sistema',
  criado_em: now,
  publicado_em: now,
  publicado_por: 'Sessão de Implantação',
  motivo_mudanca: 'Carga inicial do Dicionário de Eventos.',
  objetivo_mudanca: 'Migração técnica dos códigos Legado para o Novo Sistema.',
  snapshot_json: {
    normatives: [],
    rules: {
      legacyErgom: `CÓDIGO_${event.codigo}_LEGADO`,
      hideLegacyFromReaders: false,
      currentSiarh: `SIARH_V3_${event.codigo}`,
      semantics: `Regra padrão para processamento de ${event.nome} na folha mensal.`,
      formulaPortugol: `SE evento.ativo == VERDADEIRO ENTAO\n  RETORNE calcula_${event.nome.toLowerCase().replace(/ /g, '_')}()\nFIMSE`,
      expectedResults: event.resumo_resultado_esperado
    },
    links: [],
    notes: []
  }
}));

// Adicionando alguns vínculos para demonstração
const baseInssId = 'e14';
const baseIrrfId = 'e15';
const inssId = 'e8';
const irrfId = 'e9';

// Vínculos da Base INSS
mockVersions.find(v => v.evento_id === inssId)!.snapshot_json.links = [
  { id: 'l1', originId: inssId, destinationId: baseInssId, type: 'DEPENDE', observation: 'O INSS precisa do valor total da Base para aplicar a tabela progressiva.' }
];

// Vínculos da Base IRRF
mockVersions.find(v => v.evento_id === irrfId)!.snapshot_json.links = [
  { id: 'l2', originId: irrfId, destinationId: baseIrrfId, type: 'DEPENDE', observation: 'O IRRF utiliza a Base deduzida do INSS já calculado.' }
];

// Vínculo entre bases
mockVersions.find(v => v.evento_id === baseIrrfId)!.snapshot_json.links = [
  { id: 'l3', originId: baseIrrfId, destinationId: inssId, type: 'COMPOE_BASE', observation: 'O INSS é dedutor da base de cálculo do Imposto de Renda.' }
];
