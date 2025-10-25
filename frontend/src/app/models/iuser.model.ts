export interface IUser {
  id: number;
  nome: string;
  email: string;
  tipo: 'admin' | 'funcionario';
  status: 'ativo' | 'inativo';
  data_expiracao: string;
}
