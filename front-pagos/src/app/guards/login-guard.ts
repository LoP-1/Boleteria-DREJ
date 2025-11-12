import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const dni = localStorage.getItem('dni');
  
  if (dni) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};