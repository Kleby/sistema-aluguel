import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(!authService.checkAuthentication()){
    router.navigate(["/login"], {
      queryParams: {
        returnUrl: router.url
      }
    });
    return false;
  }

  //Verificar se a rota requer pernissão de admin
  if(route.data["admin"] && !authService.isAdmin()){
    router.navigate(["/unauthorized"])
    return false;
  }

  return true;
};
