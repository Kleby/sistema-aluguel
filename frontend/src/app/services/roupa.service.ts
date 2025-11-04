import { Injectable } from '@angular/core';
import { IRoupa } from '../models/iroupa.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { IRoupaOptions } from '../models/iroupas-options.model';
import { RoupaOptionsService } from './roupa-options.service';

@Injectable({
  providedIn: 'root',
})
export class RoupaService {
  private apiUrl = 'http://localhost:3000/api/roupas';

  private roupasMock: IRoupa[] = [
    {
      id: 1,
      nome: 'Vestido Longo Floral',
      descricao:
        'Vestido longo em chiffon com estampa floral, ideal para festas',
      tamanho_id: 2,
      categoria_id: 6,
      preco_aluguel: 89.9,
      preco_compra: 340.5,
      status: 'disponivel',
      imagem_url: '',
      tamanho: 'P',
      categoria: 'Casaco',
      quantidade: 2,
    },
    {
      id: 2,
      nome: 'Calça Jeans Skinny',
      descricao: 'Calça jeans modelo skinny, cor azul claro',
      tamanho_id: 3,
      categoria_id: 4,
      preco_aluguel: 35.0,
      preco_compra: 150.5,
      status: 'disponivel',
      imagem_url: '',
      tamanho: 'M',
      categoria: 'Calça',
      quantidade: 3,
    },
  ];

  private roupaMock = {
    id: 0,
    nome: '',
    descricao: '',
    tamanho_id: 0,
    categoria_id: 0,
    categoria: '',
    tamanho: '',
    preco_aluguel: 0,
    preco_compra: 0,
    quantidade: 0,
    status: '',
    imagem_url: '',
  };

  constructor(private http: HttpClient) {
    this.roupasMock.push();
  }

  getRoupasMock(): IRoupa[] {
    return this.roupasMock;
  }
  getRoupaMock(id: number): IRoupa { 
    return this.roupasMock.find((roupa) => Number(roupa.id) === Number(id)) ?? this.roupaMock;
  }

  addRoupaMock(roupa: IRoupa): void {
    this.roupasMock.push(roupa);
  }

  updateRoupaMock(id: number, roupa: IRoupa): void {
    const index = this.roupasMock.findIndex((r) => r.id === id);
    if (index === -1) {
      alert('roupa não encontrada');
      return;
    }
    this.roupasMock[index] = roupa;
  }
  deleteRoupaMock(id: number) {
    const index = this.roupasMock.findIndex((r) => r.id === id);
    if (index === -1) {
      alert('roupa não encontrada');
    }
    this.roupasMock.splice(index, 1);
  }

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
      observe: 'events',
    });
  }
  // Uma única requisição para atualizar roupa + upload imagem
  updateRoupa(id: number, roupaData: FormData): Observable<HttpEvent<any>> {
    return this.http.put(`${this.apiUrl}/${id}`, roupaData, {
      reportProgress: true,
      observe: 'events',
    });
  }

  deleteRoupa(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  // Método auxiliar para criar FormData
  createRoupaFormData(roupa: IRoupa, imagemFile?: File): FormData {
    const formData = new FormData();

    // Dados da roupa
    formData.append('nome', roupa.nome);
    formData.append('descricao', roupa.descricao);
    formData.append('tamanho_id', roupa.tamanho_id.toString());
    formData.append('categoria_id', roupa.categoria_id.toString());
    formData.append('preco_compra', roupa.preco_compra.toString());
    formData.append('preco_aluguel', roupa.preco_aluguel.toString());
    formData.append('quantidade', roupa.quantidade.toString());
    formData.append('status', roupa.status ?? 'disponivel');

    // Imagem (se for um arquivo novo)
    if (imagemFile) {
      formData.append('imagem', imagemFile);
    }
    return formData;
  }
}
