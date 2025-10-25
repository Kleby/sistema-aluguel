export interface IAluguelCardDTO {
  id: number;
  roupa_imagem: string;
  cliente_nome: string;
  roupa_nome: string;
  data_aluguel: string | Date;
  data_devolucao_prevista: string | Date;
  situacao: string;
  dias_atrasos: number;
  valor_total: number;
  valor_taxa: number;
  cliente_id: number;
}
