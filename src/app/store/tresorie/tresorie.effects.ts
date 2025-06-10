import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { TresorieService } from 'src/app/core/services/tresorie.service';
import * as TresorieActions  from './tresorie.actions';

@Injectable()
export class TresorieEffects {
  constructor(private actions$: Actions, private tresorieService: TresorieService) {}

  
  loadTresorie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TresorieActions.loadTresorie),
      mergeMap(({ societeId }) =>
        this.tresorieService.getTresorie(societeId).pipe( 
          map((tresorie) => TresorieActions.loadTresorieSuccess({ tresorie })), 
          catchError((error) => of(TresorieActions.loadTresorieFailure({ error: error.message })))
        )
      )
    )
  );

  setSoldeInitial$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TresorieActions.setSoldeInitial),
      mergeMap((action) =>
        this.tresorieService.setSoldeInitial(action.societeId, action.montant).pipe(
          map((tresorie) => TresorieActions.setSoldeInitialSuccess({ tresorie })), 
          catchError((error) => of(TresorieActions.setSoldeInitialFailure({ error: error.message })))
        )
      )
    )
  );

  validerPaiement$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TresorieActions.validerPaiement),
      mergeMap(action =>
        this.tresorieService.validerPaiement(action.factureAchatId).pipe(
          map(response => {
            if (response.status === 'error') {
              return TresorieActions.validerPaiementFailure({ error: response.message });
            }
            return TresorieActions.validerPaiementSuccess({
              tresorie: response.nouveauSolde, 
              factureAchatId: action.factureAchatId       
            });
          }),
          catchError(error =>
            of(TresorieActions.validerPaiementFailure({ error: error.message }))
          )
        )
      )
    )
  );
  
  
  

augmenterSoldeActuel$ = createEffect(() =>
  this.actions$.pipe(
    ofType(TresorieActions.augmenterSoldeActuel),
    mergeMap(({ societeId, montant, source, motif }) =>
      this.tresorieService.augmenterSoldeActuel(societeId, montant, source, motif).pipe(
        mergeMap((response: any) =>
          this.tresorieService.getTresorie(societeId).pipe(
            map((tresorie) =>
              TresorieActions.augmenterSoldeActuelSuccess({ tresorie })
            ),
            catchError((error) =>
              of(TresorieActions.augmenterSoldeActuelFailure({ error: error.message }))
            )
          )
        ),
        catchError((error) =>
          of(TresorieActions.augmenterSoldeActuelFailure({ error: error.message }))
        )
      )
    )
  )
);


}
