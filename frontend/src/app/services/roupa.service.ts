import { Injectable } from '@angular/core';
import { IRoupa } from '../models/iroupa.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpEvent } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RoupaService {
  private apiUrl = 'http://localhost:3000/api/roupas';

  constructor(private http: HttpClient) { }

  getRoupas(): Observable<IRoupa[]> {
    return this.http.get<IRoupa[]>(this.apiUrl);
  }

  getRoupa(id: number): Observable<IRoupa> {
    return this.http.get<IRoupa>(`${this.apiUrl}/${id}`);
  }
  

  // Uma única requisição para criar roupa + upload imagem e barra de progresso
  addRoupa(roupaData: FormData): Observable<HttpEvent<any>> {
  return this.http.post(this.apiUrl, roupaData, {
    reportProgress: true,
    observe: 'events'
  });
}

  // Uma única requisição para atualizar roupa + upload imagem
  updateRoupa(id: number, roupaData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, roupaData);
  }
 // Método auxiliar para criar FormData
  createRoupaFormData(roupa: IRoupa, imagemFile?: File): FormData {
    const formData = new FormData();
    
    // Dados da roupa
    formData.append('nome', roupa.nome);
    formData.append('descricao', roupa.descricao);
    formData.append('tamanho', roupa.tamanho);
    formData.append('categoria', roupa.categoria);
    formData.append('preco_aluguel', roupa.preco_aluguel.toString());
    formData.append('status', roupa.status);
    
    // Imagem (se for um arquivo novo)
    if (imagemFile) {
      formData.append('imagem', imagemFile);
    }
    
    return formData;
  }
}
