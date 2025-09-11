import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as HistoriqueActions from './historiqueMainOeuvre.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { HistoriqueMainOeuvreService } from 'src/app/core/services/historique-main-oeuvre.service'; 

@Injectable()
export class HistoriqueMainOeuvreEffects {
  constructor(
    private actions$: Actions,
    private service: HistoriqueMainOeuvreService
  ) {}

  loadHistoriqueMainOeuvre$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HistoriqueActions.loadHistoriqueMainOeuvre),
      mergeMap(({ consultantId, year }) =>
        this.service.getHistoriqueByConsultantAndYear(consultantId, year).pipe(
          map(data => HistoriqueActions.loadHistoriqueMainOeuvreSuccess({ data })),
          catchError(error =>
            of(HistoriqueActions.loadHistoriqueMainOeuvreFailure({ error: error.message }))
          )
        )
      )
    )
  );
  
  
}
