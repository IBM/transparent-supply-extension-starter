/**
 *********************************************************************
 * © Copyright IBM Corp. 2020
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *********************************************************************
*/

import { createSelector } from '@ngrx/store';
import {
  getProductsList,
  getProductsById,
  getEpcsByProductId,
} from './products/products.selectors';
import { getOrganizationsById } from './organizations/organizations.selectors';
import { Product, DenormalizedProduct } from '../models/data.model';
import { selectCurrentProduct } from './router.selectors';

export const getDenormalizedProductList = createSelector(
  getProductsList,
  getOrganizationsById,
  (products, organizationsById) => {
    return products.map((product: Product) =>
      ({ ...product, organization: organizationsById[product.org_id]}));
  },
);

export const getCurrentProduct = createSelector(
  getProductsById,
  selectCurrentProduct,
  getOrganizationsById,
  (productsById, currentProductId, organizationsById): DenormalizedProduct => {
    const thisProduct = productsById[currentProductId];
    if (!thisProduct) {
      return {
        id: currentProductId,
        org_id: '',
        object_sku: '',
        organization: null,
        description: '',
      };
    }
    return {
      ...thisProduct,
      organization: organizationsById[thisProduct.org_id],
    };
  },
);

export const getCurrentEpcs = createSelector(
  getEpcsByProductId,
  selectCurrentProduct,
  (epcsByProductId, currentProductId) => epcsByProductId[currentProductId] || [],
);
