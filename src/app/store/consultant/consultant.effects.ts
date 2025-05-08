import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ConsultantService } from 'src/app/core/services/consultant.service';
import * as ConsultantActions from './consultant.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class ConsultantEffects {
  constructor(private actions$: Actions, private consultantService: ConsultantService) {}

  loadConsultantsBySociete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConsultantActions.loadConsultantsBySociete),
      mergeMap(action =>
        this.consultantService.getBySocieteByConsultant(action.consultantId).pipe(
          map(consultants => ConsultantActions.loadConsultantsBySocieteSuccess({ consultants })),
          catchError(error => of(ConsultantActions.loadConsultantsBySocieteFailure({ error })))
        )
      )
    )
  );
}
