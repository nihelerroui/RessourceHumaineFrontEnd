import { createAction, props } from '@ngrx/store';
import { AdminRegisterRequest } from 'src/app/models/adminRegisterRequest.models';

export const registerUser = createAction(
    '[Auth] Register User',
    props<{ request: AdminRegisterRequest }>()
  );

  export const registerUserSuccess = createAction(
    '[Auth] Register User Success'
  );
  
  export const registerUserFailure = createAction(
    '[Auth] Register User Failure',
    props<{ error: any }>()
  );

  export const updateUser = createAction(
    '[User] Update User',
    props<{ userId: number, request: AdminRegisterRequest }>()
  );
  
  export const updateUserSuccess = createAction(
    '[User] Update User Success',
    props<{ response: any }>()
  );
  
  export const updateUserFailure = createAction(
    '[User] Update User Failure',
    props<{ error: string }>()
  );

export const login = createAction('[Authentication] Login', props<{ email: string, password: string }>());
export const loginSuccess = createAction('[Authentication] Login Success', props<{ user: any }>());
export const loginFailure = createAction('[Authentication] Login Failure', props<{ error: any }>());


export const logout = createAction('[Authentication] Logout');
export const logoutSuccess = createAction('[Auth] Logout Success');


