import { HttpErrorResponse, HttpHandler, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService)
  const router = inject(Router)
  const token = authService.getToken();

  let authReq = req;

  if (token && (req.url.includes('/api/') || req.url.includes('localhost:3000/api'))) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Token adicionado à requisição:', req.url); // Debug

  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.log('Erro 401 - Token inválido ou expirado');
        authService.logout();
        router.navigate(["/login"], {
          queryParams: {
            returnUrl: router.url
          }
        });
      }
      return throwError(() => error);
    })
  )
};
