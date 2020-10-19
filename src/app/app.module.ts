/**
 *********************************************************************
 * © Copyright IBM Corp. 2020
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *********************************************************************
*/

import { LocationStrategy } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule, routerReducer, RouterState } from '@ngrx/router-store';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { reducer as productsReducer } from './shared/state-management/products/products.reducer';
import {
  reducer as organizationsReducer,
} from './shared/state-management/organizations/organizations.reducer';
import {
  AuthorizationHeaderInterceptor,
} from './shared/interceptors/authorization-header.interceptor';
import { ProxyLocationStrategy } from './shared/frame/proxy-location-strategy';
import { FrameMessagingService } from './shared/frame/frame-messaging.service';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './shared/services/auth.guard';
import { AuthService } from './shared/services/auth.service';
import { WindowService } from './shared/services/window.service';
import { RoutingStrategyService } from './shared/frame/routing-strategy.service';
import { EffectsModule } from '@ngrx/effects';
import { ProductsEffects } from './shared/state-management/products/products.effects';
import { DataService } from './shared/services/data.service';
import {
  OrganizationsEffects,
} from './shared/state-management/organizations/organizations.effects';
import { DataGuard } from './shared/services/data.guard';
import { CustomCarbonModule } from './shared/carbon/custom-carbon-angular.module';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CustomCarbonModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot({
      router: routerReducer,
      products: productsReducer,
      organizations: organizationsReducer,
    }, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true,
        strictActionSerializability: true,
        strictActionWithinNgZone: true,
        strictActionTypeUniqueness: true,
      },
    }),
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router',
      routerState: RouterState.Minimal,
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    EffectsModule.forRoot([ProductsEffects, OrganizationsEffects]),
  ],
  providers: [
    DataService,
    AuthService,
    AuthGuard,
    DataGuard,
    WindowService,
    RoutingStrategyService,
    {
      provide: LocationStrategy, useClass: ProxyLocationStrategy,
    },
    FrameMessagingService,
    /*==================================== Http interceptors =====================================*/
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizationHeaderInterceptor,
      multi: true,
      deps: [AuthService],
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
