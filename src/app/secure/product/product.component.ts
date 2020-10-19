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
import { Store } from '@ngrx/store';
import { State } from '../../shared/state-management/products/products.reducer';
import { loadRecentProducts } from '../../shared/state-management/products/products.actions';
import { getDenormalizedProductList } from '../../shared/state-management/app.selectors';
import { getRecentLoading } from '../../shared/state-management/products/products.selectors';
import { Observable } from 'rxjs';
import { DenormalizedProduct } from '../../shared/models/data.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  products$: Observable<DenormalizedProduct[]>;
  loadingState$: Observable<{ isLoading: boolean; hasLoaded: boolean; }>;

  constructor(
    public store: Store<State>,
  ) {
    this.products$ = this.store.select(getDenormalizedProductList);
    this.loadingState$ = this.store.select(getRecentLoading);
  }

  ngOnInit() {
    // Reload this in the background when the user navigates to this view
    this.store.dispatch(loadRecentProducts());
  }

}
