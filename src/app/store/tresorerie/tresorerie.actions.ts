import { createAction, props } from '@ngrx/store';
import { Tresorerie } from 'src/app/models/Tresorerie.model';

export const loadTresorerie = createAction(
  '[Tresorerie] Load Tresorerie',
  props<{ societeId: number }>()
);

export const loadTresorerieSuccess = createAction(
  '[Tresorerie] Load Tresorerie Success',
  props<{ tresorerie: Tresorerie }>()
);

export const loadTresorerieFailure = createAction(
  '[Tresorerie] Load Tresorerie Failure',
  props<{ error: any }>()
);

export const createTresorerie = createAction(
  '[Tresorerie] Create Tresorerie',
  props<{ tresorerie: Tresorerie }>()
);

export const createTresorerieSuccess = createAction(
  '[Tresorerie] Create Tresorerie Success',
  props<{ tresorerie: Tresorerie }>()
);

export const createTresorerieFailure = createAction(
  '[Tresorerie] Create Tresorerie Failure',
  props<{ error: any }>()
);
