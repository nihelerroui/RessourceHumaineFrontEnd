import { createReducer, on } from "@ngrx/store";
import * as AuthActions from "src/app/store/Authentication/authentication.actions";
import { User } from "../../models/auth.models";
import { Consultant } from "src/app/models/consultant.models";
import { PersonalDetails } from "src/app/models/PersonalDetails.model";
import { Societe } from "src/app/models/societe.model";

export interface AuthenticationState {
  consultants: Consultant[];
  user: User | null;
  consultant: Consultant | null;
  personalDetails: PersonalDetails | null;
  isLoggedIn: boolean;
  error: string | null;
  loading: boolean;
  societes: Societe[];
}

const initialState: AuthenticationState = {
  consultants: [],
  user: null,
  consultant: null,
  personalDetails: null,
  isLoggedIn: false,
  error: null,
  loading: false,
  societes: [],
};

export const authenticationReducer = createReducer(
  initialState,
  on(AuthActions.createUser, (state) => ({ ...state, loading: true })),
  on(AuthActions.createUserSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
  })),
  on(AuthActions.createUserFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(AuthActions.createConsultant, (state) => ({ ...state, loading: true })),
  on(AuthActions.createConsultantSuccess, (state, { consultant }) => ({
    ...state,
    consultant,
    loading: false,
  })),
  on(AuthActions.createConsultantFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(AuthActions.createPersonalDetails, (state) => ({ ...state, loading: true })),
  on(AuthActions.createPersonalDetailsSuccess, (state, { personalDetails }) => ({
    ...state,
    personalDetails,
    loading: false,
  })),
  on(AuthActions.createPersonalDetailsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(AuthActions.updateConsultant, (state) => ({ ...state, loading: true })),
  on(AuthActions.updateConsultantSuccess, (state, { consultant }) => ({
    ...state,
    consultant,
    loading: false,
  })),
  on(AuthActions.updateConsultantFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(AuthActions.updateUser, (state) => ({
    ...state,
    loading: true,
  })),

  on(AuthActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
  })),

  on(AuthActions.updateUserFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({ ...state, error })),
  on(AuthActions.logout, (state) => ({ ...state, user: null })),

  on(AuthActions.loadConsultants, (state) => ({ ...state, loading: true })),
  on(AuthActions.loadConsultantsSuccess, (state, { consultants }) => ({
    ...state,
    loading: false,
    consultants,
  })),
  on(AuthActions.loadConsultantsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
   on(AuthActions.loadAdminSocietesSuccess, (state, { societes }) => ({
  ...state,
  societes,
})),

on(AuthActions.loadAdminSocietesFailure, (state, { error }) => ({
  ...state,
  societes: [],
  error,
})),

);
