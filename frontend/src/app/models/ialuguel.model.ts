export interface IAluguel {
    id?: number;
    cliente_id: number;
    roupa_id: number;
    data_aluguel: string;
    data_devolucao_prevista: string;
    data_devolucao_real?: string;
    valor_total: number;
    situacao: string;
    multa: number;
    cliente_nome?: string;
    roupa_nome?: string;
}
