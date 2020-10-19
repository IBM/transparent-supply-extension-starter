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
import { OrganizationsResponse } from '../../models/data.model';

export const loadOrganizations = createAction('[Organizations] Load Organizations');
export const loadOrganizationsSuccess = createAction(
  '[Organizations] Load Organizations Success',
  props<{ data: OrganizationsResponse }>(),
);
export const loadOrganizationsFail = createAction(
  '[Organizations] Load Organizations Fail',
  props<{ error: Error }>(),
);
