import { createAction, props } from '@ngrx/store';
import { FactureSousTraitant } from 'src/app/models/FactureSousTraitant.model';

export const loadFacturesSousTraitant = createAction(
  '[FactureSousTraitant] Load FacturesSousTraitant',
  props<{ consultantId: number; month: number; year: number; token: string }>()
);

export const loadFacturesSousTraitantSuccess = createAction(
  '[FactureSousTraitant] Load FacturesSousTraitant Success',
  props<{ factures: FactureSousTraitant[] }>()
);

export const loadFacturesSousTraitantFailure = createAction(
  '[FactureSousTraitant] Load FacturesSousTraitant Failure',
  props<{ error: any }>()
);
