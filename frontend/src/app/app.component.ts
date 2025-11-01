import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLinkWithHref, RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';
import { IUser } from './models/iuser.model';
import { DatePipe } from '@angular/common';
import { HeaderComponent } from "./templates/header/header.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  {
  title = "Loja de Roupas";

}
