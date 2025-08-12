import { createFeatureSelector, createSelector } from '@ngrx/store';
import { InvestmentAnalysisState } from './nvestment-analysis.reducer';

export const selectInvestmentAnalysisState = createFeatureSelector<InvestmentAnalysisState>('investmentAnalysis');

export const selectInvestmentAnalysis = createSelector(
  selectInvestmentAnalysisState,
  (state) => state.analysis
);

export const selectInvestmentAnalysisLoading = createSelector(
  selectInvestmentAnalysisState,
  (state) => state.loading
);

export const selectInvestmentAnalysisError = createSelector(
  selectInvestmentAnalysisState,
  (state) => state.error
);

export const selectBestInvestmentMoment = createSelector(
  selectInvestmentAnalysis,
  (analysis) => analysis?.analyse?.meilleur_moment
);

export const selectInvestmentRecommendations = createSelector(
  selectInvestmentAnalysis,
  (analysis) => analysis?.analyse?.recommandations
);
