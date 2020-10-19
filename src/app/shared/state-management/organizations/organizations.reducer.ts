/**
 *********************************************************************
 * © Copyright IBM Corp. 2020
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *********************************************************************
*/

import { OrganizationType } from '../../models/data.model';
import { createReducer, on, Action } from '@ngrx/store';
import { loadOrganizations, loadOrganizationsSuccess, loadOrganizationsFail } from './organizations.actions';

export interface State {
  organizationsById: {
    [key: string]: {
      name: string;
      organizationTypes: string[];
      id: string;
    };
  };
  organizationTypesById: {
    [key: string]: OrganizationType;
  };
  isLoading: boolean;
  hasLoaded: boolean;
}

export const initialState: State = {
  organizationsById: {},
  organizationTypesById: {},
  isLoading: false,
  hasLoaded: false,
};

const organizationsReducer = createReducer(
  initialState,
  on(loadOrganizations, (state) => ({ ...state, isLoading: true })),
  on(loadOrganizationsSuccess, (state, action) => {
    const newOrganizationsById = { ...state.organizationsById };
    const newOrganizationTypesById = { ...state.organizationTypesById };
    action.data.forEach((org) => {
      newOrganizationsById[org.id] = {
        name: org.name,
        id: org.id,
        organizationTypes: org.organizationTypes.map((type) => type.id),
      };
      org.organizationTypes.forEach((orgType) => {
        newOrganizationTypesById[orgType.id] = orgType;
      });
    });
    return {
      ...state,
      organizationsById: newOrganizationsById,
      organizationTypesById: newOrganizationTypesById,
      isLoading: false,
      hasLoaded: true,
    };
  }),
  on(loadOrganizationsFail, (state) => ({ ...state, isLoading: false })),
);

export function reducer (state: State | undefined, action: Action) {
  return organizationsReducer(state, action);
}

export const getOrganizationsById = (state: State) => state.organizationsById;
export const getOrganizationTypesById = (state: State) => state.organizationTypesById;
export const getLoading = (state: State) =>
  ({ isLoading: state.isLoading, hasLoaded: state.hasLoaded });
