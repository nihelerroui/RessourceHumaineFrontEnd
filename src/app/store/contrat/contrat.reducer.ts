import { createReducer, on } from "@ngrx/store";
import { ContratSousTraitant } from "../contrat/contrat.models";
import * as ContratActions from "../contrat/contrat.actions";

// État initial
export interface ContratState {
  contrats: ContratSousTraitant[];
  error: string | null;
}

const initialState: ContratState = {
  contrats: [],
  error: null,
};
// Reducer
export const contratReducer = createReducer(
  initialState,
  //charger les contrat
  on(ContratActions.loadContractsSuccess, (state, { contrats }) => ({
    ...state,
    contrats,
    error: null,
  })),
  on(ContratActions.loadContractsFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  //ajouter un contrat
  on(ContratActions.addContractSuccess, (state, { contrat }) => ({
    ...state,
    contrats: [...state.contrats, contrat],
    error: null,
  })),
  on(ContratActions.addContractFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  // Modifier un contrat
  on(ContratActions.updateContractSuccess, (state, { contrat }) => ({
    ...state,
    contrats: state.contrats.map((c) =>
      c.contratId === contrat.contratId ? contrat : c
    ),
  })),
  //supprimer un contrat
  on(ContratActions.deleteContract, (state, { id }) => ({
    ...state,
    contrats: state.contrats.filter((contrat) => contrat.contratId !== id),
  }))
);
