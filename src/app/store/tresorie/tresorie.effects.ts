import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { TresorieService } from 'src/app/core/services/tresorie.service';
import {
  loadSoldeTresorie,
  loadSoldeTresorieSuccess,
  loadSoldeTresorieFailure,
  setSoldeInitial,
  setSoldeInitialSuccess,
  setSoldeInitialFailure,
  validerPaiement,
  validerPaiementSuccess,
  validerPaiementFailure
} from './tresorie.actions';

@Injectable()
export class TresorieEffects {
  constructor(private actions$: Actions, private tresorieService: TresorieService) {}

  // 🔹 Effet pour charger le solde actuel de la trésorerie
  loadSoldeTresorie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadSoldeTresorie),
      mergeMap((action) =>
        this.tresorieService.getSoldeActuel(1).pipe( // Modifier avec l'ID de la société dynamique
          map((solde) => loadSoldeTresorieSuccess({ solde })),
          catchError((error) => of(loadSoldeTresorieFailure({ error: error.message })))
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
          map((tresorie) => setSoldeInitialSuccess({ tresorie })),
          catchError((error) => of(setSoldeInitialFailure({ error: error.message })))
        )
      )
    )
  );

  // 🔹 Effet pour valider un paiement
  validerPaiement$ = createEffect(() =>
    this.actions$.pipe(
      ofType(validerPaiement),
      mergeMap((action) =>
        this.tresorieService.validerPaiement(action.factureId).pipe(
          map((response) => validerPaiementSuccess({ solde: response.nouveauSolde })),
          catchError((error) => of(validerPaiementFailure({ error: error.message })))
        )
      )
    )
  );
}
