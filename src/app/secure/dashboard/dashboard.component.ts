/**
 *********************************************************************
 * © Copyright IBM Corp. 2020
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *********************************************************************
*/

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { Organization } from '../../shared/models/data.model';
import { Store } from '@ngrx/store';
import { switchMap, filter, catchError } from 'rxjs/operators';
import { getOrganizationById } from '../../shared/state-management/organizations/organizations.selectors';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  currentOrganization$: Observable<Organization>;

  constructor(
    private auth: AuthService,
    private store: Store,
  ) { }

  ngOnInit() {
    this.currentOrganization$ = this.auth.getCurrentToken().pipe(
      filter(token => !!token),
      switchMap((token) => {
        const info = JSON.parse(atob(token.split('.')[1]));
        return this.store.select(getOrganizationById, { id: info.oid });
      }),
      catchError((e) => {
        console.warn(e);
        return null;
      })
    );
  }

}
