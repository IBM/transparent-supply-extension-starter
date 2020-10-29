
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
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy, PlatformLocation } from '@angular/common';
import { FrameLocationStrategy } from '../../shared/frame/frame-location-strategy';
import { ProxyLocationStrategy } from '../../shared/frame/proxy-location-strategy';
import { FrameMessagingService } from '../../shared/frame/frame-messaging.service';
import { Router } from '@angular/router';

@Injectable()
export class RoutingStrategyService {

    private hashLocationStrategy: HashLocationStrategy;
    private pathLocationStrategy: PathLocationStrategy;
    private frameLocationStrategy: FrameLocationStrategy;
    private proxyLocationStrategy: ProxyLocationStrategy;

    constructor(
        public router: Router,
        locationStrategy: LocationStrategy,
        platformLocation: PlatformLocation,
        frameMessagingService: FrameMessagingService,
    ) {
        // initialize routing strategies
        this.hashLocationStrategy = new HashLocationStrategy(platformLocation);
        this.pathLocationStrategy = new PathLocationStrategy(platformLocation);
        this.frameLocationStrategy = new FrameLocationStrategy(
          frameMessagingService,
          platformLocation,
        );

        // It will be, because we configured it that way in app module
        this.proxyLocationStrategy = (locationStrategy as ProxyLocationStrategy);
        // Start with hash by default
        frameMessagingService.init();
        if (frameMessagingService.isFramed) {
          this.frameLocationStrategy.init();
          this.proxyLocationStrategy.setStrategy(this.frameLocationStrategy);
        } else {
          this.proxyLocationStrategy.setStrategy(this.pathLocationStrategy);
        }
    }

    setStrategy(type: 'path' | 'hash' | 'frame') {
        if (type === 'path') {
            this.proxyLocationStrategy.setStrategy(this.pathLocationStrategy);
        } else if (type === 'hash') {
            this.proxyLocationStrategy.setStrategy(this.hashLocationStrategy);
        } else if (type === 'frame') {
            this.proxyLocationStrategy.setStrategy(this.frameLocationStrategy);
        }
    }

}
