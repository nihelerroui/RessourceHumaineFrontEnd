import { Component, OnInit, TemplateRef } from "@angular/core";
import { Store } from "@ngrx/store";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import Swal from "sweetalert2";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { Observable } from "rxjs";
import { selectFactureClients, selectError, selectLoading, selectTotalFactureClient } from "../../../store/FactureClient/factureclient.selector";
import { CommentModalComponent } from "../../factureclientcomment-modal/factureclientcomment-modal-view/comment-modal.component";
import * as FactureClientActions from "src/app/store/FactureClient/factureclient.actions";
import { StatutFacture } from "src/app/models/statut-facture.enum";
import { StatutPaiement } from "src/app/models/statut-paiement.enum";
import { FactureClient } from "src/app/models/factureClient.models";
import { Actions, ofType } from "@ngrx/effects";
import { FactureClientCreateComponent } from "../../factureclientcreate/factureclientcreateview/factureclientcreate.component";
import { selectAllSocietes } from "src/app/store/Authentication/authentication-selector";
import * as AuthActions from "src/app/store/Authentication/authentication.actions";

@Component({
  selector: 'app-factureclient-admin',
  templateUrl: './factureclient-admin.component.html'
})
export class FactureclientAdminComponent implements OnInit {

  factureClients$: Observable<FactureClient[]> = this.store.select(selectFactureClients);
  adminSocietes$: Observable<any[]> = this.store.select(selectAllSocietes);
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);
  total$ = this.store.select(selectTotalFactureClient);

  modalRef?: BsModalRef;
  bsConfig: Partial<BsDatepickerConfig> = { showWeekNumbers: false, dateInputFormat: "DD/MM/YYYY" };

  allFactures: FactureClient[] = [];
  filteredFactures: FactureClient[] = [];
  paginatedFactures: FactureClient[] = [];

  consultantSocieteId = 0;
  selectedSocieteId: number | "" = "";
  selectedFacture: FactureClient | null = null;

  term = "";
  statutPaiementFilter = "";
  statutFactureFilter = "";
  typePaiementFilter = "";

  page = 1;
  facturesParPage = 5;
  today: string = new Date().toISOString().split('T')[0];

  constructor(
    private store: Store,
    private modalService: BsModalService,
    private actions$: Actions
  ) { }

  ngOnInit(): void {
    const user = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    this.consultantSocieteId = user?.societe?.societeId;
    this.selectedSocieteId = this.consultantSocieteId;

    this.store.dispatch(FactureClientActions.loadFacturesBySocieteAdmin());
    this.store.dispatch(AuthActions.loadAdminSocietes());

    this.factureClients$.subscribe(factures => {
      this.allFactures = factures;
      this.filterFactures();
    });

    this.actions$.pipe(ofType(FactureClientActions.updateFactureClientSuccess))
      .subscribe(() => this.store.dispatch(FactureClientActions.loadFacturesBySocieteAdmin()));

    this.error$.subscribe(error => error && console.error("Erreur store :", error));
  }

  openCreateModal(): void {
    this.modalRef = this.modalService.show(FactureClientCreateComponent, { class: "modal-lg" });
  }
  openEditModal(factureClientId: number): void {
    this.modalRef = this.modalService.show(FactureClientCreateComponent, {
      class: "modal-lg",
      initialState: { factureClientId }
    });
  }
  openCommentModal(factureClientId: number): void {
    this.modalRef = this.modalService.show(CommentModalComponent, {
      class: "modal-lg",
      initialState: { factureId: factureClientId }
    });
  }
  openDetailsModal(facture: any, template: TemplateRef<any>): void {
    this.selectedFacture = facture;
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  deleteFacture(factureClientId: number): void {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler"
    }).then(result => {
      if (result.isConfirmed) {
        this.store.dispatch(FactureClientActions.deleteFactureClient({ factureClientId }));

        Swal.fire("Supprimé !", "La facture a été supprimée.", "success");
      }
    });
  }
  
  modifierStatutFacture(facture: any, statut: StatutFacture): void {
    const statutPaiement = (statut === 'Confirmation_Complet') ? 'PAYÉE' : facture.statutPaiement;
    this.updateFactureStatus(facture, statut, statutPaiement);
  }

  updateFactureStatus(facture: any, statutFacture: string, statutPaiement?: string): void {
    const factureDto = {
      factureClientId: facture.factureClientId,
      consultantId: facture.consultant?.consultantId ?? facture.consultantId,
      contratId: facture.contratClient?.contratClientId ?? facture.contratId,
      dateEcheance: facture.dateEcheance,
      typePaiement: facture.typePaiement,
      pourcentageRemise: facture.pourcentageRemise,
      objet: facture.objet,
      numBonCommande: facture.numBonCommande,
      refFacture: facture.refFacture,
      montantHt: facture.montantHt,
      montantTtc: facture.montantTtc,
      montantTva: facture.montantTva,
      pourcentageTva: facture.pourcentageTva,
      dateEmmission: facture.dateEmmission,
      statutFacture: statutFacture as StatutFacture,
      statutPaiement: statutPaiement ? statutPaiement as StatutPaiement : facture.statutPaiement,
      prestations: (facture.prestations ?? []).map((p: any) => ({
        prestationId: p.prestationId,
        quantite: p.quantite,
        prixUnitaire: p.prixUnitaire
      }))
    };

    this.store.dispatch(FactureClientActions.updateFactureClient({ facture: factureDto }));
    setTimeout(() => {
      Swal.fire({
        icon: 'success',
        title: 'Statut mis à jour',
        text: 'La facture a bien été mise à jour.',
        timer: 1000,
        showConfirmButton: false
      });
    }, 500);
  }

  filterFactures() {
    const termLower = this.term.toLowerCase().trim();
    this.filteredFactures = this.allFactures.filter(f =>
      (!termLower || f.refFacture?.toLowerCase().includes(termLower)) &&
      (!this.statutFactureFilter || f.statutFacture === this.statutFactureFilter) &&
      (!this.statutPaiementFilter || f.statutPaiement === this.statutPaiementFilter) &&
      (!this.typePaiementFilter || f.typePaiement === this.typePaiementFilter) &&
      (!this.selectedSocieteId || f.contratClient.client.societe.societeId === +this.selectedSocieteId)
    );
    this.pageChanged({ page: 1 });
  }

  pageChanged(event: any) {
    this.page = event.page;
    const start = (this.page - 1) * this.facturesParPage;
    this.paginatedFactures = this.filteredFactures.slice(start, start + this.facturesParPage);
  }

  refreshList() {
    this.term = '';
    this.statutFactureFilter = '';
    this.statutPaiementFilter = '';
    this.typePaiementFilter = '';
    this.selectedSocieteId = this.consultantSocieteId;
    this.page = 1;
    this.store.dispatch(FactureClientActions.loadFacturesBySocieteAdmin());
  }
  
  envoyerEmailRappelClient(factureId: number): void {
    this.store.dispatch(FactureClientActions.envoyerEmailFacture({ factureId }));
    Swal.fire({
      icon: 'info',
      title: 'Envoi en cours',
      text: 'Un rappel est en train d\'être envoyé au client.',
      timer: 1500,
      showConfirmButton: false
    });
  }

  downloadFacture(factureId: number): void {
    this.store.dispatch(FactureClientActions.downloadFacture({ factureClientId: factureId }));
  }
}