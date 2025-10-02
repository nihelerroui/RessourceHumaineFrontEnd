import { createReducer, on } from '@ngrx/store';
import * as ConsultantActions from './consultant.actions';

export interface ConsultantState {
  consultants: any[];
  loading: boolean;
  error: any;
}

export const initialState: ConsultantState = {
  consultants: [],
  loading: false,
  error: null
};

export const consultantReducer = createReducer(
  initialState,
  on(ConsultantActions.loadConsultantsBySociete, state => ({
    ...state,
    loading: true
  })),
  on(ConsultantActions.loadConsultantsBySocieteSuccess, (state, { consultants }) => ({
    ...state,
    consultants,
    loading: false
  })),
  on(ConsultantActions.loadConsultantsBySocieteFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  on(ConsultantActions.loadConsultantByMail, state => ({ ...state, loading: true })),
  on(ConsultantActions.loadConsultantByMailSuccess, (state, { consultant }) => ({
    ...state,
    consultant,
    loading: false
  })),
  on(ConsultantActions.loadConsultantByMailFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
