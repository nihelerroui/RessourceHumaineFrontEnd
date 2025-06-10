import { createAction, props } from '@ngrx/store';
import { CommentaireContratClient } from '../../models/commentaire-contratClient.model';

// Charger les commentaires
export const loadCommentairesContratClient = createAction(
  '[Commentaire Contrat Client] Load',
  props<{ contratClientId: number }>()
);

export const loadCommentairesContratClientSuccess = createAction(
  '[Commentaire Contrat Client] Load Success',
  props<{ commentaires: CommentaireContratClient[] }>()
);

export const loadCommentairesContratClientFailure = createAction(
  '[Commentaire Contrat Client] Load Failure',
  props<{ error: string }>()
);

// Ajouter
export const addCommentaireContratClient = createAction(
  '[Commentaire Contrat Client] Add',
  props<{ commentaire: CommentaireContratClient }>()
);

export const addCommentaireContratClientSuccess = createAction(
  '[Commentaire Contrat Client] Add Success',
  props<{ commentaire: CommentaireContratClient }>()
);

export const addCommentaireContratClientFailure = createAction(
  '[Commentaire Contrat Client] Add Failure',
  props<{ error: string }>()
);

// Mettre à jour
export const updateCommentaireContratClient = createAction(
  '[Commentaire Contrat Client] Update',
  props<{ commentaire: CommentaireContratClient }>()
);

export const updateCommentaireContratClientSuccess = createAction(
  '[Commentaire Contrat Client] Update Success',
  props<{ commentaire: CommentaireContratClient }>()
);

export const updateCommentaireContratClientFailure = createAction(
  '[Commentaire Contrat Client] Update Failure',
  props<{ error: string }>()
);

// Supprimer
export const deleteCommentaireContratClient = createAction(
  '[Commentaire Contrat Client] Delete',
  props<{ commentaireId: number }>()
);

export const deleteCommentaireContratClientSuccess = createAction(
  '[Commentaire Contrat Client] Delete Success',
  props<{ commentaireId: number }>()
);

export const deleteCommentaireContratClientFailure = createAction(
  '[Commentaire Contrat Client] Delete Failure',
  props<{ error: string }>()
);
// Charger les commentaires côté client
export const loadCommentairesClientContrat = createAction(
  '[Commentaire Contrat Client - Client] Load',
  props<{ contratClientId: number; token: string }>()
);

export const loadCommentairesClientContratSuccess = createAction(
  '[Commentaire Contrat Client - Client] Load Success',
  props<{ commentaires: CommentaireContratClient[] }>()
);

export const loadCommentairesClientContratFailure = createAction(
  '[Commentaire Contrat Client - Client] Load Failure',
  props<{ error: string }>()
);

// Ajouter côté client
export const addCommentClientContrat = createAction(
  '[Commentaire Contrat Client - Client] Add',
  props<{ commentaire: CommentaireContratClient; token: string }>()
);

export const addCommentClientContratSuccess = createAction(
  '[Commentaire Contrat Client - Client] Add Success',
  props<{ commentaire: CommentaireContratClient }>()
);

export const addCommentClientContratFailure = createAction(
  '[Commentaire Contrat Client - Client] Add Failure',
  props<{ error: string }>()
);

// Modifier côté client
export const updateCommentClientContrat = createAction(
  '[Commentaire Contrat Client - Client] Update',
  props<{ commentaire: CommentaireContratClient; token: string }>()
);

export const updateCommentClientContratSuccess = createAction(
  '[Commentaire Contrat Client - Client] Update Success',
  props<{ commentaire: CommentaireContratClient }>()
);

export const updateCommentClientContratFailure = createAction(
  '[Commentaire Contrat Client - Client] Update Failure',
  props<{ error: string }>()
);

// Supprimer côté client
export const deleteCommentClientContrat = createAction(
  '[Commentaire Contrat Client - Client] Delete',
  props<{ commentaireId: number; token: string }>()
);

export const deleteCommentClientContratSuccess = createAction(
  '[Commentaire Contrat Client - Client] Delete Success',
  props<{ commentaireId: number }>()
);

export const deleteCommentClientContratFailure = createAction(
  '[Commentaire Contrat Client - Client] Delete Failure',
  props<{ error: string }>()
);
