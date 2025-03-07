import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import * as ContratActions from "../contrat/contrat.actions";
import { ContratService } from "../../core/services/contrat.service";

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
        this.contratService.getContracts().pipe(
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
}
