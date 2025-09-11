import { createAction, props } from '@ngrx/store';
import { AdminSociete } from 'src/app/models/adminSociete.model';
import { User } from 'src/app/models/auth.models';
import { Consultant } from 'src/app/models/consultant.models';
import { PersonalDetails } from 'src/app/models/PersonalDetails.model';
import { Societe } from 'src/app/models/societe.model';


export const createUser = createAction(
  '[Auth] Create User',
  props<{ request: any }>()
);

export const createUserSuccess = createAction(
  '[Auth] Create User Success',
  props<{ user: User }>()
);

export const createUserFailure = createAction(
  '[Auth] Create User Failure',
  props<{ error: any }>()
);

export const createConsultant = createAction(
  '[Auth] Create Consultant',
  props<{ request: any }>()
);

export const createConsultantSuccess = createAction(
  '[Auth] Create Consultant Success',
  props<{ consultant: Consultant }>()
);

export const createConsultantFailure = createAction(
  '[Auth] Create Consultant Failure',
  props<{ error: any }>()
);

export const createPersonalDetails = createAction(
  '[Auth] Create PersonalDetails',
  props<{ request: any }>()
);

export const createPersonalDetailsSuccess = createAction(
  '[Auth] Create PersonalDetails Success',
  props<{ personalDetails: PersonalDetails }>()
);

export const createPersonalDetailsFailure = createAction(
  '[Auth] Create PersonalDetails Failure',
  props<{ error: any }>()
);

export const updateUser = createAction(
  '[Auth] Update User',
  props<{ userId: number; request: any }>()
);

export const updateUserSuccess = createAction(
  '[Auth] Update User Success',
  props<{ user: User }>()
);

export const updateUserFailure = createAction(
  '[Auth] Update User Failure',
  props<{ error: any }>()
);

export const updateConsultant = createAction(
  '[Auth] Update Consultant',
  props<{ consultantId: number, request: any }>()
);

export const updateConsultantSuccess = createAction(
  '[Auth] Update Consultant Success',
  props<{ consultant: Consultant }>()
);

export const updateConsultantFailure = createAction(
  '[Auth] Update Consultant Failure',
  props<{ error: any }>()
);



export const login = createAction(
  '[Authentication] Login', 
  props<{ email: string, password: string }>()
);
export const loginSuccess = createAction(
  '[Authentication] Login Success', 
  props<{ user: any }>()
);
export const loginFailure = createAction(
  '[Authentication] Login Failure', 
  props<{ error: any }>()
);

export const logout = createAction(
  '[Authentication] Logout');
export const logoutSuccess = createAction(
  '[Auth] Logout Success'
);

export const loadConsultants = createAction(
  '[Consultant] Load Consultants'
);
export const loadConsultantsSuccess = createAction(
  '[Consultant] Load Consultants Success',
  props<{ consultants: Consultant[] }>()
);

export const loadConsultantsFailure = createAction(
  '[Consultant] Load Consultants Failure',
  props<{ error: any }>()
);

export const loadAdminSocietes = createAction(
  '[Societe] Load Admin Societes'
);

export const loadAdminSocietesSuccess = createAction(
  '[Societe] Load Admin Societes Success',
  props<{ societes: AdminSociete[] }>()
);

export const loadAdminSocietesFailure = createAction(
  '[Societe] Load Admin Societes Failure',
  props<{ error: any }>()
);

export const updatePersonalDetailsWithFiles = createAction(
  '[Auth] Update Personal Details With Files',
  props<{
    personalDetailsId: number;
    dto: any;
    files: {
      cniFile?: File;
      carteGriseFile?: File;
      navigoFile?: File;
      attestationsFiles?: File[];
      contratFile?: File;
      kbisFile?: File;
      urssafFile?: File;
      photoFile?: File;
      ribFile?: File;
    };
  }>()
);

export const updatePersonalDetailsWithFilesSuccess = createAction(
  '[Auth] Update Personal Details With Files Success',
  props<{ personalDetails: PersonalDetails }>()
);

export const updatePersonalDetailsWithFilesFailure = createAction(
  '[Auth] Update Personal Details With Files Failure',
  props<{ error: any }>()
);

export const forgotPassword = createAction(
  '[Auth] Forgot Password',
  props<{ email: string }>()
);

export const forgotPasswordSuccess = createAction(
  '[Auth] Forgot Password Success',
  props<{ message: string }>()
);

export const forgotPasswordFailure = createAction(
  '[Auth] Forgot Password Failure',
  props<{ error: string }>()
);

export const resetPassword = createAction(
  '[Auth] Reset Password',
  props<{ token: string; newPassword: string }>()
);

export const resetPasswordSuccess = createAction(
  '[Auth] Reset Password Success',
  props<{ message: string }>()
);

export const resetPasswordFailure = createAction(
  '[Auth] Reset Password Failure',
  props<{ error: string }>()
);

export const loadUserImage = createAction('[Consultant] Load Consultant Image');
export const loadUserImageSuccess = createAction('[Consultant] Load Consultant Image Success', props<{ image: string }>());
export const loadUserImageFailure = createAction('[Consultant] Load Consultant Image Failure', props<{ error: string }>());
