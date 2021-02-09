# Extension starter for IBM Blockchain Transparent Supply

Stay up to date with [the source](https://github.com/IBM/transparent-supply-extension-starter)

## Overview

The web application for IBM Blockchain Transparent Supply allows for the integration of external third-party applications (extensions).

This is done by loading the extensions as iframes within the parent application, and then using a proprietary interface over [`postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
to send data and commands back and forth.

This repository contains a "starter" application that implements this cross-frame interface, and demonstrates how to use a number of key integration features:
 - How to subscribe to a user token, so that they will not have to sign in separately to the extension;
 - How to use the token to call IBM Blockchain Transparent Supply APIs;
 - How to use integrated routing, so that the browser URL changes as users navigate within the extension;
 - How to link to other modules of the IBM Blockchain Transparent Supply, or other extensions.

This example application is built using Angular 9, but the `postMessage` interface is agnostic to libraries and frameworks used within the extension. 

This example also uses the
[Carbon Design System](https://www.carbondesignsystem.com/), and it is recommended that extensions use this library so that their theme can match the main application.

## Development

### Getting Started

```bash

# install dependencies
npm install

# run full development environment 
npm start 

# Done! your server should be running on http://localhost:5000

```

### Pointing to the correct instance
By default, this app proxies to https://developer.transparentsupply.ibm.com. If this is not the IBM 
Blockchain Transparent Supply instance you want to use, change the target in 
[`proxy.conf.json`](src/proxy.conf.json).

When started, the extension will detect if it is running inside an iframe to determine which [Routing Strategy](#Routing-Strategy) to use.
If not in a frame, the extension will prompt you to enter your authorization token (JWT). You can acquire a token by logging in [here](https://developer.transparentsupply.ibm.com/ift/api/identity-proxy/login).

### Testing inside a frame

To develop and test inside the context of the parent application, you can load your extension [here](https://developer.transparentsupply.ibm.com/ex/frame-test).
This special route will attempt to load an extension at `https://localhost:5000` with all permissions.

If you get an error message in your browser, such as `The webpage at https://localhost:5000/ might be temporarily down`, you likely have to 
accept the self-signed certificate that the Angular development tool generates. Navigate to https://localhost:5000/ directly and your browser
should prompt you to do so.

## Routing Strategy

When loaded inside a frame, the application swaps out Angular's [LocationStrategy Class](https://angular.io/api/common/LocationStrategy) with an 
[implementation that sends messages to the parent application](./src/app/shared/frame/frame-location-strategy.ts). When the user navigates within your extension,
it will send a message to the main application requesting a route change. When a user hits `Back` or `Forward` in their browser, the main application will send a message
notifying the extension, which this implementation will react to. Existing angular routing methods like `<a [routerLink]="['/some-route', { id: 'some_route_param' }]">some link text</a>` will continue to work.

For an example of how to link other modules in the main application, see [`product-details.component.ts`](./src/app/secure/product-details/product-details.component.ts). This component
constructs a special `Navigation` message with an absolute URL, indicating to the main application that it would like to route outside of the extension.

## Deployment

When your extension is deployed and you are ready to integrate, contact IBM Blockchain Transparent Supply support with the URL for the extension, so that your instance can be
properly configured. Note that you should be sure to protect your extension against XSS vulnerabilities, and that you will be required to sign a Statement of Understanding of Risk.

There are no self-service deployment options at this time.

### Proxying
By default, this app makes requests to the relative path `/ift/api/*`. Therefore, when deployed, it 
is expected that your server will proxy requests made to `/ift/api/*` to the appropriate IBM 
Blockchain Transparent Supply instance. [Nginx](https://nginx.org/) is a very popular web server 
that can be configured to do this.

Some IBM Blockchain Transparent Supply APIs allow for CORS requests, which would let your app run 
serverless. However, your origin must be added to an allowlist. Open a ticket with support if this
option is right for you.


-------------------------------------------

© Copyright IBM Corp. 2020 All Rights Reserved.
