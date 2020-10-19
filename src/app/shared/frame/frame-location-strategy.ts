/**
 *********************************************************************
 * © Copyright IBM Corp. 2020
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *********************************************************************
*/

import {
  LocationStrategy,
  LocationChangeListener,
  APP_BASE_HREF,
} from '@angular/common';
import { Injectable, Optional, Inject } from '@angular/core';
import { FrameMessagingService } from './frame-messaging.service';
import { NavigationMessage, NavigationType, CommandType } from '../models/post-message.interface';

@Injectable()
export class FrameLocationStrategy implements LocationStrategy {

  private baseHref: string;

  private internalPath = '/'; // Same default as MockLocationStrategy

  private popStateFn: LocationChangeListener;

  private didInit = false;

  constructor(
    private messaging: FrameMessagingService,
    @Optional() @Inject(APP_BASE_HREF) href?: string,
  ) {
    // Same logic as HashLocationStrategy; PathLocationStrategy does more...?
    this.baseHref = href || '';
    // Initial app route, if provided to the iframe
    // Uses same logic as PathLocationStrategy
    this.internalPath = window.location.pathname + window.location.search;
  }

  path(_includeHash?: boolean): string {
    return this.internalPath;
  }

  prepareExternalUrl(internal: string): string {
    let value;
    // Faux path.join()
    if (internal.startsWith('/') && this.baseHref.endsWith('/')) {
      value = this.baseHref + internal.substring(1);
    }
    value = this.baseHref + internal;
    return value;
  }

  pushState(state: any, title: string, url: string, queryParams: string): void {
    this.internalPath = url;
    if (this.didInit) {
      this.messaging.sendNavigationMessage({
        commandType: CommandType.navigate,
        navigationType: NavigationType.pushState,
        url, // TODO query params
        state,
        title,
      });
    }
  }

  replaceState(state: any, title: string, url: string, queryParams: string): void {
    this.internalPath = url;
    // This `didInit` check is necessary because for some reason the router will call this almost
    // immediately, and will overwrite the URL with the initial state.
    if (this.didInit) {
      this.messaging.sendNavigationMessage({
        commandType: CommandType.navigate,
        navigationType: NavigationType.replaceState,
        url, // TODO query params
        state,
        title,
      });
    }
  }
  forward(): void {
    console.log('frame: forward');
  }

  back(): void {
    console.log('frame: back');
  }

  onPopState(fn: LocationChangeListener): void {
    this.popStateFn = fn;
  }

  // This gets called very early, even before app.module constructor
  getBaseHref(): string {
    return this.baseHref || '';
  }

  // Declares to the outer frame that I am a routed app, and I care about route changes.
  // Does so by sending a SUBSCRIBE to "navigation" data
  init() {
    this.messaging.sendSubscribeMessage('navigation');
    this.messaging.subscriptions$.subscribe((event) => {
      if (event.path === 'navigation') {
        const nav: NavigationMessage = event.body;
        if (nav.navigationType === NavigationType.popState) {
          this.internalPath = nav.url;
          this.popStateFn({
            type: 'popstate',
            state: nav.state,
          });
          // Wait til the next frame before declaring init. The router is going to call pushState
          // and we want to skip the first one, otherwise we can get stuck bouncing back and forth
          // between two routes (out of sync messages).
          if (nav.initial) {
            setTimeout(() => this.didInit = true, 0);
          }
        }
      }
    });
  }
}
