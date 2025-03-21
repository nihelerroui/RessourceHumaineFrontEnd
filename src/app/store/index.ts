import { ActionReducerMap } from "@ngrx/store";
import { authReducer, AuthState } from './Authentication/authentication.reducer';
import { LayoutState, layoutReducer } from "./layouts/layouts.reducer";
import { depenseReducer, DepenseState } from './Depense/depense.reducer';

export interface RootReducerState {
    layout: LayoutState;
    auth: AuthState;
    depense: DepenseState;
}

export const rootReducer: ActionReducerMap<RootReducerState> = {
    layout: layoutReducer,
    auth: authReducer,
    depense: depenseReducer,
}
