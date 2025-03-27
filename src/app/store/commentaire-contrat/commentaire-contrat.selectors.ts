import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CommentaireContratState } from '../commentaire-contrat/commentaire-contrat.reducer';

export const selectCommentaireContratState = createFeatureSelector<CommentaireContratState>('commentaireContrat');

export const selectAllCommentairesContrat = createSelector(
  selectCommentaireContratState,
  (state) => state.commentaires
);

export const selectCommentairesLoading = createSelector(
  selectCommentaireContratState,
  (state) => state.loading
);

export const selectCommentairesError = createSelector(
  selectCommentaireContratState,
  (state) => state.error
);
// Sélecteur pour les commentaires liés à un contrat sous-traitant
export const selectCommentairesByContratSousTraitantId = (contratId: number) =>createSelector(
  selectCommentaireContratState, (state) =>
    state.commentaires.filter((c) => c.contratSousTraitant?.contratId === contratId)
  );
