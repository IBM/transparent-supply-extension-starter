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
import { DenormalizedProduct } from '../../shared/models/data.model';
import { getCurrentProduct, getCurrentEpcs } from '../../shared/state-management/app.selectors';
import { Observable } from 'rxjs';
import { FrameMessagingService } from '../../shared/frame/frame-messaging.service';
import { CommandType, NavigationType } from '../../shared/models/post-message.interface';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  public product$: Observable<DenormalizedProduct>;
  public epcs$: Observable<string[]>;

  // UsingTrace v2 (Beta), since it has support for EPC URLs
  private traceBaseUrl = '/trace-v2/results';

  constructor(
    private store: Store<any>,
    private frameMessagingService: FrameMessagingService,
  ) { }

  ngOnInit() {
    this.product$ = this.store.select(getCurrentProduct);
    this.epcs$ = this.store.select(getCurrentEpcs);
  }

  getTraceUrl(epc: string, productId?: string): string {
    const params = new URLSearchParams();
    params.append('epcs', epc);
    if (productId) {
      params.append('productId', productId);
    }
    // This is not relative to our extension, but to the Blockchain Transparent Supply UI
    return `${this.frameMessagingService.outerOrigin}${this.traceBaseUrl}?${params.toString()}`;
  }

  // Example of how to link to other parts of the Blockchain Transparent Supply UI, including other
  // extensions
  onEpcClick(event: Event, epc: string, productId?: string) {
    // Required -- so that the browser does not perform a regular navigation
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    // Send a NAVIGATION message with an absolute URL (beginning with `https`)
    // The outer frame will handle this navigation internally
    this.frameMessagingService.sendNavigationMessage({
      commandType: CommandType.navigate,
      navigationType: NavigationType.pushState,
      url: this.getTraceUrl(epc, productId),
      state: {},
    });
  }

}
