import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as MainOeuvreActions from './mainOeuvre.actions';
import { catchError, map, mergeMap, of, timeout } from 'rxjs';
import { MainOeuvreService } from 'src/app/core/services/main-oeuvre.service';

@Injectable()
export class MainOeuvreEffects {
  constructor(
    private actions$: Actions,
    private mainOeuvreService: MainOeuvreService
  ) {}

  loadMainOeuvre$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MainOeuvreActions.loadMainOeuvre),
      mergeMap(() =>
        this.mainOeuvreService.getAll().pipe(
          map(data => MainOeuvreActions.loadMainOeuvreSuccess({ data })),
          catchError(error =>
            of(MainOeuvreActions.loadMainOeuvreFailure({ error: error.message }))
          )
        )
      )
    )
  );

  verifierMiseAJour$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MainOeuvreActions.verifierMiseAJourMainOeuvre),
      mergeMap(action =>
        this.mainOeuvreService.verifierMiseAJour(action.adminId, action.mois, action.annee).pipe(
          timeout(300000), // ⏱️ Timeout de 5 minutes
          map(() => MainOeuvreActions.verifierMiseAJourMainOeuvreSuccess()),
          catchError((error) => {
            console.error('⛔ Erreur captée dans l’effet:', error);
            return of(MainOeuvreActions.verifierMiseAJourMainOeuvreFailure({
              error: error?.message || 'Erreur inconnue'
            }));
          })
        )
      )
    )
  );
  
  
}
