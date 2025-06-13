import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CommentaireContratClientState } from './commentaire-contratClient.reducer';

export const selectCommentaireClientState = createFeatureSelector<CommentaireContratClientState>('commentaireContratClient');

export const selectAllCommentairesContratClient = createSelector(
  selectCommentaireClientState,
  state => state.commentaires
);

export const selectLoadingCommentairesContratClient = createSelector(
  selectCommentaireClientState,
  state => state.loading
);

export const selectCommentairesByContratClientId = (contratClientId: number) =>
  createSelector(
    selectAllCommentairesContratClient,
    commentaires => commentaires.filter(c => c.contratClient?.contratClientId === contratClientId)
  );
