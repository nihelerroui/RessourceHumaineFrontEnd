import { createReducer, on } from '@ngrx/store';
import { InvestmentAnalysisResponse } from '../../core/services/investment-analysis.service';
import * as InvestmentActions from './investment-analysis.actions';

export interface InvestmentAnalysisState {
  analysis: InvestmentAnalysisResponse | null;
  loading: boolean;
  error: string | null;
}

export const initialState: InvestmentAnalysisState = {
  analysis: null,
  loading: false,
  error: null
};

export const investmentAnalysisReducer = createReducer(
  initialState,
  on(InvestmentActions.analyzeInvestment, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(InvestmentActions.analyzeInvestmentSuccess, (state, { response }) => ({
    ...state,
    analysis: response,
    loading: false,
    error: null
  })),
  on(InvestmentActions.analyzeInvestmentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(InvestmentActions.clearInvestmentAnalysis, (state) => ({
    ...state,
    analysis: null,
    error: null
  }))
);