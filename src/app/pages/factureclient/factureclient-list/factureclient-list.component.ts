import { Component, OnInit, TemplateRef } from "@angular/core";
import { Store } from "@ngrx/store";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { combineLatest, map, Observable } from "rxjs";
import { selectFactureClients, selectError, selectLoading, selectTotalFactureClient } from "../../../store/FactureClient/factureclient.selector";
import { FactureClientService } from "../../../core/services/factureclient.service";
import { FactureClientCreateComponent } from "../../factureclientcreate/factureclientcreateview/factureclientcreate.component";
import { CommentModalComponent } from "../../factureclientcomment-modal/factureclientcomment-modal-view/comment-modal.component";
import { deleteFactureClient, downloadFacture, envoyerEmailFacture, loadFacturesClient } from "src/app/store/FactureClient/factureclient.actions";
import { StatutPaiement } from "src/app/models/statut-paiement.enum";
import { FactureClient } from "src/app/models/factureClient.models";

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
  lists: any[] = [];
  today: string = new Date().toISOString().split('T')[0]; 

  constructor(
    public store: Store,
    private modalService: BsModalService,
    private formBuilder: UntypedFormBuilder,
    private factureClientService: FactureClientService,
  ) {
    this.editForm = this.formBuilder.group({
      factureClientId: ["", Validators.required],
      prestationIds: [[], Validators.required],
      consultantId: ["", Validators.required],
      contratId: ["", Validators.required],
      dateEcheance: ["", Validators.required],
      typePaiement: ["", Validators.required],
      pourcentageRemise: [""]
    });

    this.factureClients$ = this.store.select(selectFactureClients);
  }

  ngOnInit(): void {
    this.store.dispatch(loadFacturesClient());
    this.updatePagination();
    this.error$.subscribe(error => {
      if (error) console.error("Erreur du store:", error);
    });

    this.fetchPrestations();
    this.fetchContratsClient();
   
  }
  //pagination
  updatePagination() {
    this.facturesPagination$ = combineLatest([this.factureClients$]).pipe(
      map(([factures]) => {
        const start = (this.page - 1) * this.facturesParPage;
        return factures.slice(start, start + this.facturesParPage);
      })
    );
    this.filteredFactures$ = this.facturesPagination$;
  }
  
  openCreateModal(): void {
    this.modalRef = this.modalService.show(FactureClientCreateComponent, { class: "modal-lg" });
  }

  openEditModal(factureClientId: number): void {
    this.modalRef = this.modalService.show(FactureClientCreateComponent, {
      class: "modal-lg",
      initialState: { factureClientId }
    });
    if (this.selectedFacture?.factureClientId === factureClientId) {
      this.store.select(selectFactureClients).subscribe(factures => {
        const updated = factures.find(f => f.factureClientId === factureClientId);
        if (updated) this.selectedFacture = updated;
      });
    }
  }

  fetchPrestations(): void {
    this.factureClientService.getPrestations().subscribe({
      next: data => this.prestations = data,
      error: error => console.error("Erreur chargement prestations:", error)
    });
  }

  fetchContratsClient(): void {
    this.factureClientService.getContratsClient().subscribe({
      next: data => this.contratsClient = data,
      error: error => console.error("Erreur chargement contrats client:", error)
    });
  }

  searchFactureClient(): void {
    const lowerTerm = this.term.toLowerCase();

    this.factureClients$.subscribe(data => {
      const filtered = data.filter(facture =>
        Object.values(facture).some(value =>
          value?.toString().toLowerCase().includes(lowerTerm)
        )
      );

      this.originalFactures = data;
      this.factures = filtered;
      this.applyFilters();
    });
  }
  applyFilters(): void {
    this.factureClients$.subscribe((factures) => {
      let filtered = [...factures];
  
      const term = this.term.toLowerCase().trim();
      const statutFacture = this.statutFactureFilter.toUpperCase().trim();
      const typePaiement = this.typePaiementFilter.toUpperCase().trim();
      const statutPaiement = this.statutPaiementFilter.toUpperCase().trim();
  
      if (term) {
        filtered = filtered.filter((f) =>
          Object.values(f).some((value) =>
            value?.toString().toLowerCase().includes(term)
          )
        );
      }
  
      if (statutFacture) {
        filtered = filtered.filter(
          (f) => f.statutFacture?.toUpperCase() === statutFacture
        );
      }
  
      if (typePaiement) {
        filtered = filtered.filter(
          (f) => f.typePaiement?.toUpperCase() === typePaiement
        );
      }
  
      if (statutPaiement) {
        filtered = filtered.filter(
          (f) => f.statutPaiement?.toUpperCase() === statutPaiement
        );
      }
  
      this.factures = filtered;
      this.filteredFactures$ = new Observable((observer) => {
        observer.next(filtered);
        observer.complete();
      });
    });
  }
   
  resetFilters(): void {
    this.term = this.statutPaiementFilter = this.statutFactureFilter = this.typePaiementFilter = "";
    this.applyFilters();
  }

  pageChanged(event: any): void {
    const start = (event.page - 1) * event.itemsPerPage;
    const end = event.page * event.itemsPerPage;

    this.factureClients$.subscribe(data => {
      this.lists = data.slice(start, end);
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