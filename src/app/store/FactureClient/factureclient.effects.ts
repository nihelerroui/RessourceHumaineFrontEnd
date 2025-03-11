// src/app/store/factureclient/factureclient.effects.ts

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { mergeMap } from 'rxjs/operators';

import * as FactureClientActions from './factureclient.actions';
import { FactureClientService } from '../../core/services/factureclient.service';
import { fetchFactureClients, setFactureClients, setError } from '../FactureClient/factureclient.actions';
import { Store } from '@ngrx/store';

@Injectable()
export class FactureClientEffects {
  constructor(
    private actions$: Actions,
    private factureClientService: FactureClientService,
    private store: Store
  ) {}

  // Effect to create a new FactureClient
  createFactureClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FactureClientActions.createFactureClient),
      switchMap(({ factureClientData }) =>
        this.factureClientService.createFactureClient(factureClientData).pipe(
          map(factureClient => FactureClientActions.createFactureClientSuccess({ factureClient })),
          catchError(error => of(FactureClientActions.createFactureClientFailure({ error: error.message })))
        )
      )
    )
  );
  loadFactureClients$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchFactureClients), // Listen for the fetch action
      mergeMap(() =>
        this.factureClientService.getAll().pipe( // Call the service to get facture clients
          map((factureClients) => setFactureClients({ factureClients })), // Dispatch success action with data
          catchError((error) => of(setError({ error }))) // Dispatch error action in case of failure
        )
      )
    )
  );

  // Effect to get FactureClient preview by ID
  getFacturePreview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FactureClientActions.getFacturePreview),
      switchMap(({ id }) =>
        this.factureClientService.getFacturePreview(id).pipe(
          map(facturePreview => FactureClientActions.getFacturePreviewSuccess({ facturePreview })),
          catchError(error => of(FactureClientActions.getFacturePreviewFailure({ error: error.message })))
        )
      )
    )
  );
}
