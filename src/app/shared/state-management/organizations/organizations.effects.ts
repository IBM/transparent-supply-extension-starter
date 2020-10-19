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
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DataService } from '../../services/data.service';
import { loadOrganizations, loadOrganizationsSuccess, loadOrganizationsFail } from './organizations.actions';
import { switchMap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class OrganizationsEffects {
  loadOrganizations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrganizations),
      switchMap(() =>
        this.data.getOrganizations().pipe(
          map((response) => loadOrganizationsSuccess({ data: response })),
          catchError((error) => of(loadOrganizationsFail(error))),
        ),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private data: DataService,
  ) { }
}
