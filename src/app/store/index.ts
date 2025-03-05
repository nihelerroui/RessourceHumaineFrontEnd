import { ActionReducerMap } from "@ngrx/store";
import { AuthenticationState, authenticationReducer } from "./Authentication/authentication.reducer";
import { LayoutState, layoutReducer } from "./layouts/layouts.reducer";
import { depenseReducer, DepenseState } from './Depense/depense.reducer';

export interface RootReducerState {
    layout: LayoutState;
    auth: AuthenticationState;
    depense: DepenseState;
}

export const rootReducer: ActionReducerMap<RootReducerState> = {
    layout: layoutReducer,
    auth: authenticationReducer,
    depense: depenseReducer,
}