import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ContratClientState } from "../contratClient/contratClient.reducer";
import { selectCommentaireContratState } from "../commentaire-contrat/commentaire-contrat.selectors";

export const selectContratClientState = createFeatureSelector<ContratClientState>("contratsClient");

// Sélectionner tous les contrats
export const selectAllContratsClient = createSelector(
  selectContratClientState,
  (state) => state.contrats
);
export const selectCommentairesByContratId = (contratId: number) =>
  createSelector(
    selectCommentaireContratState,
    (state) => state.commentaires.filter(comment => comment.contratClient?.contratClientId === contratId)
  );


// Sélectionner l'état de chargement
export const selectContratsClientLoading = createSelector(
  selectContratClientState,
  (state) => state.loading
);

// Sélectionner les erreurs éventuelles
export const selectContratsClientError = createSelector(
  selectContratClientState,
  (state) => state.error
);
