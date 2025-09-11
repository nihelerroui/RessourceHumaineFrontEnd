import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of, switchMap, tap } from "rxjs";
import { ContratClientService } from "../../core/services/contratClient.service";
import * as ContratClientActions from "../contratClient/contratClient.actions";

@Injectable()
export class ContratClientEffects {
  constructor(
    private actions$: Actions,
    private contratClientService: ContratClientService
  ) {}

  loadContratsClients$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContratClientActions.loadContratsClient),
      switchMap(() =>
        this.contratClientService.getAll().pipe(
          map(contrats =>
            ContratClientActions.loadContratsClientSuccess({ contrats })
          ),
          catchError(error =>
            of(ContratClientActions.loadContratsClientFailure({ error: error.message || error }))
          )
        )
      )
    )
  );

  importerContratClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContratClientActions.importerContratClient),
      mergeMap(({ file, clientId, designation, tjm }) =>
        this.contratClientService.importerContrat(file, clientId, designation, tjm).pipe(
          map(response =>
            ContratClientActions.importerContratClientSuccess({ contrat: response })
          ),
          catchError(error =>
            of(ContratClientActions.importerContratClientFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadContratsClientByClientId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContratClientActions.loadContratsClientByClientId),
      switchMap(({ clientId }) =>
        this.contratClientService.consulterContratsClientParId(clientId).pipe(
          map(contrats =>
            ContratClientActions.loadContratsClientByClientIdSuccess({ contrats })
          ),
          catchError(error =>
            of(ContratClientActions.loadContratsClientByClientIdFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateContratClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContratClientActions.updateContratClient),
      mergeMap(({ contrat }) =>
        this.contratClientService.update(contrat).pipe(
          map(updated => ContratClientActions.updateContratClientSuccess({ contrat: updated })),
          catchError(error => of(ContratClientActions.updateContratClientFailure({ error })))
        )
      )
    )
  );
  loadContratsBySocieteAdmin$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ContratClientActions.loadContratsBySocieteAdmin),
    switchMap(() =>
      this.contratClientService.getContratsBySocietesAdmin().pipe(
        map(contrats => ContratClientActions.loadContratsBySocieteAdminSuccess({ contrats })),
        catchError(error => of(ContratClientActions.loadContratsBySocieteAdminFailure({ error: error.message })))
      )
    )
  )
);
}
