import { Component, OnInit, TemplateRef } from "@angular/core";
import { Store } from "@ngrx/store";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup } from "@angular/forms";
import Swal from "sweetalert2";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { combineLatest, map, Observable } from "rxjs";
import { selectFactureClients, selectError, selectLoading, selectTotalFactureClient } from "../../../store/FactureClient/factureclient.selector";
import { FactureClientCreateComponent } from "../../factureclientcreate/factureclientcreateview/factureclientcreate.component";
import { CommentModalComponent } from "../../factureclientcomment-modal/factureclientcomment-modal-view/comment-modal.component";
import { deleteFactureClient, downloadFacture, envoyerEmailFacture, loadFacturesClient, updateFactureClientSuccess } from "src/app/store/FactureClient/factureclient.actions";
import { StatutPaiement } from "src/app/models/statut-paiement.enum";
import { FactureClient } from "src/app/models/factureClient.models";
import { Action } from "@fullcalendar/core/internal";
import { Actions, ofType } from "@ngrx/effects";

@Component({
  selector: "app-factureclient-list",
  templateUrl: "./factureclient-list.component.html",
})
export class FactureClientListComponent implements OnInit {
  term: string = "";
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

  statutPaiementFilter: string = "";
  statutFactureFilter: string = "";
  typePaiementFilter: string = "";

  page = 1;
  facturesParPage = 5;
  total$: Observable<number> = this.store.select(selectTotalFactureClient);
  facturesPagination$: Observable<FactureClient[]> = new Observable();
  filteredFactures$: Observable<FactureClient[]> = new Observable();
  today: string = new Date().toISOString().split('T')[0];

  constructor(
    public store: Store,
    private modalService: BsModalService,
    private actions$: Actions
  ) { this.factureClients$ = this.store.select(selectFactureClients); }

  ngOnInit(): void {
    this.store.dispatch(loadFacturesClient());
    this.updatePagination();
    this.error$.subscribe(error => {
      if (error) console.error("Erreur du store:", error);
    });
    this.actions$
      .pipe(ofType(updateFactureClientSuccess))
      .subscribe(() => {
        this.store.dispatch(loadFacturesClient());
        this.updatePagination();
      });
  }

  //pagination
  updatePagination() {
  this.filteredFactures$ = this.factureClients$.pipe(
    map(factures => {
      const start = (this.page - 1) * this.facturesParPage;
      return factures.slice(start, start + this.facturesParPage);
    })
  );
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
  applyFilters(): void {
  this.filteredFactures$ = this.factureClients$.pipe(
    map(factures => {
      const lowerTerm = this.term.toLowerCase().trim();
      return factures
        .filter(f =>
          (!lowerTerm || Object.values(f).some(value => value?.toString().toLowerCase().includes(lowerTerm))) &&
          (!this.statutFactureFilter || f.statutFacture?.toUpperCase() === this.statutFactureFilter.toUpperCase().trim()) &&
          (!this.typePaiementFilter || f.typePaiement?.toUpperCase() === this.typePaiementFilter.toUpperCase().trim()) &&
          (!this.statutPaiementFilter || f.statutPaiement?.toUpperCase() === this.statutPaiementFilter.toUpperCase().trim())
        )
        .slice((this.page - 1) * this.facturesParPage, this.page * this.facturesParPage);
    })
  );
}

  resetFilters(): void {
  this.term = this.statutPaiementFilter = this.statutFactureFilter = this.typePaiementFilter = "";
  this.page = 1;
  this.store.dispatch(loadFacturesClient());
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
        this.store.dispatch(deleteFactureClient({ factureClientId }));

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
    this.store.dispatch(envoyerEmailFacture({ factureId }));
    Swal.fire({
      icon: 'info',
      title: 'Envoi en cours',
      text: 'Un rappel est en train d\'être envoyé au client.',
      timer: 1500,
      showConfirmButton: false
    });
  }
  downloadFacture(factureId: number): void {
    this.store.dispatch(downloadFacture({ factureClientId: factureId }));
  }

}