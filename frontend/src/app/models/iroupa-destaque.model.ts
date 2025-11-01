export interface IRoupaDestaque{
    id: number;
    nome: string;
    categoria_id: number;
    categoria: string;
    tamanho_id: number;
    tamanho: string;
    imagem_url?: string;
    preco_aluguel: number;
    status: string;
}