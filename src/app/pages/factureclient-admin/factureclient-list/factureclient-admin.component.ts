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
import { loadSocietesAdministrees } from "src/app/store/societe/societe.actions";
import { selectSocietesAdministrees } from "src/app/store/societe/societe.selectors";

@Component({
  selector: 'app-factureclient-admin',
  templateUrl: './factureclient-admin.component.html'
})
export class FactureclientAdminComponent implements OnInit {
  term: string = "";
  modalRef?: BsModalRef;
  factureClients$: Observable<FactureClient[]>;
  allFactures: FactureClient[] = [];
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);
  bsConfig: Partial<BsDatepickerConfig> = { showWeekNumbers: false, dateInputFormat: "DD/MM/YYYY" };
  breadCrumbItems = [
    { label: "Factures Clients" },
    { label: "Factures Clients List", active: true },
  ];

  selectedFacture: any;
  StatutPaiement = StatutPaiement;

  statutPaiementFilter: string = "";
  statutFactureFilter: string = "";
  typePaiementFilter: string = "";
  selectedSocieteId: string = "";
  societesAdministrees: { societeId: number; nom: string }[] = [];

  page = 1;
  filteredTotal: number = 0;
  facturesParPage = 5;
  total$: Observable<number> = this.store.select(selectTotalFactureClient);
  filteredFactures: FactureClient[] = [];
  paginatedFactures: FactureClient[] = [];
  today: string = new Date().toISOString().split('T')[0];


  constructor(
    public store: Store,
    private modalService: BsModalService,
    private actions$: Actions
  ) {
    this.factureClients$ = this.store.select(selectFactureClients);
  }

  ngOnInit(): void {
    this.store.dispatch(FactureClientActions.loadFacturesBySocieteAdmin());
    //Récupérer la liste des sociétées administrés
    this.store.dispatch(loadSocietesAdministrees());
    this.factureClients$.subscribe(factures => {
      this.allFactures = factures;
      this.filterFactures(); // applique la pagination avec les données réelles
    });
    this.store.select(selectSocietesAdministrees)
      .subscribe(list => this.societesAdministrees = list);
    this.error$.subscribe(error => {
      if (error) console.error("Erreur du store:", error);
    });
    this.actions$
      .pipe(ofType(FactureClientActions.updateFactureClientSuccess))
      .subscribe(() => {
        this.store.dispatch(FactureClientActions.loadFacturesBySocieteAdmin());
     
      });
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

  modifierStatutFacture(facture: any, statut: StatutFacture): void {
    const statutPaiement = (statut === 'Confirmation_Complet') ? 'PAYÉE' : facture.statutPaiement;
    this.updateFactureStatus(facture, statut, statutPaiement);
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
      this.selectedSocieteId = '';
      this.page = 1;
      this.store.dispatch(FactureClientActions.loadFacturesBySocieteAdmin());
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