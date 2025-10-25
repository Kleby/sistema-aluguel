import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IUser } from '../models/iuser.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ILoginData } from '../models/ilogin-data.model';
import { IAuthResponse } from '../models/iauth-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private tokenKey = 'auth_token';
  private userKey = 'user_data';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<IUser | null>(this.getUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(loginData: ILoginData): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.setUser(response.user);
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(response.user);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  verifyToken(): Observable<{ valid: boolean; user: IUser }> {
    return this.http.post<{ valid: boolean; user: IUser }>(`${this.apiUrl}/verify`, {});
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setUser(user: IUser): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  private getUser(): IUser | null {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.tipo === 'admin';
  }

  isTokenExpired(): boolean {
    const user = this.getUser();
    if (!user || !user.data_expiracao) return true;

    const expirationDate = new Date(user.data_expiracao);
    const now = new Date();

    return now > expirationDate;
  }

  checkAuthentication(): boolean {
    const hasToken = this.hasToken();
    const isExpired = this.isTokenExpired();

    if (!hasToken || isExpired) {
      this.logout();
      return false;
    }

    return true;
  }
}
