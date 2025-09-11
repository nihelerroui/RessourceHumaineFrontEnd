import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, switchMap, tap } from "rxjs/operators";
import { of } from "rxjs";
import * as ContratActions from "../contrat/contrat.actions";
import { ContratService } from "../../core/services/contrat.service";
import { GenericService } from "../../core/services/generic.service";
import { ContratSousTraitant } from "../../models/contrat.models";

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
      switchMap(() =>
        this.contratService.getAll().pipe(
          map((contrats) => ContratActions.loadContractsSuccess({ contrats })),
          catchError((error) => {
            return of(ContratActions.loadContractsFailure({ error: error.message || error }));
          })
        )
      )
    )
  );
  //Charger la liste des contrats d'un sous-traitant
  loadContractsByConsultant$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContratActions.loadContractsByConsultant),
      mergeMap(({ consultantId }) =>
        this.contratService.getContratsByConsultant(consultantId).pipe(
          map((contrats) => ContratActions.loadContractsSuccess({ contrats })),
          catchError((error) =>
            of(ContratActions.loadContractsFailure({ error: error.message }))
          )
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
          this.contratService.delete(id).pipe(
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
}
