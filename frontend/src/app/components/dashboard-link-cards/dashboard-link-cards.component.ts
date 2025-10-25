import { Component, input, InputSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Themes } from '../../theme.config';

@Component({
  selector: 'app-dashboard-link-cards',
  imports: [RouterLink],
  templateUrl: './dashboard-link-cards.component.html',
  styleUrl: './dashboard-link-cards.component.css'
})
export class DashboardLinkCardsComponent {

  pageLink: InputSignal<string> = input.required<string>();
  cardTitle: InputSignal<string> = input.required<string>();
  totalStats: InputSignal<number> = input.required<number>();
  availableStats: InputSignal<string> = input<string>('');
  unavailableStats: InputSignal<string> = input<string>('');
  
  // Temas
  faIcon: InputSignal<string> = input.required<string>();
  iconBg: InputSignal<string> = input<string>('');
  textColor: InputSignal<string> = input<string>('');
  unavailabeColor: InputSignal<string> = input<string>('');
  labelIcon: InputSignal<boolean> = input<boolean>(false);

}
