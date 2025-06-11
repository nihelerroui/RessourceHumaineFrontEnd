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
  ) { }

  // Effet pour charger l'historique du chiffre d'affaire
  loadChiffreAffaire$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChiffreAffaireActions.loadChiffreAffaire),
      mergeMap(() =>
        this.chiffreAffaireService.getAll().pipe(
          map(chiffres =>
            ChiffreAffaireActions.loadChiffreAffaireSuccess({ chiffres })
          ),
          catchError(error =>
            of(
              ChiffreAffaireActions.loadChiffreAffaireFailure({
                error: error.message || 'Erreur serveur'
              })
            )
          )
        )
      )
    )
  );

  // Effet pour récupérer le montant total des factures
  loadTotalFactures$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ChiffreAffaireActions.loadTotalFactures),
    mergeMap(action =>
      this.chiffreAffaireService.getTotalFactures(action.clientId).pipe(
        map(total =>
          ChiffreAffaireActions.loadTotalFacturesSuccess({
            clientId: action.clientId,
            total
          })
        ),
        catchError(error =>
          of(
            ChiffreAffaireActions.loadTotalFacturesFailure({
              error: error.message || 'Erreur serveur'
            })
          )
        )
      )
    )
  )
);


  // Effet pour charger le total des factures payées
  loadTotalFacturesPayees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChiffreAffaireActions.loadTotalFacturesPayees),
      mergeMap(action =>
        this.chiffreAffaireService.getTotalFacturesPayees(action.clientId).pipe(
          map(totalPayees =>
            ChiffreAffaireActions.loadTotalFacturesPayeesSuccess({
              clientId: action.clientId,
              totalPayees
            })
          ),
          catchError(error =>
            of(
              ChiffreAffaireActions.loadTotalFacturesPayeesFailure({
                error: error.message || 'Erreur serveur'
              })
            )
          )
        )
      )
    )
  );

}
