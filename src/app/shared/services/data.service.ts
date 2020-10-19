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
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ProductsResponse, EpcResponse, OrganizationsResponse } from '../models/data.model';
import { Observable } from 'rxjs';

const WEEK = 7 * 24 * 60 * 60 * 1000;
const MONTH = WEEK * 4;

@Injectable({
  providedIn: 'root',
})
export class DataService {

  constructor(
    private http: HttpClient,
  ) { }

  getProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(environment.productsUrl);
  }

  getRecentEpcs(since = MONTH): Observable<EpcResponse> {
    const then = Date.now() - since;
    const startTimeIso = new Date(then).toISOString();
    const nowTimeIso = new Date().toISOString();
    const params = new URLSearchParams();
    params.append('event_start_timestamp', startTimeIso);
    params.append('event_end_timestamp', nowTimeIso);
    return this.http.get<EpcResponse>(`${environment.lotsAndSerialsUrl}?${params.toString()}`);
  }

  getProductDetails(ids: string[]): Observable<ProductsResponse> {
    const params = new URLSearchParams();
    ids.forEach((id) => {
      params.append('product_id[]', id);
    });
    return this.http.get<ProductsResponse>(`${environment.productsUrl}?${params.toString()}`);
  }

  getOrganizations(): Observable<OrganizationsResponse> {
    return this.http.get<OrganizationsResponse>(`${environment.organizationsUrl}?status=active`);
  }
}
