import { createAction, props } from '@ngrx/store';
import { CommentaireFactureClient } from '../../models/CommentaireFactureClient.models';

// Load all comments for a specific facture
export const loadCommentairesFactureClient = createAction(
  '[Commentaire Facture Client] Load Comments',
  props<{ factureId: number }>()
);

export const loadCommentairesFactureClientSuccess = createAction(
  '[Commentaire Facture Client] Load Comments Success',
  props<{ commentaires: CommentaireFactureClient[] }>()
);

export const loadCommentairesFactureClientFailure = createAction(
  '[Commentaire Facture Client] Load Comments Failure',
  props<{ error: any }>()
);

// Add comment
export const addCommentaireFactureClient = createAction(
  '[Commentaire Facture Client] Add Comment',
  props<{ commentaire: CommentaireFactureClient }>()
);

export const addCommentaireFactureClientSuccess = createAction(
  '[Commentaire Facture Client] Add Comment Success',
  props<{ commentaire: CommentaireFactureClient }>()
);

export const addCommentaireFactureClientFailure = createAction(
  '[Commentaire Facture Client] Add Comment Failure',
  props<{ error: any }>()
);

// Update comment
export const updateCommentaireFactureClient = createAction(
  '[Commentaire Facture Client] Update Comment',
  props<{ commentaire: CommentaireFactureClient }>()
);

export const updateCommentaireFactureClientSuccess = createAction(
  '[Commentaire Facture Client] Update Comment Success',
  props<{ commentaire: CommentaireFactureClient }>()
);

export const updateCommentaireFactureClientFailure = createAction(
  '[Commentaire Facture Client] Update Comment Failure',
  props<{ error: any }>()
);

// Delete comment
export const deleteCommentaireFactureClient = createAction(
  '[Commentaire Facture Client] Delete Comment',
  props<{ commentaireId: number }>()
);

export const deleteCommentaireFactureClientSuccess = createAction(
  '[Commentaire Facture Client] Delete Comment Success',
  props<{ commentaireId: number }>()
);

export const deleteCommentaireFactureClientFailure = createAction(
  '[Commentaire Facture Client] Delete Comment Failure',
  props<{ error: any }>()
);
// ➕ Ajouter un commentaire
export const addCommentClient = createAction(
  '[Commentaire Client] Add',
  props<{ commentaire: CommentaireFactureClient, token: string }>()
);

export const addCommentClientSuccess = createAction(
  '[Commentaire Client] Add Success',
  props<{ commentaire: CommentaireFactureClient }>()
);

export const addCommentClientFailure = createAction(
  '[Commentaire Client] Add Failure',
  props<{ error: any }>()
);

// ✏️ Modifier un commentaire
export const updateCommentClient = createAction(
  '[Commentaire Client] Update',
  props<{ commentaire: CommentaireFactureClient, token: string }>()
);

export const updateCommentClientSuccess = createAction(
  '[Commentaire Client] Update Success',
  props<{ commentaire: CommentaireFactureClient }>()
);

export const updateCommentClientFailure = createAction(
  '[Commentaire Client] Update Failure',
  props<{ error: any }>()
);

// ❌ Supprimer un commentaire
export const deleteCommentClient = createAction(
  '[Commentaire Client] Delete',
  props<{ commentaireId: number, token: string }>()
);

export const deleteCommentClientSuccess = createAction(
  '[Commentaire Client] Delete Success',
  props<{ commentaireId: number }>()
);

export const deleteCommentClientFailure = createAction(
  '[Commentaire Client] Delete Failure',
  props<{ error: any }>()
);

// Action pour charger les commentaires côté client (via token)
export const loadCommentairesClient = createAction(
  '[Commentaire Client] Load Commentaires Client',
  props<{ factureId: number; token: string }>()
);

export const loadCommentairesClientSuccess = createAction(
  '[Commentaire Client] Load Commentaires Client Success',
  props<{ commentaires: CommentaireFactureClient[] }>()
);

export const loadCommentairesClientFailure = createAction(
  '[Commentaire Client] Load Commentaires Client Failure',
  props<{ error: any }>()
);
