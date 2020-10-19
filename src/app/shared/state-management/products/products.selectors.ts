/**
 *********************************************************************
 * © Copyright IBM Corp. 2020
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *********************************************************************
*/

import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromStore from './products.reducer';
import * as _ from 'lodash';

export const getProductsState = createFeatureSelector<fromStore.State>('products');

export const getProductsById = createSelector(getProductsState, fromStore.getProductsById);
export const getProductStatusById
  = createSelector(getProductsState, fromStore.getProductStatusById);
export const getEpcsByProductId = createSelector(getProductsState, fromStore.getEpcsByProductId);
export const getRecentLoading = createSelector(getProductsState, fromStore.getRecentLoading);
export const getDetailsIsLoading = createSelector(getProductsState, fromStore.getDetailsIsLoading);

export const getUnloadedProducts = createSelector(getProductStatusById, (productStatusById) => {
  return Object.keys(productStatusById).filter((id) => !productStatusById[id].hasLoaded);
});

export const getProductsList = createSelector(getProductsById, _.values);
