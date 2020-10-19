/**
 *********************************************************************
 * © Copyright IBM Corp. 2020
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *********************************************************************
*/

export enum MessageRequestTypes {
  READY = 'READY',
  COMMAND = 'COMMAND',
  GET = 'GET',
  GET_DATA = 'GET_DATA', // Response to a GET
  SUBSCRIBE = 'SUBSCRIBE',
  SUBSCRIBE_DATA = 'SUBSCRIBE_DATA', // Response to a SUBSCRIBE
  UNSUBSCRIBE = 'UNSUBSCRIBE',
}

export interface BaseMessage {
  id: string; // Unique id for this message
  requestId?: string; // Id this message is in response to, if applicable
  timestamp: number; // unixTimeMs
  'x-version': '1.1.0'; // Version of this interface
  // # Changelog
  // 1.1.0
  //  * Added support for COMMAND message types, for inter-frame routing.
  //  * Deprecated DISPLAY_MESSAGE type: Use COMMAND with type `displayMessage` instead
}

// Properties that are available to DataProviders
// (The rest of the messaging details is handled by ExtensionDataProviderService)
export interface DataMessage {
  // Desired data path to acquire
  // Optional for `READY` or `UNSUBSCRIBE` or `DISPLAY_MESSAGE`, required otherwise
  path?: string;
  body: DisplayMessage | NavigationMessage | any;
}

// This type represents what is actually exchanged "over the wire"
export interface ProtocolMessage extends BaseMessage, DataMessage {
  type: MessageRequestTypes;
  // Applicable for `UNSUBSCRIBE` messages
  subscriptionId?: string;
}

// Supported Commands
export enum CommandType {
  displayMessage = 'displayMessage',
  navigate = 'navigate',
}

export interface CommandMessage {
  commandType: CommandType;
}

// ## Display Messages
// An interface for showing toaster notifications from extensions
export enum DisplayMessageType {
  Error = 'Error',
  Information = 'Information',
  Success = 'Success',
  Warning = 'Warning',
}

// Error message data type
export interface DisplayMessage extends CommandMessage {
  commandType: CommandType.displayMessage;
  message: string;
  displayMessageType: DisplayMessageType; // options: Information, Warning, Error, Success
  title?: string; // optional title passed by the extension.
}

// ## Navigation Messages
// An interface for letting extensions be routable
// Mirrors the browser's history API
// https://developer.mozilla.org/en-US/docs/Web/API/History
export enum NavigationType {
  // Used by NAVIGATION_EVENT, for the outer page to indicate to the inner page this event happened
  popState = 'popState',
  // Used by the inner frame to trigger navigation
  pushState = 'pushState',
  replaceState = 'replaceState',
  back = 'back',
  forward = 'forward',
  // Not implemented for now, TODO
  go = 'go',
}

export interface NavigationMessage extends CommandMessage {
  commandType: CommandType.navigate;
  navigationType: NavigationType;
  // Mirror the browser's history API
  url: string;
  state: any; // Each extension will have an isolated state container
  title?: string; // Unused by the browser, but included in the interface anyway...?
  delta?: number; // Only for 'go' message types

  initial?: boolean; // To indicate if this is the first navigation since load
}
