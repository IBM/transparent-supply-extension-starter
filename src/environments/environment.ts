/**
 *********************************************************************
 * © Copyright IBM Corp. 2020
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *********************************************************************
*/

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  identityUrl: ' /ift/api/identity-proxy/onboarding/v1/',
  productsUrl: '/ift/api/outbound/v2/products',
  eventsUrl: '/ift/api/outbound/v2/events',
  lotsAndSerialsUrl: '/ift/api/outbound/v2/lots_and_serials',
  organizationsUrl: '/ift/api/organizations/v1/organizations',
};
