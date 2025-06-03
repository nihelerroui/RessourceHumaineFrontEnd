import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CommentaireContratSousTraitantState } from './commentaire-contratSousTraitant.reducer';

// 1. Feature Selector
export const selectCommentaireContratSousTraitantState = createFeatureSelector<CommentaireContratSousTraitantState>('commentaireContratSousTraitant');

// 2. Tous les commentaires
export const selectAllCommentairesContratSousTraitant = createSelector(
  selectCommentaireContratSousTraitantState,
  state => state.commentaires
);

// 3. Chargement
export const selectLoadingCommentairesContratSousTraitant = createSelector(
  selectCommentaireContratSousTraitantState,
  state => state.loading
);

// 4. Erreur
export const selectErrorCommentairesContratSousTraitant = createSelector(
  selectCommentaireContratSousTraitantState,
  state => state.error
);

// 5. Commentaires par contratSousTraitantId
export const selectCommentairesByContratSousTraitantId = (contratSTId: number) => createSelector(
  selectAllCommentairesContratSousTraitant,
  commentaires => commentaires.filter(c => c.contratSousTraitant?.contratId === contratSTId)
);
