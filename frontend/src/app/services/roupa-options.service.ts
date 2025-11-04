import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRoupaOptions } from '../models/iroupas-options.model';

@Injectable({
  providedIn: 'root',
})
export class RoupaOptionsService {
  private readonly apiUrl = 'http://localhost:3000/api/roupas/opcoes';

  private tamanhosMock: IRoupaOptions[] = [
    {
      id: 1,
      nome: 'pp',
    },
    {
      id: 2,
      nome: 'p',
    },
    {
      id: 3,
      nome: 'M',
    },
    {
      id: 4,
      nome: 'G',
    },
    {
      id: 5,
      nome: 'GG',
    },
  ];

  private categoriasMock: IRoupaOptions[] = [
    {
      id: 1,
      nome: 'Vestido',
    },
    {
      id: 2,
      nome: 'Blusa',
    },
    {
      id: 3,
      nome: 'Casaco',
    },
    {
      id: 4,
      nome: 'Roupa Íntima',
    },
    {
      id: 5,
      nome: 'Acessório',
    },
    {
      id: 6,
      nome: 'Calça',
    },
  ];

  constructor(private http: HttpClient) {}

  getRoupasCategoriasMock(){
    return this.categoriasMock;
  }

  addRoupaCategoriaMock(categoria: IRoupaOptions){
    this.categoriasMock.push(categoria);
  }

  getRoupasTamanhos(){
    return this.tamanhosMock;
  }

  addRoupaTamanhoMock(tamanho: IRoupaOptions){
    this.tamanhosMock.push(tamanho);
  }

  // Dados com api

  obterRoupaCategorias(): Observable<IRoupaOptions[]> {
    return this.http.get<IRoupaOptions[]>(`${this.apiUrl}/categorias`);
  }

  obterRoupaCategoriaPorId(id: number): Observable<IRoupaOptions> {
    return this.http.get<IRoupaOptions>(`${this.apiUrl}/categorias/${id}`);
  }

  obterRoupaTamanhos(): Observable<IRoupaOptions[]> {
    return this.http.get<IRoupaOptions[]>(`${this.apiUrl}/tamanhos`);
  }
  obterRoupaTamanhoPorId(id: number): Observable<IRoupaOptions> {
    return this.http.get<IRoupaOptions>(`${this.apiUrl}/tamanhos/${id}`);
  }
}
