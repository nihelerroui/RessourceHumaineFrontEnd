import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of, tap } from "rxjs";
import { ContratClientService } from "../../core/services/contratClient.service";
import * as ContratClientActions from "../contratClient/contratClient.actions";

@Injectable()
export class ContratClientEffects {
  constructor(
    private actions$: Actions,
    private contratClientService: ContratClientService
  ) {}

  // Charger les contrats clients
  loadContratsClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContratClientActions.loadContratsClient),
      mergeMap(() =>
        this.contratClientService.getAllContrats().pipe(
          map((contrats) => ContratClientActions.loadContratsClientSuccess({ contrats })),
          catchError((error) => of(ContratClientActions.loadContratsClientFailure({ error: error.message })))
        )
      )
    )
  );

  // Importer un contrat client
  importerContratClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContratClientActions.importerContratClient),
      tap((action) => console.log("🚀 Effet déclenché avec :", action)), // Vérifier si l'action est bien captée
      mergeMap(({ file, token, designation, tjm }) =>
        this.contratClientService.importerContrat(file, token, designation, tjm).pipe(
          tap((response) => console.log("✅ Réponse du backend :", response)), // Vérifier la réponse backend
          map((contrat) => {
            console.log("🎉 Contrat importé avec succès :", contrat);
            return ContratClientActions.importerContratClientSuccess({ contrat });
          }),
          catchError((error) => {
            console.error("❌ Erreur lors de l'importation :", error);
            return of(ContratClientActions.importerContratClientFailure({ error: error.message }));
          })
        )
      )
    )
  );
  
  
}
