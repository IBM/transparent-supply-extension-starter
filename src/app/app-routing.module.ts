/**
 *********************************************************************
 * © Copyright IBM Corp. 2020, 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *********************************************************************
*/

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuard } from './shared/services/auth.guard';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { DataGuard } from './shared/services/data.guard';
import { ThemeGuard } from './shared/services/theme.guard';


const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: '',
        canActivate: [AuthGuard, DataGuard, ThemeGuard],
        loadChildren: () => import('./secure/secure.module').then(m => m.SecureModule)
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'not-found',
        component: NotFoundComponent
      }
    ],
  },
  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
