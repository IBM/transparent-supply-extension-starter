/**
 *********************************************************************
 * © Copyright IBM Corp. 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *********************************************************************
*/

import { Injectable, Inject } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FrameMessagingService } from '../frame/frame-messaging.service';
import { DOCUMENT } from '@angular/common';

// A guard to handle receiving theme information from the parent frame. This is done in a guard to
// prevent the theme from "flashing", which would happen if components rendered and then we
// received the theme afterward.

@Injectable({
  providedIn: 'root',
})
export class ThemeGuard implements CanActivate {

  // We only need to inject the theme once
  hasInitialized = false;

  constructor(
    private frame: FrameMessagingService,
    @Inject(DOCUMENT) private document: Document,
  ) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    // Outside of a frame, there is no theme information to fetch
    if (!this.frame.isFramed) {
      return true;
    }

    if (this.hasInitialized) {
      return true;
    }

    // When framed, delay loading components until the theme is available, to prevent color flashing
    return this.frame.requestTheme().pipe(
      map((theme) => {
        const colors = theme.colors || {};
        Object.keys(colors).forEach((color) => {
          if (colors[color]) {
            this.document.documentElement.style.setProperty(`--cds-${color}`, colors[color]);
          }
        });
        this.hasInitialized = true;
        return true;
      }),
    );
  }

}


