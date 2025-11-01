export interface IAluguelModal{
    id: number;
    roupa_imagem?: string;
    roupa?: string;
    cliente?: string;
    dias_atrasos?: number;
    valor_taxa?:number;
    subtotal?: number;
    valor_total: number;
}