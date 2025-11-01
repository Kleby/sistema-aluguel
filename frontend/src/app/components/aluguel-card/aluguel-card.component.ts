import { Component, input, InputSignal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SITUACAO_STYLES_BADGE } from '../../utils/design.constants';
import { ClienteRoupaModalComponent } from '../cliente-roupa.modal/cliente-roupa.modal.component';
import { IAluguel } from '../../models/ialuguel.model';

@Component({
  selector: 'app-aluguel-card',
  imports: [RouterLink, DatePipe, ClienteRoupaModalComponent],
  templateUrl: './aluguel-card.component.html',
  styleUrl: './aluguel-card.component.css',
})
export class AluguelCardComponent {
  aluguel: InputSignal<IAluguel> = input.required<IAluguel>();
  situacaoStyleBg = SITUACAO_STYLES_BADGE;

  isOpenModal = false;

  sendMensagem() {}

  handleShowModal(value: boolean) {
    this.isOpenModal = value;
  }
}
