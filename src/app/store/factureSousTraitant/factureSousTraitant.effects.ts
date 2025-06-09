import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FactureSousTraitantService } from 'src/app/core/services/factureSousTraitant.service';
import * as FactureActions from './factureSousTraitant.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class FactureSousTraitantEffects {
  constructor(private actions$: Actions, private factureService: FactureSousTraitantService) {}

  loadFactures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FactureActions.loadFacturesSousTraitant),
      mergeMap(({ consultantId, month, year, token }) =>
        this.factureService.getFactures(consultantId, month, year, token).pipe(
          map(factures => FactureActions.loadFacturesSousTraitantSuccess({ factures })),
          catchError(error => of(FactureActions.loadFacturesSousTraitantFailure({ error })))
        )
      )
    )
  );
}
