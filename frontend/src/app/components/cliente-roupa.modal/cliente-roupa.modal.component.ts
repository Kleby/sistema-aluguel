import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { IAluguelModal } from '../../models/ialuguel-modal.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cliente-roupa_modal',
  imports: [CurrencyPipe],
  templateUrl: './cliente-roupa.modal.component.html',
  styleUrl: './cliente-roupa.modal.component.css'
})
export class ClienteRoupaModalComponent {
  
  roupaModal:InputSignal<IAluguelModal> = input.required<IAluguelModal>();
  onIsOpenModalChange: OutputEmitterRef<boolean> = output<boolean>();
  
  closeModal(){
    this.onIsOpenModalChange.emit(false);
  }

}
