/**
 *********************************************************************
 * © Copyright IBM Corp. 2020
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *********************************************************************
*/

export interface Product {
  description: string;
  id: string;
  object_sku: string;
  org_id: string;
}

export interface DenormalizedProduct extends Product {
  organization: {
    name: string;
    organizationTypes: string[];
    id: string;
  };
}

export interface ProductsResponse {
  products: Product[];
  next?: any;
}

export interface Event {
  asset_id: string;
  biz_location_id: string;
  biz_step: string;
  biz_sub_location_id: string;
  child_epc_ids: string[];
  child_quantities: any[]; // TODO type
  destination_location_ids: string[];
  destination_sub_location_ids: string[];
  disposition: string;
  epcs_ids: string[];
  event_time: string;
  event_type: string;
  id: string;
  input_epc_ids: string[];
  input_quantities: string[];
  org_id: string;
  output_epc_ids: string[];
  output_quantities: string[];
  parent_epc_id: string;
  quantities: string[];
  read_point_location_id: string;
  read_point_sub_location_id: string;
  source_location_ids: string[];
  source_sub_location_ids: string[];
  transaction_ids: string[];
}

export interface EventsResponse {
  events: Event[];
  next?: any;
}

export interface Epc {
  id: string;
  product_id: string;
}

export interface EpcResponse {
  lots_and_serials: Epc[];
  next?: any;
}

export interface Organization {
  organizationTypes: OrganizationType[];
  name: string;
  id: string;
  solutionId: string;
  created: number;
  updated: number;
  isEnabled: boolean;
  metadata?: any;
}

export interface OrganizationType {
  id: string;
  name: string;
}

export type OrganizationsResponse = Organization[];
