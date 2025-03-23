import { createAction, props } from '@ngrx/store';
import { AdminRegisterRequest } from '../../models/admin-register-request.model';  // <-- Import here

// Login Actions
export const login = createAction(
  '[Authentication] Login',
  props<{ credentials: { email: string; password: string } }>()
);

export const loginSuccess = createAction(
    '[Authentication] Login Success',
    props<{ accessToken: string; tokenType: string }>()
  );

export const loginFailure = createAction(
  '[Authentication] Login Failure',
  props<{ error: string }>()
);

// Register Actions
export const register = createAction(
  '[Authentication] Register',
  props<{ credentials: AdminRegisterRequest }>()
);
export const registerSuccess = createAction(
  '[Authentication] Register Success',
  props<{ authResponse: any }>()
);

export const registerFailure = createAction(
  '[Authentication] Register Failure',
  props<{ error: string }>()
);

// Get User (Authenticated User Details) Actions
export const getUser = createAction('[Authentication] Get User');

export const getUserSuccess = createAction(
  '[Authentication] Get User Success',
  props<{ user: any }>()
);

export const getUserFailure = createAction(
  '[Authentication] Get User Failure',
  props<{ error: string }>()
);
