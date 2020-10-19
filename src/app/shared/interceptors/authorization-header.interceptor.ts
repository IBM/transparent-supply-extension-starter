/**
 *********************************************************************
 * © Copyright IBM Corp. 2020
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *********************************************************************
*/

import { HttpInterceptor, HttpRequest, HttpEvent, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { switchMap, skipWhile, take } from 'rxjs/operators';

export class AuthorizationHeaderInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService,
  ) {

  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.auth.getCurrentToken().pipe(
      skipWhile((t) => !t),
      take(1),
      switchMap((token) => {
        const authorization = 'Bearer ' + token;
        const clonedRequest = req.clone({ setHeaders: { Authorization: authorization } });
        return next.handle(clonedRequest);
      }),
    );
  }
}
