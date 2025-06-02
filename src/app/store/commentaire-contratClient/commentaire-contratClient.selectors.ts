import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CommentaireContratClientState } from './commentaire-contratClient.reducer';

// 1. Sélecteur de base pour le feature state
export const selectCommentaireContratClientState = createFeatureSelector<CommentaireContratClientState>('commentaireContratClient');

// 2. Tous les commentaires
export const selectAllCommentairesContratClient = createSelector(
  selectCommentaireContratClientState,
  (state) => state.commentaires
);

// 3. Chargement
export const selectLoadingCommentairesContratClient = createSelector(
  selectCommentaireContratClientState,
  (state) => state.loading
);

// 4. Erreur
export const selectErrorCommentairesContratClient = createSelector(
  selectCommentaireContratClientState,
  (state) => state.error
);

// 5. Commentaires filtrés par contratClientId
export const selectCommentairesByContratClientId = (contratClientId: number) => createSelector(
  selectAllCommentairesContratClient,
  (commentaires) => commentaires.filter(c => c.contratClient?.contratClientId === contratClientId)
);
