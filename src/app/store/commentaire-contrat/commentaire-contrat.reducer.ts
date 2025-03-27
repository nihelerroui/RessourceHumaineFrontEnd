// reducer/commentaire-contrat.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as CommentaireActions from './commentaire-contrat.actions';
import { CommentaireContrat } from '../../models/commentaire-contrat.model';

export interface CommentaireContratState {
  commentaires: CommentaireContrat[];
  loading: boolean;
  error: string | null;
}

export const initialState: CommentaireContratState = {
  commentaires: [],
  loading: false,
  error: null,
};

export const commentaireContratReducer = createReducer(
  initialState,

  // LOAD
  on(CommentaireActions.loadCommentairesContrat, (state) => ({
    ...state,
    loading: true,
  })),
  on(CommentaireActions.loadCommentairesContratSuccess, (state, { commentaires }) => ({
    ...state,
    commentaires,
    loading: false,
    error: null,
  })),
  on(CommentaireActions.loadCommentairesContratFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // ADD
  on(CommentaireActions.addCommentaireContratSuccess, (state, { commentaire }) => ({
    ...state,
    commentaires: [...state.commentaires, commentaire],
    loading: false,
  })),

  // ADD CLIENT
  on(CommentaireActions.addCommentaireContratClientSuccess, (state, { commentaire }) => ({
    ...state,
    commentaires: [...state.commentaires, commentaire],
    loading: false,
  })),

  // UPDATE
  on(CommentaireActions.updateCommentaireContratSuccess, (state, { commentaire }) => ({
    ...state,
    commentaires: state.commentaires.map((c) =>
      c.commentaireId === commentaire.commentaireId ? commentaire : c
    ),
  })),

  // DELETE
  on(CommentaireActions.deleteCommentaireContratSuccess, (state, { commentaireId }) => ({
    ...state,
    commentaires: state.commentaires.filter((c) => c.commentaireId !== commentaireId),
  }))
);