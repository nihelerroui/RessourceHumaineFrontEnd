import { createReducer, on } from '@ngrx/store';
import { CommentaireContratClient } from '../../models/commentaire-contratClient.model';
import * as CommentaireActions from './commentaire-contratClient.actions';

export interface CommentaireContratClientState {
  commentaires: CommentaireContratClient[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentaireContratClientState = {
  commentaires: [],
  loading: false,
  error: null,
};

export const commentaireContratClientReducer = createReducer(
  initialState,
  on(CommentaireActions.loadCommentairesContratClient, state => ({ ...state, loading: true })),
  on(CommentaireActions.loadCommentairesContratClientSuccess, (state, { commentaires }) => ({
    ...state,
    commentaires,
    loading: false,
  })),
  on(CommentaireActions.loadCommentairesContratClientFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(CommentaireActions.addCommentaireContratClientSuccess, (state, { commentaire }) => ({
    ...state,
    commentaires: [...state.commentaires, commentaire],
  })),
  on(CommentaireActions.updateCommentaireContratClientSuccess, (state, { commentaire }) => ({
    ...state,
    commentaires: state.commentaires.map(c =>
      c.commentaireId === commentaire.commentaireId ? commentaire : c
    ),
  })),
  on(CommentaireActions.deleteCommentaireContratClientSuccess, (state, { commentaireId }) => ({
    ...state,
    commentaires: state.commentaires.filter(c => c.commentaireId !== commentaireId),
  })),
  // === Client: Load
on(CommentaireActions.loadCommentairesClientContratSuccess, (state, { commentaires }) => ({
  ...state,
  commentaires,
  loading: false,
  error: null,
})),
on(CommentaireActions.loadCommentairesClientContratFailure, (state, { error }) => ({
  ...state,
  loading: false,
  error,
})),

// === Client: Add
on(CommentaireActions.addCommentClientContratSuccess, (state, { commentaire }) => ({
  ...state,
  commentaires: [...state.commentaires, commentaire],
  error: null,
})),
on(CommentaireActions.addCommentClientContratFailure, (state, { error }) => ({
  ...state,
  error,
})),

// === Client: Update
on(CommentaireActions.updateCommentClientContratSuccess, (state, { commentaire }) => ({
  ...state,
  commentaires: state.commentaires.map(c =>
    c.commentaireId === commentaire.commentaireId ? commentaire : c
  ),
  error: null,
})),
on(CommentaireActions.updateCommentClientContratFailure, (state, { error }) => ({
  ...state,
  error,
})),

// === Client: Delete
on(CommentaireActions.deleteCommentClientContratSuccess, (state, { commentaireId }) => ({
  ...state,
  commentaires: state.commentaires.filter(c => c.commentaireId !== commentaireId),
  error: null,
})),
on(CommentaireActions.deleteCommentClientContratFailure, (state, { error }) => ({
  ...state,
  error,
})),

);
