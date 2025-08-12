import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { InvestmentAnalysisService } from '../../core/services/investment-analysis.service';
import * as InvestmentActions from './investment-analysis.actions';

@Injectable()
export class InvestmentAnalysisEffects {
  analyzeInvestment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvestmentActions.analyzeInvestment),
      switchMap(({ request }) =>
        this.investmentService.analyzeInvestment(request).pipe(
          map((response) => InvestmentActions.analyzeInvestmentSuccess({ response })),
          catchError((error) =>
            of(InvestmentActions.analyzeInvestmentFailure({ error: error.message }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private investmentService: InvestmentAnalysisService
  ) {}
}