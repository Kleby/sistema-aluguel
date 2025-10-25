import { Component, input, InputSignal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ISituacao } from '../../models/isituacao';
import { IAluguelCardDTO } from '../../models/ialuguel-card-dto';
import { FormatDatePipe } from '../../pipes/format-date.pipe';

@Component({
  selector: 'app-aluguel-card',
  imports: [RouterLink, FormatDatePipe],
  templateUrl: './aluguel-card.component.html',
  styleUrl: './aluguel-card.component.css',
})
export class AluguelCardComponent implements OnInit {

  aluguel: InputSignal<IAluguelCardDTO> = input.required<IAluguelCardDTO>();

  ngOnInit(): void {
    console.log(this.aluguel());
    
  }

  // modalEnabled
  getStatusBadgeClass(situacao: string): string {
    
    // return this.situacao[situacao] ?? ""
    switch (situacao) {
      case 'devolvido':
        return 'bg-success';
      case 'atrasado':
        return 'bg-danger';
      default:
        return 'bg-primary';
    }
  }

  getStatusText(situacao: string): string {
    switch (situacao) {
      case 'em dias':
        return 'em dias';
      case 'devolvida':
        return 'devolvida';
      case 'atrasada':
        return 'atrasada';
      default:
        return situacao;
    }    
  }

    formatCurrency(diasAtraos: number): string {

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(diasAtraos * this.aluguel().valor_taxa);
  }
  sendMensagem(){}

  showModal(id: number){
    alert("id: "+ id);
  }
}
