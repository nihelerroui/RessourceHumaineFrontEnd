// commentaire-facture-client.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import type { CommentaireFactureClientState } from './commentaire-facture-client.reducer';

export const selectCommentaireFactureClientState = createFeatureSelector<CommentaireFactureClientState>('commentaireFactureClient');

export const selectCommentaires = createSelector(selectCommentaireFactureClientState, (state: CommentaireFactureClientState) => state.commentaires);

export const selectLoading = createSelector(selectCommentaireFactureClientState, (state: CommentaireFactureClientState) => state.loading);

export const selectError = createSelector(selectCommentaireFactureClientState, (state: CommentaireFactureClientState) => state.error);
