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
import * as fromStore from './organizations.reducer';
import * as _ from 'lodash';

export const getOrganizationsState = createFeatureSelector<fromStore.State>('organizations');

export const getOrganizationsById = createSelector(
  getOrganizationsState,
  fromStore.getOrganizationsById
);
export const getOrganizationTypesById = createSelector(
  getOrganizationsState,
  fromStore.getOrganizationTypesById
);
export const getLoading = createSelector(getOrganizationsState, fromStore.getLoading);
export const getOrganizationById = createSelector(
  getOrganizationsById,
  (orgs, props) => orgs[props.id],
);
