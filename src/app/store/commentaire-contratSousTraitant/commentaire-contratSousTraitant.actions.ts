import { createAction, props } from '@ngrx/store';
import { CommentaireContratSousTraitant } from '../../models/commentaire-contratSousTraitant.model';

// === Chargement des commentaires ===
export const loadCommentairesContratSousTraitant = createAction(
  '[Commentaire Contrat Sous-Traitant] Load All',
  props<{ contratSTId: number }>()
);

export const loadCommentairesContratSousTraitantSuccess = createAction(
  '[Commentaire Contrat Sous-Traitant] Load All Success',
  props<{ commentaires: CommentaireContratSousTraitant[] }>()
);

export const loadCommentairesContratSousTraitantFailure = createAction(
  '[Commentaire Contrat Sous-Traitant] Load All Failure',
  props<{ error: string }>()
);

// === Ajout d’un commentaire ===
export const addCommentaireContratSousTraitant = createAction(
  '[Commentaire Contrat Sous-Traitant] Add',
  props<{ commentaire: CommentaireContratSousTraitant }>()
);

export const addCommentaireContratSousTraitantSuccess = createAction(
  '[Commentaire Contrat Sous-Traitant] Add Success',
  props<{ commentaire: CommentaireContratSousTraitant }>()
);

export const addCommentaireContratSousTraitantFailure = createAction(
  '[Commentaire Contrat Sous-Traitant] Add Failure',
  props<{ error: string }>()
);

// === Mise à jour ===
export const updateCommentaireContratSousTraitant = createAction(
  '[Commentaire Contrat Sous-Traitant] Update',
  props<{ commentaire: CommentaireContratSousTraitant }>()
);

export const updateCommentaireContratSousTraitantSuccess = createAction(
  '[Commentaire Contrat Sous-Traitant] Update Success',
  props<{ commentaire: CommentaireContratSousTraitant }>()
);

export const updateCommentaireContratSousTraitantFailure = createAction(
  '[Commentaire Contrat Sous-Traitant] Update Failure',
  props<{ error: string }>()
);

// === Suppression ===
export const deleteCommentaireContratSousTraitant = createAction(
  '[Commentaire Contrat Sous-Traitant] Delete',
  props<{ commentaireId: number }>()
);

export const deleteCommentaireContratSousTraitantSuccess = createAction(
  '[Commentaire Contrat Sous-Traitant] Delete Success',
  props<{ commentaireId: number }>()
);

export const deleteCommentaireContratSousTraitantFailure = createAction(
  '[Commentaire Contrat Sous-Traitant] Delete Failure',
  props<{ error: string }>()
);
