/**
 *********************************************************************
 * © Copyright IBM Corp. 2020
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *********************************************************************
*/

import { createReducer, on, Action } from '@ngrx/store';
import {
  loadProducts,
  loadProductsSuccess,
  loadProductsFail,
  loadRecentProductsSuccess,
  loadRecentProducts,
  loadRecentProductsFail,
} from './products.actions';
import { Product } from '../../models/data.model';
import * as _ from 'lodash';

export interface State {
  productsById: { [key: string]: Product };
  productStatusById: { [key: string]: {
    hasLoaded: boolean;
  }};
  epcsByProductId: { [key: string]: string[] };
  // Loading state for recent products
  recentIsLoading: boolean;
  recentHasLoaded: boolean;
  // For any of the product details
  detailsIsLoading: boolean;
}

export const initialState: State = {
  productsById: {},
  productStatusById: {},
  epcsByProductId: {},
  recentIsLoading: false,
  recentHasLoaded: false,
  detailsIsLoading: false,
};

const productsReducer = createReducer(
  initialState,
  on(loadProducts, (state) => ({ ...state, detailsIsLoading: true })),
  on(loadProductsSuccess, (state, action) => {
    const newProductsById = { ...state.productsById };
    const newProductStatusById = { ...state.productStatusById };
    action.data.products.forEach((product) => {
      newProductsById[product.id] = {
        ...newProductsById[product.id],
        ...product,
      };
      newProductStatusById[product.id] = { hasLoaded: true };
    });
    return {
      ...state,
      productsById: newProductsById,
      productStatusById: newProductStatusById,
      detailsIsLoading: false,
    };
  }),
  on(loadProductsFail, (state) => ({ ...state, detailsIsLoading: false })),
  on(loadRecentProducts, (state) => ({ ...state, recentIsLoading: true })),
  on(loadRecentProductsSuccess, (state, action) => {
    const newProductStatusById = { ...state.productStatusById };
    const newEpcsByProductId = { ...state.epcsByProductId };
    action.data.lots_and_serials.forEach((item) => {
      newProductStatusById[item.product_id] = {
        hasLoaded: false,
        ...newProductStatusById[item.product_id],
      };
      if (!newEpcsByProductId[item.product_id]) {
        newEpcsByProductId[item.product_id] = [];
      }
      newEpcsByProductId[item.product_id] = _.union([item.id], newEpcsByProductId[item.product_id]);
    });
    return {
      ...state,
      productStatusById: newProductStatusById,
      epcsByProductId: newEpcsByProductId,
      recentIsLoading: false,
      recentHasLoaded: true,
    };
  }),
  on(loadRecentProductsFail, (state) => ({ ...state, recentIsLoading: false })),
);

export function reducer (state: State | undefined, action: Action) {
  return productsReducer(state, action);
}

export const getProductsById = (state: State) => state.productsById;
export const getProductStatusById = (state: State) => state.productStatusById;
export const getEpcsByProductId = (state: State) => state.epcsByProductId;
export const getRecentLoading = (state: State) => ({
  isLoading: state.recentIsLoading,
  hasLoaded: state.recentHasLoaded,
});
export const getDetailsIsLoading = (state: State) => state.detailsIsLoading;
