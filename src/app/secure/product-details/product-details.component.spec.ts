/**
 *********************************************************************
 * © Copyright IBM Corp. 2020
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *********************************************************************
*/

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { FrameMessagingService } from '../../shared/frame/frame-messaging.service';
import {
  reducer as productsReducer,
} from '../../shared/state-management/products/products.reducer';
import {
  reducer as organizationsReducer,
} from '../../shared/state-management/organizations/organizations.reducer';

import { ProductDetailsComponent } from './product-details.component';

class MockFrameMessagingService {
  outerOrigin: '';
  sendNavigationMessage() { }
}

describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductDetailsComponent ],
      imports: [
        StoreModule.forRoot({
          products: productsReducer,
          organizations: organizationsReducer,
        }),
      ],
      providers: [
        { provide: FrameMessagingService, useClass: MockFrameMessagingService },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
