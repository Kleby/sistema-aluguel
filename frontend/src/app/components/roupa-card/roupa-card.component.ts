import { Component, input, InputSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IRoupa } from '../../models/iroupa.model';
import { CurrencyPipe } from '@angular/common';
import { SITUACAO_STYLES_BADGE } from '../../utils/design.constants';

@Component({
  selector: 'app-roupa-card',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './roupa-card.component.html',
  styleUrl: './roupa-card.component.css',
})
export class RoupaCardComponent {
  situacaoStyle = SITUACAO_STYLES_BADGE;

  roupa: InputSignal<IRoupa> = input.required<IRoupa>();

  constructor(private router: Router) {}


  navigateToAluguel(roupa: IRoupa): void {
    // Aqui você pode implementar a navegação para o formulário de aluguel
    if (roupa.status === 'disponivel') {
      this.router.navigate(['/alugueis/novo'], {
        queryParams: { roupa_id: roupa.id },
      });
    }
  }
}
