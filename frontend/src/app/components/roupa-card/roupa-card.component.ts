import { Component, input, InputSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IRoupa } from '../../models/iroupa.model';
import { IAluguel } from '../../models/ialuguel.model';

@Component({
  selector: 'app-roupa-card',
  imports: [RouterLink],
  templateUrl: './roupa-card.component.html',
  styleUrl: './roupa-card.component.css',
})
export class RoupaCardComponent {
  roupa: InputSignal<IRoupa> = input.required<IRoupa>();

  constructor(private router: Router) {}

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'disponivel':
        return 'bg-success';
      case 'alugado':
        return 'bg-warning';
      case 'manutencao':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'disponivel':
        return 'Disponível';
      case 'alugado':
        return 'Alugado';
      case 'manutencao':
        return 'Manutenção';
      default:
        return status;
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  navigateToAluguel(roupa: IRoupa): void {
    // Aqui você pode implementar a navegação para o formulário de aluguel
    if (roupa.status === 'disponivel') {
      this.router.navigate(['/alugueis/novo'], {
        queryParams: { roupa_id: roupa.id },
      });
    }
  }
}
