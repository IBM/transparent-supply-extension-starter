/**
 *********************************************************************
 * © Copyright IBM Corp. 2020
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *********************************************************************
*/

// see https://carbon-elements.netlify.com/icons/examples/preview/
// see https://www.carbondesignsystem.com/guidelines/icons/library
// see https://www.ibm.com/design/language/iconography/ui-icons/library/

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  InformationFilledModule
} from '@carbon/icons-angular';

@NgModule({
  imports: [
    CommonModule,
    InformationFilledModule,
  ],
  declarations: [],
  exports: [
    InformationFilledModule,
  ]
})
export class CustomCarbonIconModule { }

