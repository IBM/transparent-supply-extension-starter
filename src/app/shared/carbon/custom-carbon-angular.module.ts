/**
 *********************************************************************
 * © Copyright IBM Corp. 2020
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *********************************************************************
*/

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    BreadcrumbModule,
    ButtonModule,
    DialogModule,
    GridModule,
    I18nModule,
    LinkModule,
    LoadingModule,
    NotificationModule,
    NotificationService,
    TilesModule,
    StructuredListModule,
} from 'carbon-components-angular';
import { CustomCarbonIconModule } from './custom-carbon-angular-icons.module';

@NgModule({
    imports: [
        CommonModule,
        CustomCarbonIconModule,
        BreadcrumbModule,
        ButtonModule,
        DialogModule,
        GridModule,
        I18nModule,
        LinkModule,
        LoadingModule,
        NotificationModule,
        TilesModule,
        StructuredListModule,
    ],
    providers: [NotificationService],
    declarations: [],
    exports: [
        CommonModule,
        CustomCarbonIconModule,
        BreadcrumbModule,
        ButtonModule,
        DialogModule,
        GridModule,
        I18nModule,
        LinkModule,
        LoadingModule,
        NotificationModule,
        TilesModule,
        StructuredListModule,
    ]
})
export class CustomCarbonModule { }
