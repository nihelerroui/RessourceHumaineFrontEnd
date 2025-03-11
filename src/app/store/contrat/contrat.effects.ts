import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, switchMap, tap } from "rxjs/operators";
import { of } from "rxjs";
import * as ContratActions from "../contrat/contrat.actions";
import { ContratService } from "../../core/services/contrat.service";
import { GenericService } from "../../core/services/generic.service";
import { ContratSousTraitant } from "./contrat.models";

@Injectable()
export class ContratEffects {
  constructor(
    private actions$: Actions,
    private contratService: ContratService
  ) {}
  // Charger la liste des contrats
  loadContracts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContratActions.loadContracts),
      tap(() => console.log("Action loadContracts déclenchée")),
      switchMap(() =>
        this.contratService.getAll().pipe(
          tap((contrats) => console.log("Contrats chargés :", contrats)),
          map((contrats) => ContratActions.loadContractsSuccess({ contrats })),
          catchError((error) => {
            console.error("❌ Erreur lors du chargement des contrats :", error);
            return of(ContratActions.loadContractsFailure({ error: error.message || error }));
          })
        )
      )
    )
  );
  // Ajouter un contrat
  addContract$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContratActions.addContract),
      mergeMap((action) =>
        this.contratService.addContract(action.contrat, action.fichier).pipe(
          map((contrat) => ContratActions.addContractSuccess({ contrat })),
          catchError((error) =>
            of(ContratActions.addContractFailure({ error: error.message }))
          )
        )
      )
    )
  );
  // Modifier un contrat
  updateContract$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContratActions.updateContract),
      mergeMap((action) =>
        this.contratService
          .updateContrat(action.id, action.contrat, action.fichier)
          .pipe(
            map((contrat) => ContratActions.updateContractSuccess({ contrat })),
            catchError((error) =>
              of(ContratActions.updateContractFailure({ error: error.message }))
            )
          )
      )
    )
  );
    //Supprimer un contrat
    deleteContract$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ContratActions.deleteContract),
        tap(({ id }) => console.log("Suppression du contrat ID :", id)),
        mergeMap(({ id }) =>
          this.contratService.delete(id.toString()).pipe(
            tap(() => console.log("Contrat supprimé avec succès, ID :", id)),
            map(() => ContratActions.deleteContractSuccess({ id })),
            catchError((error) => {
              console.error("Erreur lors de la suppression du contrat :", error);
              return of(ContratActions.deleteContractFailure({ error: error.message || error }));
            })
          )
        )
      )
    );
  
    // Recherche avancée
    searchContracts$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ContratActions.searchContracts),
        mergeMap((action) =>
          this.contratService.searchContrats(action.filters).pipe(
            map((contrats) => ContratActions.searchContractsSuccess({ contrats })),
            catchError((error) => of(ContratActions.searchContractsFailure({ error: error.message })))
          )
        )
      )
    );
}
