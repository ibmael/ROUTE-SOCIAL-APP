import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

const AUTH_PATHS = ['/users/signin', '/users/signup'];

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);
  const skipToast = AUTH_PATHS.some((path) => req.url.includes(path));

  return next(req).pipe(
    catchError((err) => {
      if (!skipToast) {
        const message = err.error?.message ?? err.message ?? 'Something went wrong';
        toastr.error(message, 'Error');
      }
      return throwError(() => err);
    }),
  );
};
