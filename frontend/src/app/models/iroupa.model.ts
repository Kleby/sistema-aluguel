export interface IRoupa {
    id: number;
    nome: string;
    descricao: string;
    tamanho_id: number;
    categoria_id: number;
    categoria?: string;
    tamanho?: string;
    preco_aluguel: number;
    preco_compra: number;
    quantidade: number;
    status: string;
    imagem_url: string;
    created_at?: string;
}
