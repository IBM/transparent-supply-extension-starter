/**
 *********************************************************************
 * © Copyright IBM Corp. 2020
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *********************************************************************
*/

import { Component } from '@angular/core';
import { RoutingStrategyService } from './shared/frame/routing-strategy.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    // Inject this here so its constructor will run early in the app start-up process.
    public routingStrategy: RoutingStrategyService
  ) {
  }
}
