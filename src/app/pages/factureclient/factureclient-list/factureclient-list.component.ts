import { ChangeDetectorRef, Component, OnInit, TemplateRef } from "@angular/core";
import { Store } from "@ngrx/store";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup } from "@angular/forms";
import Swal from "sweetalert2";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { map, Observable } from "rxjs";
import { selectFactureClients, selectError, selectLoading, selectTotalFactureClient } from "../../../store/FactureClient/factureclient.selector";
import { FactureClientCreateComponent } from "../../factureclientcreate/factureclientcreateview/factureclientcreate.component";
import { CommentModalComponent } from "../../factureclientcomment-modal/factureclientcomment-modal-view/comment-modal.component";
import * as FactureAction from "src/app/store/FactureClient/factureclient.actions";
import { StatutPaiement } from "src/app/models/statut-paiement.enum";
import { FactureClient } from "src/app/models/factureClient.models";
import { Actions, ofType } from "@ngrx/effects";
import { loadSocietesAdministrees } from "src/app/store/societe/societe.actions";
import { selectSocietesAdministrees } from "src/app/store/societe/societe.selectors";

@Component({
  selector: "app-factureclient-list",
  templateUrl: "./factureclient-list.component.html",
})
export class FactureClientListComponent implements OnInit {
  
  modalRef?: BsModalRef;
  editForm: FormGroup;
  factureClients$: Observable<any[]>;
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);
  bsConfig: Partial<BsDatepickerConfig> = { showWeekNumbers: false, dateInputFormat: "DD/MM/YYYY" };
  breadCrumbItems = [
    { label: "Factures Clients" },
    { label: "Factures Clients List", active: true },
  ];

  prestations: any[] = [];
  contratsClient: any[] = [];
  factures: any[] = [];
  originalFactures: any[] = [];
  selectedFacture: any;
  StatutPaiement = StatutPaiement;
  filteredFactures: FactureClient[] = [];
  paginatedFactures: FactureClient[] = [];

  term: string = "";
  statutPaiementFilter: string = "";
  statutFactureFilter: string = "";
  typePaiementFilter: string = "";
  selectedSocieteId: string = "";
  societesAdministrees: { societeId: number; nom: string }[] = [];
  filteredTotal: number = 0;

  page = 1;
  facturesParPage = 5;
  total$: Observable<number> = this.store.select(selectTotalFactureClient);
  facturesPagination$: Observable<FactureClient[]> = new Observable();
  //filteredFactures$: Observable<FactureClient[]> = new Observable();
  today: string = new Date().toISOString().split('T')[0];

  constructor(
    public store: Store,
    private modalService: BsModalService,
    private actions$: Actions,
    private cdr: ChangeDetectorRef
  ) { this.factureClients$ = this.store.select(selectFactureClients); }

  ngOnInit(): void {
    this.store.dispatch(FactureAction.loadFacturesBySocieteAdmin());
    //Récupérer la liste des sociétées administrés
    this.store.dispatch(loadSocietesAdministrees());
    // Attendre que les factures soient chargées
    this.factureClients$.subscribe(factures => {
      this.filterFactures(); // applique la pagination avec les données réelles
    });
    this.store.select(selectSocietesAdministrees)
      .subscribe(list => this.societesAdministrees = list);

    this.error$.subscribe(error => {
      if (error) console.error("Erreur du store:", error);
    });
    this.actions$
      .pipe(ofType(FactureAction.updateFactureClientSuccess))
      .subscribe(() => {
        this.store.dispatch(FactureAction.loadFacturesBySocieteAdmin());
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
 filterFactures() {
  this.factureClients$.subscribe(factures => {
    const termLower = this.term.toLowerCase().trim();
    this.filteredFactures = factures.filter(f =>
      (!termLower || f.refFacture?.toLowerCase().includes(termLower)) &&
      (!this.statutFactureFilter || f.statutFacture === this.statutFactureFilter) &&
      (!this.statutPaiementFilter || f.statutPaiement === this.statutPaiementFilter) &&
      (!this.typePaiementFilter || f.typePaiement === this.typePaiementFilter) &&
      (!this.selectedSocieteId || f.contratClient.client.societe.societeId === +this.selectedSocieteId)
    );
    this.pageChanged({ page: 1 });
  });
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
    this.store.dispatch(FactureAction.loadFacturesBySocieteAdmin());
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
        this.store.dispatch(FactureAction.deleteFactureClient({ factureClientId }));

        Swal.fire("Supprimé !", "La facture a été supprimée.", "success");
      }
    });
  }

  openCommentModal(facture: FactureClient | number): void {
    const factureId = typeof facture === 'number' ? facture : facture.factureClientId;
    this.modalRef = this.modalService.show(CommentModalComponent, {
      class: "modal-lg",
      initialState: {
        factureId,
        readOnlyMode: true
      }
    });
  }
  openDetailsModal(facture: any, template: TemplateRef<any>): void {
    this.selectedFacture = facture;
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }
  envoyerEmailRappelClient(factureId: number): void {
    this.store.dispatch(FactureAction.envoyerEmailFacture({ factureId }));
    Swal.fire({
      icon: 'info',
      title: 'Envoi en cours',
      text: 'Un rappel est en train d\'être envoyé au client.',
      timer: 1500,
      showConfirmButton: false
    });
  }
  downloadFacture(factureId: number): void {
    this.store.dispatch(FactureAction.downloadFacture({ factureClientId: factureId }));
  }

}