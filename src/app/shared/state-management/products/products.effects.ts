/**
 *********************************************************************
 * © Copyright IBM Corp. 2020
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *********************************************************************
*/

import { createEffect, ofType, Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { DataService } from '../../services/data.service';
import {
  loadProducts,
  loadProductsSuccess,
  loadProductsFail,
  loadRecentProducts,
  loadRecentProductsSuccess,
  loadRecentProductsFail,
} from './products.actions';
import { switchMap, map, catchError, withLatestFrom, filter, delay } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { getUnloadedProducts, getDetailsIsLoading } from './products.selectors';
import * as _ from 'lodash';

@Injectable()
export class ProductsEffects {
  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProducts),
      switchMap((action) =>
        this.data.getProductDetails(action.ids).pipe(
          map((response) => {
            // If there some we requested but didn't get back,
            // we'll just end up requesting those again. So "cheat" a fake entry in
            if (response.products.length < action.ids.length) {
              console.warn('Missing some products');
              action.ids.forEach((id) => {
                if (!_.find(response.products, (product) => product.id === id)) {
                  console.warn(`Adding empty entry for ${id}`);
                  response.products.push({
                    id,
                    description: '',
                    object_sku: '',
                    org_id: '',
                  });
                }
              });
            }
            return loadProductsSuccess({ data: response });
          }),
          catchError((error) => of(loadProductsFail({ error: error.message }))),
        ),
      ),
    ),
  );

  loadRecentProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadRecentProducts),
      switchMap(() =>
        this.data.getRecentEpcs().pipe(
          map((response) => loadRecentProductsSuccess({ data: response })),
          catchError((error) => of(loadRecentProductsFail({ error: error.message }))),
        ),
      ),
    ),
  );

  // After loading the IDs of products, load the product details so we can display them
  // The API has a limit of 30 though, so we'll do this iteratively
  loadProductsDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        loadRecentProductsSuccess,
        loadProductsSuccess,
      ),
      withLatestFrom(
        this.store.select(getUnloadedProducts),
        this.store.select(getDetailsIsLoading),
      ),
      filter(([_a, unloadedProductIds, isLoading]) => !!unloadedProductIds.length && !isLoading),
      delay(10),
      map(([action, unloadedProductIds]) => {
        const apiLimit = 30;
        const toBeFetched = unloadedProductIds.slice(0, apiLimit);
        // Triggers next "page"
        return loadProducts({ ids: toBeFetched });
      }),
    ),
  );

  constructor(
    private actions$: Actions,
    private data: DataService,
    private store: Store<any>,
  ) { }
}
