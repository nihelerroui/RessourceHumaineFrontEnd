// src/app/state/admin-societe.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as AdminSocieteActions from './AdminSociete.actions';
import { AdminSociete } from 'src/app/models/adminSociete.model';
import { Societe } from 'src/app/models/societe.model';
import { Consultant } from 'src/app/models/consultant.model';

export interface AdminSocieteState {
  adminSocietes: AdminSociete[];
  societes: Societe[];
  admins: Consultant[];
  loading: boolean;
  error: any;
}

export const initialState: AdminSocieteState = {
  adminSocietes: [],
  societes: [],
  admins: [],
  loading: false,
  error: null
};
const _adminSocieteReducer = createReducer(
  initialState,
  on(AdminSocieteActions.loadSocietesByAdmin, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AdminSocieteActions.loadSocietesByAdminSuccess, (state, { societes }) => ({
    ...state,
    societes,
    loading: false
  })),
  on(AdminSocieteActions.loadSocietesByAdminFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);

export function adminSocieteReducer(state: any, action: any) {
  return _adminSocieteReducer(state, action);
}