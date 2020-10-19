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
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FrameMessagingService } from '../frame/frame-messaging.service';
import { WindowService } from './window.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private didInit = false;

  private tokenSubject = new BehaviorSubject<string>('');

  private currentToken$ = this.tokenSubject.asObservable();

  constructor(
    private frameMessagingService: FrameMessagingService,
    private window: WindowService,
  ) {
  }

  init() {
    if (this.didInit) {
      return;
    }
    this.didInit = true;
    if (this.frameMessagingService.isFramed) {
      this.frameMessagingService.subscriptions$.subscribe((message) => {
        if (message.path === 'user/token') {
          if (message.body && message.body.token) {
            this.tokenSubject.next(message.body && message.body.token);
          }
        }
      });
      this.frameMessagingService.sendSubscribeMessage('user/token');
    } else {
      this.tokenSubject.next(this.window.window.sessionStorage.getItem('id_token'));
    }
  }

  isLoggedIn(): Observable<boolean> {
    this.init();
    return this.currentToken$.pipe(
      map(t => !!t),
    );
  }

  public getCurrentToken(): Observable<string> {
    return this.currentToken$;
  }

  public parseToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }

  public setToken(token: string) {
    if (!this.frameMessagingService.isFramed) {
      this.window.window.sessionStorage.setItem('id_token', token);
      this.tokenSubject.next(token);
    }
  }
}
