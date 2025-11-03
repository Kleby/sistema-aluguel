import { Injectable } from '@angular/core';
import { IAluguel } from '../models/ialuguel.model';

@Injectable({
  providedIn: 'root'
})


export class RecebimentoService {
  
  recebimentos: IRecebimento[] = [];
  
  constructor() { }
  
  getRecebimentos(){
    return this.recebimentos;
  }
  
  addRecebimentos(aluguel:IAluguel) {
    const {valor_total, data_hora_faturamento, cliente, pago } = aluguel;
    this.recebimentos.push({valor_total, data_hora_faturamento, cliente, pago});
  }  
}

interface IRecebimento {
  valor_total: number;
  data_hora_faturamento: string | Date;
  cliente?: string;
  pago: boolean;
}