import { createReducer, on } from '@ngrx/store';
import * as CommentaireSousTraitantActions from './commentaire-contratSousTraitant.actions';
import { CommentaireContratSousTraitant } from '../../models/commentaire-contratSousTraitant.model';

export interface CommentaireContratSousTraitantState {
  commentaires: CommentaireContratSousTraitant[];
  loading: boolean;
  error: string | null;
}

export const initialState: CommentaireContratSousTraitantState = {
  commentaires: [],
  loading: false,
  error: null,
};

export const commentaireContratSousTraitantReducer = createReducer(
  initialState,

  // === LOAD ===
  on(CommentaireSousTraitantActions.loadCommentairesContratSousTraitant, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CommentaireSousTraitantActions.loadCommentairesContratSousTraitantSuccess, (state, { commentaires }) => ({
    ...state,
    commentaires,
    loading: false,
    error: null,
  })),
  on(CommentaireSousTraitantActions.loadCommentairesContratSousTraitantFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // === ADD ===
  on(CommentaireSousTraitantActions.addCommentaireContratSousTraitantSuccess, (state, { commentaire }) => ({
    ...state,
    commentaires: [...state.commentaires, commentaire],
    loading: false,
  })),

  // === UPDATE ===
  on(CommentaireSousTraitantActions.updateCommentaireContratSousTraitantSuccess, (state, { commentaire }) => ({
    ...state,
    commentaires: state.commentaires.map(c =>
      c.commentaireId === commentaire.commentaireId ? commentaire : c
    ),
  })),

  // === DELETE ===
  on(CommentaireSousTraitantActions.deleteCommentaireContratSousTraitantSuccess, (state, { commentaireId }) => ({
    ...state,
    commentaires: state.commentaires.filter(c => c.commentaireId !== commentaireId),
  }))
);
