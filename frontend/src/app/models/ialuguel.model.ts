export interface IAluguel {
    id: number;
    cliente_id: number;
    roupa_id: number;
    usuario_id?:number;
    data_aluguel: string;
    data_devolucao_prevista: string;
    data_devolucao_real?: string;
    subtotal?:number;
    valor_total: number;
    situacao: string;
    valor_taxa:number;
    cliente?: string;
    roupa?: string;
    roupa_imagem?: string;
    pago: boolean;
    data_hora_faturamento: Date | string;
}
