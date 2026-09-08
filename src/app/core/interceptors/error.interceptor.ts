import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          authService.logout();
          break;
        case 403:
          toastService.error('Acesso negado');
          break;
        case 409:
          toastService.warning(error.error?.message || 'Recurso já existe');
          break;
        case 410:
          toastService.warning('Este link de convite expirou ou é inválido');
          break;
        case 422:
        case 400:
          const fieldErrors = error.error?.fieldErrors;
          if (fieldErrors) {
            const messages = Object.values(fieldErrors).join(', ');
            toastService.error(messages as string);
          } else {
            toastService.error(error.error?.message || 'Erro de validação');
          }
          break;
        case 500:
          toastService.error('Erro interno do servidor. Tente novamente.');
          break;
        default:
          if (error.status !== 0) {
            toastService.error('Ocorreu um erro inesperado');
          }
          break;
      }
      return throwError(() => error);
    }),
  );
};
