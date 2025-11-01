import { Component, OnInit } from '@angular/core';
import { IUser } from '../../models/iuser.model';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [DatePipe, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  user: IUser | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      this.isLoggedIn = isAuthenticated;
      this.getCurrentUser();
    });
  }

  getCurrentUser(): void {
    this.authService.currentUser$.subscribe(
      (currentUser) => (this.user = currentUser)
    );
  }

  logout(): void {
    this.authService.logout();
  }
  // isActiveRoute(route: string): boolean {    
  //   return this.router.url === route;
  // }
}
