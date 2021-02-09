/**
 *********************************************************************
 * © Copyright IBM Corp. 2020, 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *********************************************************************
*/

import { Injectable } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { ProtocolMessage, MessageRequestTypes, NavigationMessage, DisplayMessage } from '../models/post-message.interface';
import * as uuid from 'uuid/v4';
import { Subject } from 'rxjs';
import { skipWhile } from 'rxjs/operators';
import { WindowService } from '../services/window.service';

@Injectable()
export class FrameMessagingService {
  outerOrigin = '*';
  subscriptions$: Subject<ProtocolMessage> = new Subject<ProtocolMessage>();
  userToken$: Subject<{ token: string }> = new Subject<{ token: string }>();
  theme$: Subject<{ [token: string]: string }> = new Subject();

  private didInit = false;

  get isFramed(): boolean {
    return this.windowService.window.parent !== this.windowService.window;
  }

  constructor(
    private windowService: WindowService,
    private eventManager: EventManager
  ) { }

  init() {
    // Don't init twice
    if (this.didInit) {
      return;
    }
    this.didInit = true;
    if (!this.isFramed) {
      return;
    }
    this.eventManager.addGlobalEventListener('window', 'message', this.handleMessage.bind(this));
    this.outerOrigin = this.resolveOrigin();
    this.sendMessage({
      id: uuid(),
      timestamp: Date.now(),
      'x-version': '1.1.0',
      type: MessageRequestTypes.READY,
      body: {},
    });
  }

  // Method to deduce the origin of the surrounding frame, for the `targetOrigin` parameter of
  // postMessage
  resolveOrigin(): string {
    let targetUrl: string;
    try {
      // This won't work if we have a different origin
      targetUrl = this.windowService.window.parent.location.href;
    } catch (e) {
      console.log('different origin; cannot access parent.location');
    }
    // Sometimes, after using links within the frame, this will be wrong...
    // FIXME figure out why
    if (!targetUrl) {
      targetUrl = document.referrer;
    }
    try {
      const url = new URL(targetUrl);
      return url.origin;
    } catch (e) {
      // Failed to parse the URL
      return '*';
    }
  }

  sendNavigationMessage(message: NavigationMessage) {
    return this.sendMessage({
      id: uuid(),
      timestamp: Date.now(),
      'x-version': '1.1.0',
      type: MessageRequestTypes.COMMAND,
      body: message,
    });
  }

  sendDisplayMessage(message: DisplayMessage) {
    return this.sendMessage({
      id: uuid(),
      timestamp: Date.now(),
      'x-version': '1.1.0',
      type: MessageRequestTypes.COMMAND,
      body: message,
    });
  }

  sendSubscribeMessage(path: string) {
    return this.sendMessage({
      id: uuid(),
      timestamp: Date.now(),
      'x-version': '1.1.0',
      type: MessageRequestTypes.SUBSCRIBE,
      body: {},
      path,
    });
  }

  sendGetMessage(path: string) {
    return this.sendMessage({
      id: uuid(),
      timestamp: Date.now(),
      'x-version': '1.1.0',
      type: MessageRequestTypes.GET,
      body: {},
      path,
    });
  }

  requestUserToken() {
    this.sendGetMessage('user/token');
    return this.userToken$.asObservable().pipe(skipWhile(token => !token));
  }

  requestTheme() {
    this.sendGetMessage('config/theme');
    return this.theme$.asObservable().pipe(skipWhile(theme => !theme));
  }

  private sendMessage(message: ProtocolMessage) {
    console.log('FRAME: Sending message...', message);
    this.windowService.window.parent.postMessage(message, this.outerOrigin);
  }

  private handleMessage(event: MessageEvent) {
    // Ignore unexpected messages -- browser extensions etc.
    if (event.origin !== this.outerOrigin && this.outerOrigin !== '*') {
      return;
    }
    const message: ProtocolMessage = event.data;
    if (message.type === MessageRequestTypes.SUBSCRIBE_DATA) {
      console.log('FRAME: subscribe message received', message);
      this.subscriptions$.next(message);
    } else if (message.type === MessageRequestTypes.GET_DATA && message.path === 'user/token') {
      console.log('FRAME: GET token message received', message);
      this.userToken$.next(message.body);
    } else if (message.type === MessageRequestTypes.GET_DATA && message.path === 'config/theme') {
      console.log('FRAME: GET theme message received', message);
      this.theme$.next(message.body);
    }
  }
}
