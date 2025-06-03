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
