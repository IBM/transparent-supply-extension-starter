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
import { CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '../state-management/organizations/organizations.reducer';
import { getLoading } from '../state-management/organizations/organizations.selectors';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { loadOrganizations } from '../state-management/organizations/organizations.actions';
import { getRecentLoading } from '../state-management/products/products.selectors';
import { loadRecentProducts } from '../state-management/products/products.actions';

@Injectable({
  providedIn: 'root',
})
export class DataGuard implements CanActivate {

  organizationsLoadingState$: Observable<{ isLoading: boolean; hasLoaded: boolean; }>;
  recentProductsLoadingState$: Observable<{ isLoading: boolean; hasLoaded: boolean; }>;

  constructor(
    private store: Store<State>,
  ) {
    this.organizationsLoadingState$ = store.select(getLoading);
    this.recentProductsLoadingState$ = store.select(getRecentLoading);
  }

  canActivate() {
    // If we haven't loaded organization information yet, do so
    // Same for recent products, since product data is necessary for almost all of the routes.
    return combineLatest([
      this.organizationsLoadingState$,
      this.recentProductsLoadingState$,
    ]).pipe(
      map(([orgsLoading, recentLoading]) => {
        if (!orgsLoading.isLoading && !orgsLoading.hasLoaded) {
          this.store.dispatch(loadOrganizations());
        }
        if (!recentLoading.isLoading && !recentLoading.hasLoaded) {
          this.store.dispatch(loadRecentProducts());
        }
        return true;
      }),
    );
  }
}
