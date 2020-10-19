/**
 *********************************************************************
 * © Copyright IBM Corp. 2020
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *********************************************************************
*/

import { createAction, props } from '@ngrx/store';
import { ProductsResponse, EpcResponse } from '../../models/data.model';

export const loadProducts = createAction(
  '[Products] Load Products',
  props<{ ids: string[] }>(),
);
export const loadProductsSuccess = createAction(
  '[Products] Load Products Success',
  props<{ data: ProductsResponse }>(),
);
export const loadProductsFail = createAction(
  '[Products] Load Products Fail',
  props<{ error: string }>(),
);

export const loadRecentProducts = createAction('[Products] Load Recent Products');
export const loadRecentProductsSuccess = createAction(
  '[Products] Load Recent Products Success',
  props<{ data: EpcResponse }>(),
);
export const loadRecentProductsFail = createAction(
  '[Products] Load Recent Products Fail',
  props<{ error: string }>(),
);

