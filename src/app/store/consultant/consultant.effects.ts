import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ConsultantService } from 'src/app/core/services/consultant.service';
import * as ConsultantActions from './consultant.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
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

  loadConsultantByMail$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ConsultantActions.loadConsultantByMail),
    mergeMap((action) => {
      console.log("📩 Action détectée: loadConsultantByMail avec email =", action.email);

      return this.consultantService.getConsultantByMail(action.email).pipe(
        tap(() => console.log("✅ Appel API getConsultantByMail lancé")),
        map((consultant) => {
          console.log("✅ Réponse API reçue:", consultant);
          return ConsultantActions.loadConsultantByMailSuccess({ consultant });
        }),
        catchError((error) => {
          console.error("❌ Erreur lors de l'appel API:", error);
          return of(ConsultantActions.loadConsultantByMailFailure({ error }));
        })
      );
    })
  )
);

}
