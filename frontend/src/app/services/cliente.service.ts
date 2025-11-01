import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICliente } from '../models/icliente.model';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private apiUrl = 'http://localhost:3000/api/clientes';

  private listClientesMock: ICliente[] = [
    {
      nome: 'Maria Silva',
      email: 'maria@email.com',
      telefone: '(11) 99999-1111',
      cpf: '123.456.789-00',
      endereco: 'Rua A, 123 - Centro - São Paulo/SP',
    },
    {
      nome: 'João Santos',
      email: 'joao@email.com',
      telefone: '(11) 99999-2222',
      cpf: '987.654.321-00',
      endereco: 'Av. B, 456 - Jardins - São Paulo/SP',
    },{
      nome:'Ana Oliveira',
      email: 'ana@email.com',
      telefone: '(11) 99999-3333',
      cpf: '111.222.333-44',
      endereco: 'Rua C, 789 - Moema - São Paulo/SP'
    }
  ];
  private clienteMock: ICliente = {
    id: 0,
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    endereco: '',
    created_at: '',
  };

  constructor(private http: HttpClient) {}

  getClientes(): Observable<ICliente[]> {
    return this.http.get<ICliente[]>(this.apiUrl);
  }

  getClientesMock(): ICliente[] {
    return this.listClientesMock;
  }

  getCliente(id: number): Observable<ICliente> {
    return this.http.get<ICliente>(`${this.apiUrl}/${id}`);
  }

  getClienteMock(id: number): ICliente {
    return this.listClientesMock.find((c) => c.id === id) ?? this.clienteMock;
  }

  createCliente(cliente: ICliente): Observable<any> {
    return this.http.post(this.apiUrl, cliente);
  }

  addCliente(cliente: ICliente): void {
    this.listClientesMock.push(cliente);
  }

  updateCliente(id: number, cliente: ICliente): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, cliente);
  }

  updateClienteMock(id: number, cliente: ICliente): void {
    const index = this.listClientesMock.findIndex((r) => r.id === id);
    if (index === -1) {
      alert('cliente não encontrado');
      return;
    }
    this.listClientesMock[index] = cliente;
  }

  deleteCliente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  deleteClienteMock(id: number): void {
    const index = this.listClientesMock.findIndex((c) => c.id === id);
    this.listClientesMock.splice(index, 1);
  }
}
