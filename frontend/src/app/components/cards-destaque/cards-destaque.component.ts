import { Component, input, InputSignal, OnInit } from '@angular/core';
import { IRoupaDestaque } from '../../models/iroupa-destaque.model';
import { CurrencyPipe } from '@angular/common';
import { RoupaOptionsService } from '../../services/roupa-options.service';
import { IRoupaOptions } from '../../models/iroupas-options.model';
import { IRoupa } from '../../models/iroupa.model';

@Component({
  selector: 'app-cards-destaque',
  imports: [CurrencyPipe],
  templateUrl: './cards-destaque.component.html',
  styleUrl: './cards-destaque.component.css'
})
export class CardsDestaqueComponent {

  roupaDestaque: InputSignal<IRoupaDestaque | IRoupa> = input.required();

  showModal(id: number){
    console.log(id);
    
  }
}
