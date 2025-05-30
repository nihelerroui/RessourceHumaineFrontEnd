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

export const selectContratsClientLoading = createSelector(
  selectContratClientState,
  (state) => state.loading
);

export const selectContratsClientError = createSelector(
  selectContratClientState,
  (state) => state.error
);
export const selectContratsClientSearchResults = createSelector(
  selectContratClientState,
  (state) => state.searchResults
);
export const selectContratsBySocieteAdmin = createSelector(
  selectContratClientState,
  (state) => state.contrats  
);


