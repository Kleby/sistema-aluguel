import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLinkWithHref, RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';
import { IUser } from './models/iuser.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, DatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  implements OnInit {
  isLoggedIn = false;
  user: IUser | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isLoggedIn = isAuthenticated;
      this.getCurrentUser();
    });
  }

  getCurrentUser(): void{
    this.authService.currentUser$.subscribe(currentUser => this.user = currentUser);
  }

  logout(): void {
    this.authService.logout();
  }
    isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }
}
