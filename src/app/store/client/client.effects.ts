import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { ClientService } from 'src/app/core/services/client.service';
import * as ClientActions from './client.actions';
import { Client } from 'src/app/models/client.model';

@Injectable()
export class ClientEffects {
  
  loadClients$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.loadClients),
      mergeMap(() =>
        this.clientService.getAll().pipe(
          map((clients: Client[]) => ClientActions.loadClientsSuccess({ clients })),
          catchError((error) => of(ClientActions.loadClientsFailure({ error: error.message })))
        )
      )
    )
  );

 
  addClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.addClient),
      mergeMap((action) =>
        this.clientService.create(action.client).pipe(
          map((newClient: Client) => ClientActions.addClientSuccess({ client: newClient })),
          catchError((error) => of(ClientActions.addClientFailure({ error: error.message })))
        )
      )
    )
  );

  
  updateClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.updateClient),
      mergeMap((action) =>
        this.clientService.update(action.client).pipe(
          map((updatedClient: Client) => ClientActions.updateClientSuccess({ client: updatedClient })),
          catchError((error) => of(ClientActions.updateClientFailure({ error: error.message })))
        )
      )
    )
  );

  
  deleteClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.deleteClient),
      mergeMap((action) =>
        this.clientService.delete(action.clientId).pipe(
          map(() => ClientActions.deleteClientSuccess({ clientId: action.clientId })),
          catchError((error) => of(ClientActions.deleteClientFailure({ error: error.message })))
        )
      )
    )
  );
 

sendImportEmail$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ClientActions.sendImportEmail),
    mergeMap((action) =>
      this.clientService.envoyerEmailImport(action.clientId).pipe(
        map(() => ClientActions.sendImportEmailSuccess()),
        catchError((error) =>
          of(ClientActions.sendImportEmailFailure({ error: error.message }))
        )
      )
    )
  )
);


  constructor(
    private actions$: Actions,
    private clientService: ClientService
  ) {}
}
