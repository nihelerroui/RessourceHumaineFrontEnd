import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CommentaireFactureClientState } from './commentaire-facture.reducer';

export const selectCommentaireFactureClientState =
  createFeatureSelector<CommentaireFactureClientState>('commentaireFactureClient');

export const selectCommentairesFactureClient = createSelector(
  selectCommentaireFactureClientState,
  (state) => state.commentaires
);

export const selectCommentairesByFactureId = (factureId: number) =>
  createSelector(selectCommentaireFactureClientState, (state) =>
    state.commentaires.filter((c) => c.factureClient?.factureClientId === factureId)
  );

export const selectCommentairesLoading = createSelector(
  selectCommentaireFactureClientState,
  (state) => state.loading
);

export const selectCommentairesError = createSelector(
  selectCommentaireFactureClientState,
  (state) => state.error
);
