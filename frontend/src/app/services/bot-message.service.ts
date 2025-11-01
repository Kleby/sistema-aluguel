import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBotMessage } from '../models/ibot-message.model';

@Injectable({
  providedIn: 'root'
})
export class BotMessageService {

  private readonly apiUrl = "http://localhost:3000/api/bot"
  constructor(private http: HttpClient) { }

  criarMensagem(mensagem: string): Observable<IBotMessage>{
    return this.http.post<IBotMessage>(`${this.apiUrl}/criar-mensagem`, {mensagem});
  }

  obterTodas():Observable<IBotMessage[]> {
    return this.http.get<IBotMessage[]>(`${this.apiUrl}/mensagens`);
  }

  obterPorId(id:number): Observable<IBotMessage> {
    return this.http.get<IBotMessage>(`${this.apiUrl}/${id}`);
  }

  enviarMensagem(){}

}
