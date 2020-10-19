/**
 *********************************************************************
 * © Copyright IBM Corp. 2020
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *********************************************************************
*/

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { FrameMessagingService } from '../frame/frame-messaging.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
    private frame: FrameMessagingService,
  ) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {

    const loggedIn = this.authService.isLoggedIn();

    return loggedIn.pipe(
      map((value) => {
        if (!value && !this.frame.isFramed) {
          this.router.navigate(['login']);
          return false;
        }
        return true;
      }),
    );
  }

}


