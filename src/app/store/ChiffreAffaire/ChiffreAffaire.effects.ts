import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ChiffreAffaireService } from '../../core/services/chiffreAffaire.service';
import * as ChiffreAffaireActions from './ChiffreAffaire.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class ChiffreAffaireEffects {
  constructor(
    private actions$: Actions,
    private chiffreAffaireService: ChiffreAffaireService
  ) {}

  // Effet pour charger l'historique du chiffre d'affaire
  loadChiffreAffaire$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChiffreAffaireActions.loadChiffreAffaire),
      mergeMap(() =>
        this.chiffreAffaireService.getAllHistorique().pipe(
          map((historique) => ChiffreAffaireActions.loadChiffreAffaireSuccess({ historique })),
          catchError((error) => of(ChiffreAffaireActions.loadChiffreAffaireFailure({ error })))
        )
      )
    )
  );

  // Effet pour récupérer le montant total des factures
  getTotalFactures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChiffreAffaireActions.getTotalFactures),
      mergeMap(({ clientId }) =>
        this.chiffreAffaireService.getTotalFactures(clientId).pipe(
          map((response) => ChiffreAffaireActions.getTotalFacturesSuccess({ montantTotal: response.montantTotal })),
          catchError((error) => of(ChiffreAffaireActions.getTotalFacturesFailure({ error })))
        )
      )
    )
  );

  // Effet pour récupérer le montant total des factures payées
  getTotalFacturesPayees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChiffreAffaireActions.getTotalFacturesPayees),
      mergeMap(({ clientId }) =>
        this.chiffreAffaireService.getTotalFacturesPayees(clientId).pipe(
          map((response) => ChiffreAffaireActions.getTotalFacturesPayeesSuccess({ montantTotalPayees: response.montantTotalPayees })),
          catchError((error) => of(ChiffreAffaireActions.getTotalFacturesPayeesFailure({ error })))
        )
      )
    )
  );
}
