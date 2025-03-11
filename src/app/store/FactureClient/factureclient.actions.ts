// src/app/store/factureclient/factureclient.actions.ts

import { createAction, props } from '@ngrx/store';

// Create FactureClient
export const createFactureClient = createAction(
  '[FactureClient] Create FactureClient',
  props<{ factureClientData: any }>()
);
export const createFactureClientSuccess = createAction(
  '[FactureClient] Create FactureClient Success',
  props<{ factureClient: any }>()
);
export const createFactureClientFailure = createAction(
  '[FactureClient] Create FactureClient Failure',
  props<{ error: string }>()
);

// Get FactureClient Preview by ID
export const getFacturePreview = createAction(
  '[FactureClient] Get FactureClient Preview',
  props<{ id: number }>()
);
export const getFacturePreviewSuccess = createAction(
  '[FactureClient] Get FactureClient Preview Success',
  props<{ facturePreview: any }>()
);
export const getFacturePreviewFailure = createAction(
  '[FactureClient] Get FactureClient Preview Failure',
  props<{ error: string }>()
);
export const fetchFactureClients = createAction('[FactureClient] Fetch Facture Clients');
export const setFactureClients = createAction(
  '[FactureClient] Set Facture Clients',
  props<{ factureClients: any[] }>()
);

export const setError = createAction(
  '[FactureClient] Set Error',
  props<{ error: any }>()
);