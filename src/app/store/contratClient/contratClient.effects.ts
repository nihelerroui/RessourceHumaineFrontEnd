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
      tap(() => console.log("🚀 Action loadContratsClient captée")),
      switchMap(() =>
        this.contratClientService.getAll().pipe(
          tap((response) =>
            console.log("📡 Données reçues avant le reducer :", response)
          ),
          map((contrats) =>
            ContratClientActions.loadContratsClientSuccess({ contrats })
          ),
          catchError((error) => {
            console.error("❌ Erreur détaillée :", error);
            return of(
              ContratClientActions.loadContratsClientFailure({
                error: error.message || error,
              })
            );
          })
        )
      )
    )
  );
  importerContratClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContratClientActions.importerContratClient),
      mergeMap(({ file, token, designation, tjm }) =>
        this.contratClientService
          .importerContrat(file, token, designation, tjm)
          .pipe(
            map((response) => {
              if (typeof response === "string") {
                // Aucun contrat à ajouter, redirection faite par le composant
                return { type: '[ContratClient] Import Contrat Pas d\'action' }; 
              } else {
                return ContratClientActions.importerContratClientSuccess({
                  contrat: response,
                });
              }
            })
            ,
            catchError((error) => {
              return of(
                ContratClientActions.importerContratClientFailure({
                  error: error.message,
                })
              );
            })
          )
      )
    )
  );
// Effet pour charger les contrats client à partir du token
loadContratsClientByToken$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ContratClientActions.loadContratsClientByToken),
    tap(({ token }) => console.log("📡 Chargement des contrats pour le token :", token)),
    switchMap(({ token }) =>
      this.contratClientService.consulterContratsClient(token).pipe(
        tap(contrats => console.log("✅ Contrats reçus :", contrats)),
        map(contrats =>
          ContratClientActions.loadContratsClientByTokenSuccess({ contrats })
        ),
        catchError(error => {
          console.error("❌ Erreur lors du chargement des contrats :", error);
          return of(ContratClientActions.loadContratsClientByTokenFailure({ error: error.message }));
        })
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

}
  