import { createAction, props } from '@ngrx/store';
import { MainOeuvre } from 'src/app/models/mainOeuvre.model';

export const loadMainOeuvre = createAction(
  '[MainOeuvre] Load MainOeuvre'
);


export const loadMainOeuvreSuccess = createAction(
  '[MainOeuvre] Load Success',
  props<{ data: MainOeuvre[] }>()
);

export const loadMainOeuvreFailure = createAction(
  '[MainOeuvre] Load Failure',
  props<{ error: string }>()
);


export const verifierMiseAJourMainOeuvre = createAction(
  '[MainOeuvre] Vérifier Mise à Jour',
  props<{ adminId: number; mois: number; annee: number }>()
);

export const verifierMiseAJourMainOeuvreSuccess = createAction(
  '[MainOeuvre] Vérifier Mise à Jour Success'
);

export const verifierMiseAJourMainOeuvreFailure = createAction(
  '[MainOeuvre] Vérifier Mise à Jour Failure',
  props<{ error: string }>()
);
