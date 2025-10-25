import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'app-cliente-roupa.moodal',
  imports: [],
  templateUrl: './cliente-roupa.moodal.component.html',
  styleUrl: './cliente-roupa.moodal.component.css'
})
export class ClienteRoupaMoodalComponent {
  
  diasAtrasados: InputSignal<number> = input<number>(0);

}
