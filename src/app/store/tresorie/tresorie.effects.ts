import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { TresorieService } from 'src/app/core/services/tresorie.service';
import {
  loadTresorie,
  loadTresorieSuccess,
  loadTresorieFailure,
  setSoldeInitial,
  setSoldeInitialSuccess,
  setSoldeInitialFailure,
  validerPaiement,
  validerPaiementSuccess,
  validerPaiementFailure,
  augmenterSoldeActuel,
  augmenterSoldeActuelSuccess,
  augmenterSoldeActuelFailure
} from './tresorie.actions';

@Injectable()
export class TresorieEffects {
  constructor(private actions$: Actions, private tresorieService: TresorieService) {}

  // 🔹 Effet pour charger la trésorerie d'une société
  loadTresorie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTresorie),
      mergeMap(({ societeId }) =>
        this.tresorieService.getTresorie(societeId).pipe( // ✅ Utilise l'ID de la société dynamique
          map((tresorie) => loadTresorieSuccess({ tresorie })), // ✅ Retourne toute la trésorerie
          catchError((error) => of(loadTresorieFailure({ error: error.message })))
        )
      )
    )
  );

  // 🔹 Effet pour définir le solde initial
  setSoldeInitial$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setSoldeInitial),
      mergeMap((action) =>
        this.tresorieService.setSoldeInitial(action.societeId, action.montant).pipe(
          map((tresorie) => setSoldeInitialSuccess({ tresorie })), // ✅ Retourne toute la trésorerie mise à jour
          catchError((error) => of(setSoldeInitialFailure({ error: error.message })))
        )
      )
    )
  );

  // 🔹 Effet pour valider un paiement et mettre à jour la trésorerie
  validerPaiement$ = createEffect(() =>
    this.actions$.pipe(
      ofType(validerPaiement),
      mergeMap(action =>
        this.tresorieService.validerPaiement(action.factureId).pipe(
          map(response => {
            if (response.status === 'error') {
              return validerPaiementFailure({ error: response.message });
            }
            return validerPaiementSuccess({
              tresorie: response.nouveauSolde, 
              factureId: action.factureId       
            });
          }),
          catchError(error =>
            of(validerPaiementFailure({ error: error.message }))
          )
        )
      )
    )
  );
  
  
  
  


  // 🔹 Effet pour augmenter le solde actuel lorsque le seuil est atteint
augmenterSoldeActuel$ = createEffect(() =>
  this.actions$.pipe(
    ofType(augmenterSoldeActuel),
    mergeMap(({ societeId, montant }) =>
      this.tresorieService.augmenterSoldeActuel(societeId, montant).pipe(
        map((tresorie) => augmenterSoldeActuelSuccess({ tresorie })), // ✅ Retourne toute la trésorerie mise à jour
        catchError((error) => of(augmenterSoldeActuelFailure({ error: error.message })))
      )
    )
  )
);
}
