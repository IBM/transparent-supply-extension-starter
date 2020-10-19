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

@Injectable()
export class ProxyLocationStrategy implements LocationStrategy {
  innerStrategy: LocationStrategy;

  private baseHref: string;

  // The original callback passed to us by the Router
  // Necessary for dynamically switching LocationStrategy
  // Assumes that onPopState will only be called once (TODO is that a valid assumption?!)
  private popStateCallback: LocationChangeListener;

  // Keep track of references to location strategies that have been "inited" by calling onPopState,
  // so we don't bind the callbacks more than once (in the case the user is switching back and forth
  // between LocationStrategy implementations)
  private previousStrategiesMap = new Map<LocationStrategy, boolean>();

  constructor(
    @Optional() @Inject(APP_BASE_HREF) href?: string,
  ) {
    this.baseHref = href || '';
  }

  path(includeHash?: boolean): string {
    return this.innerStrategy && this.innerStrategy.path(includeHash) || '';
  }

  prepareExternalUrl(internal: string): string {
    return this.innerStrategy.prepareExternalUrl(internal);
  }

  pushState(state: any, title: string, url: string, queryParams: string): void {
    return this.innerStrategy.pushState(state, title, url, queryParams);
  }

  replaceState(state: any, title: string, url: string, queryParams: string): void {
    return this.innerStrategy.replaceState(state, title, url, queryParams);
  }
  forward(): void {
    console.log('forward');
    return this.innerStrategy.forward();
  }

  back(): void {
    console.log('back');
    return this.innerStrategy.back();
  }

  // This gets called immediately after the first `getBaseHref`, still before app.module constructor
  onPopState(fn: LocationChangeListener): void {
    // This is tricky to make changeable since there is no way to clean up the listener
    // Instead, we will check (at each call) that the chosen location strategy is still active
    if (this.previousStrategiesMap.has(this.innerStrategy)) {
      console.log('this strategy already initialized');
      return;
    }
    // Set the callback
    this.popStateCallback = fn;
    const currentStrategy = this.innerStrategy;
    if (!currentStrategy) {
      return;
    }
    const callback = function() {
      if (this.innerStrategy === currentStrategy) {
        console.log(currentStrategy);
        return fn.apply(null, arguments);
      }
    };
    this.previousStrategiesMap.set(this.innerStrategy, true);
    return this.innerStrategy.onPopState(callback.bind(this));
  }

  getBaseHref(): string {
    if (this.innerStrategy) {
      return this.innerStrategy.getBaseHref();
    }
    return this.baseHref || '';
  }

  setStrategy(strat: LocationStrategy) {
    this.innerStrategy = strat;
    // Bind the listener
    if (this.popStateCallback) {
      this.onPopState(this.popStateCallback);
    }
  }
}
