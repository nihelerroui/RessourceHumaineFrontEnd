import { createAction, props } from '@ngrx/store';
import { Recette } from 'src/app/models/recette.models';

export const loadRecettes = createAction('[Recette] Load Recettes');
export const loadRecettesSuccess = createAction(
  '[Recette] Load Recettes Success',
  props<{ recettes: Recette[] }>()
);
export const loadRecettesFailure = createAction(
  '[Recette] Load Recettes Failure',
  props<{ error: any }>()
);

export const loadRecettesBySociete = createAction(
  '[Recette] Load Recettes By Societe',
  props<{ societeId: number }>()
);

export const loadRecettesBySocieteSuccess = createAction(
  '[Recette] Load Recettes By Societe Success',
  props<{ recettes: Recette[] }>()
);

export const loadRecettesBySocieteFailure = createAction(
  '[Recette] Load Recettes By Societe Failure',
  props<{ error: any }>()
);
