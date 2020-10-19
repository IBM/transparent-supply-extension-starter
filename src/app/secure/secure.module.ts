/**
 *********************************************************************
 * © Copyright IBM Corp. 2020
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *********************************************************************
*/

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicRoutingModule } from './secure-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SecureComponent } from './secure.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomCarbonModule } from '../shared/carbon/custom-carbon-angular.module';
import { ProductComponent } from './product/product.component';
import { ProductDetailsComponent } from './product-details/product-details.component';

@NgModule({
  declarations: [
    SecureComponent,
    DashboardComponent,
    ProductComponent,
    ProductDetailsComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    CustomCarbonModule,
    FormsModule,
    ReactiveFormsModule,
    ]
})
export class SecureModule { }
