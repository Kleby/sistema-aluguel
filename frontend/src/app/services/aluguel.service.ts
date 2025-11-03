import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAluguel } from '../models/ialuguel.model';
import { HttpClient } from '@angular/common/http';
import { IRoupaOptions } from '../models/iroupas-options.model';
import { RecebimentoService } from './recebimento.service';

@Injectable({
  providedIn: 'root',
})
export class AluguelService {
  private apiUrl = 'http://localhost:3000/api/alugueis';

  private listAluguelMock: IAluguel[] = [];

  private readonly aluguelMock:IAluguel = {
    id: 0,
    cliente_id: 0,
    roupa_id: 0,
    usuario_id: 0,
    data_aluguel: '',
    data_devolucao_prevista: '',
    data_devolucao_real: '',
    subtotal: 0,
    valor_total: 0,
    situacao: '',
    valor_taxa: 0,
    cliente: '',
    roupa: '',
    pago: false,
    data_hora_faturamento: new Date().toLocaleString(),
  };

  //simular o backend com adição de recebiemntos services
  constructor(private http: HttpClient, private recebimentoService :RecebimentoService) {}

  getAlugueisMock(): IAluguel[] {
    return this.listAluguelMock;
  }

  addAlugueisMock(aluguel: IAluguel) {
    this.recebimentoService.addRecebimentos(aluguel);
    this.listAluguelMock.push(aluguel);
  }

  getAluguelById(id: number): IAluguel {
    return this.listAluguelMock.find((al) => al.id === id) ?? this.aluguelMock;
  }

  updateAlugueisMock(id: number, aluguel:IAluguel){
    const index = this.listAluguelMock.findIndex((al) => al.id === id)
    if (index !== -1) {
      alert("Não foi possível atualizar o aluguel");
      return
    }
    this.listAluguelMock[index] = aluguel;
  }

  deleteAlugueisMock(id:number){
    const index = this.listAluguelMock.findIndex((al) => al.id === id);
    if (index !== -1){
      alert("não foi possível deletar o aluguel");
      return;
    }
    this.listAluguelMock.splice(index, 1);
  } 

  getAlugueis(): Observable<IAluguel[]> {
    return this.http.get<IAluguel[]>(this.apiUrl);
  }

  createAluguel(aluguel: Omit<IAluguel, 'id'>): Observable<any> {
    return this.http.post(this.apiUrl, aluguel);
  }

  getAluguelByClienteId(clienteId: number): Observable<IAluguel> {
    return this.http.get<IAluguel>(`${this.apiUrl}/id/${clienteId}`);
  }

  getAlugueisDTOCard(): Observable<IAluguel[]> {
    return this.http.get<IAluguel[]>(`${this.apiUrl}/ativos`);
  }
}
