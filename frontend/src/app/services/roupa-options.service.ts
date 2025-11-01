import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRoupaOptions } from '../models/iroupas-options.model';

@Injectable({
  providedIn: 'root'
})
export class RoupaOptionsService {

  private readonly apiUrl =  'http://localhost:3000/api/roupas/opcoes';


  constructor(private http: HttpClient) { }

  obterRoupaCategorias():Observable<IRoupaOptions[]>{
    return this.http.get<IRoupaOptions[]>(`${this.apiUrl}/categorias`)
  }

  obterRoupaCategoriaPorId(id:number):Observable<IRoupaOptions>{
    return this.http.get<IRoupaOptions>(`${this.apiUrl}/categorias/${id}`)
  }

  obterRoupaTamanhos():Observable<IRoupaOptions[]>{
    return this.http.get<IRoupaOptions[]>(`${this.apiUrl}/tamanhos`)
  }
  obterRoupaTamanhoPorId(id: number):Observable<IRoupaOptions>{
    return this.http.get<IRoupaOptions>(`${this.apiUrl}/tamanhos/${id}`)
  }
}
