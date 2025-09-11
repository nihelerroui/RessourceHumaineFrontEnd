import { createAction, props } from '@ngrx/store';
import { InvestmentAnalysisRequest, InvestmentAnalysisResponse } from '../../core/services/investment-analysis.service';

export const analyzeInvestment = createAction(
  '[Investment Analysis] Analyze Investment',
  props<{ request: InvestmentAnalysisRequest }>()
);

export const analyzeInvestmentSuccess = createAction(
  '[Investment Analysis] Analyze Investment Success',
  props<{ response: InvestmentAnalysisResponse }>()
);

export const analyzeInvestmentFailure = createAction(
  '[Investment Analysis] Analyze Investment Failure',
  props<{ error: string }>()
);

export const clearInvestmentAnalysis = createAction(
  '[Investment Analysis] Clear Analysis'
);