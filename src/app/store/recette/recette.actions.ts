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
