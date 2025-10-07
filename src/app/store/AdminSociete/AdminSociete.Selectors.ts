// src/app/state/admin-societe.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AdminSocieteState } from './AdminSociete.reducer';

const selectAdminSocieteState = createFeatureSelector<AdminSocieteState>('adminSociete');

export const selectAdminSocietes = createSelector(
  selectAdminSocieteState,
  (state: AdminSocieteState) => state.adminSocietes
);

export const selectSocietes = createSelector(
  selectAdminSocieteState,
  (state: AdminSocieteState) => state.societes
);

export const selectAdmins = createSelector(
  selectAdminSocieteState,
  (state: AdminSocieteState) => state.admins
);

export const selectLoading = createSelector(
  selectAdminSocieteState,
  (state: AdminSocieteState) => state.loading
);

export const selectError = createSelector(
  selectAdminSocieteState,
  (state: AdminSocieteState) => state.error
);