import { createReducer, on } from "@ngrx/store";
import * as AuthActions from "src/app/store/Authentication/authentication.actions";
import { User } from "../../models/auth.models";
import { Consultant } from "src/app/models/consultant.models";
import { PersonalDetails } from "src/app/models/PersonalDetails.model";
import { Societe } from "src/app/models/societe.model";
import { AdminSociete } from "src/app/models/adminSociete.model";

export interface AuthenticationState {
  consultants: Consultant[];
  user: User | null;
  consultant: Consultant | null;
  personalDetails: PersonalDetails | null;
  isLoggedIn: boolean;
  error: string | null;
  loading: boolean;
  societes: AdminSociete[];

  resetPasswordSuccess: boolean;
  resetPasswordError: string | null;
  resetPasswordLoading: boolean;

  confirmResetSuccess: boolean;
  confirmResetError: string | null;
  confirmResetLoading: boolean;

  resetPasswordSuccessMessage: string | null;

  userImage: string | null;
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

  resetPasswordSuccess: false,
  resetPasswordError: null,
  resetPasswordLoading: false,

  confirmResetSuccess: false,
  confirmResetError: null,
  confirmResetLoading: false,
  resetPasswordSuccessMessage: null,
  userImage: null,
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
 on(AuthActions.forgotPassword, state => ({
  ...state,
  resetPasswordLoading: true,
  resetPasswordSuccess: false,
  resetPasswordError: null
})),


on(AuthActions.forgotPasswordSuccess, (state, { message }) => ({
  ...state,
  forgotPasswordSuccessMessage: message,
  forgotPasswordError: null,
})),

on(AuthActions.forgotPasswordFailure, (state, { error }) => ({
  ...state,
  resetPasswordLoading: false,
  resetPasswordError: error
})),
on(AuthActions.resetPassword, state => ({
  ...state,
  confirmResetLoading: true,
  confirmResetSuccess: false,
  confirmResetError: null
})),

on(AuthActions.resetPasswordSuccess, () => ({
  ...initialState,
  confirmResetLoading: false,
  confirmResetSuccess: true
})),

on(AuthActions.resetPasswordFailure, (state, { error }) => ({
  ...state,
  confirmResetLoading: false,
  confirmResetError: error
})),
on(AuthActions.forgotPasswordSuccess, (state, { message }) => ({
  ...state,
  resetPasswordSuccess: true,
  resetPasswordSuccessMessage: message,
  resetPasswordError: null,
  resetPasswordLoading: false,
})),
on(AuthActions.updatePersonalDetailsWithFilesSuccess, (state, { personalDetails }) => ({
  ...state,
  personalDetails,
  loading: false,
})),

 on(AuthActions.loadUserImage, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AuthActions.loadUserImageSuccess, (state, { image }) => ({
    ...state,
    userImage: image,
    loading: false
  })),

  on(AuthActions.loadUserImageFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
)