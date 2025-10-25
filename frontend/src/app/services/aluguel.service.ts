import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAluguel } from '../models/ialuguel.model';
import { HttpClient } from '@angular/common/http';
import { IAluguelCardDTO } from '../models/ialuguel-card-dto';

@Injectable({
  providedIn: 'root'
})
export class AluguelService {
  private apiUrl = 'http://localhost:3000/api/alugueis';

  constructor(private http: HttpClient) { }

  getAlugueis(): Observable<IAluguel[]> {
    return this.http.get<IAluguel[]>(this.apiUrl);
  }

  createAluguel(aluguel: Omit<IAluguel, 'id'>): Observable<any> {
    return this.http.post(this.apiUrl, aluguel);
  }

  getAluguelByClienteId(clienteId: number): Observable<IAluguel>{
    return this.http.get<IAluguel>(`${this.apiUrl}/id/${clienteId}`);
  }

  getAlugueisDTOCard(): Observable<IAluguelCardDTO[]>{
    return this.http.get<IAluguelCardDTO[]>(`${this.apiUrl}/ativos`)
  }
}
