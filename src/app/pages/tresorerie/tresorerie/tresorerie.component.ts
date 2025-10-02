import { Component, OnInit, TemplateRef } from "@angular/core";
import { Store } from "@ngrx/store";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { combineLatest, map, Observable } from "rxjs";
import { AdminSociete } from "src/app/models/adminSociete.model";
import { Societe } from "src/app/models/societe.model";
import { SourceFinancement } from "src/app/models/SourceFinancement.enum";
import { Tresorerie } from "src/app/models/Tresorerie.model";
import { selectAllSocietes } from "src/app/store/Authentication/authentication-selector";
import * as AuthActions from "src/app/store/Authentication/authentication.actions";
import * as TresorerieActions from "src/app/store/tresorerie/tresorerie.actions";
import * as TresorerieSelectors from "src/app/store/tresorerie/tresorerie.selectors";
import * as RecetteActions from "src/app/store/recette/recette.actions";
import * as RecetteSelectors from "src/app/store/recette/recette.selectors";
import * as DepenseActions from "src/app/store/Depense/depense.actions";
import * as DepenseSelectors from "src/app/store/Depense/depense.selectors";

@Component({
  selector: "app-tresorerie",
  templateUrl: "./tresorerie.component.html",
  styleUrl: "./tresorerie.component.scss",
})
export class TresorerieComponent implements OnInit {
 breadCrumbItems!: Array<{ label: string; path?: string; active?: boolean }>;

  tresorerie$!: Observable<Tresorerie | null>;
  loading$!: Observable<boolean>;
  error$!: Observable<any>;

  adminSocietes: AdminSociete[] = [];
  selectedSocieteId!: number;

  role: string = "";
  montantAjout: number = 0;
  modalAction: string = "";

  modalRef?: BsModalRef;

  pageSize = 5;
  currentPage = 1;
  paginatedTransactions: any[] = [];
  transactions: any[] = [];

  transactions$!: Observable<any[]>;

  transactionsCaisse$!: Observable<any[]>;



  constructor(
    private modalService: BsModalService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "GESTION FINANCIERE", path: "/" },
      { label: "Suivi Trésorerie Bancaire", active: true },
    ];

    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    this.selectedSocieteId = currentUser?.societe?.societeId;
    this.role = currentUser?.user?.role || "";

    this.tresorerie$ = this.store.select(TresorerieSelectors.selectTresorerie);
    this.loading$ = this.store.select(TresorerieSelectors.selectTresorerieLoading);
    this.error$ = this.store.select(TresorerieSelectors.selectTresorerieError);

    this.store.dispatch(AuthActions.loadAdminSocietes());
    this.store.select(selectAllSocietes).subscribe((societes) => {
      this.adminSocietes = societes;
      if (!this.selectedSocieteId && societes.length > 0) {
        this.selectedSocieteId = societes[0].societeId;
      }
      if (this.selectedSocieteId) {
        this.loadTresorerie();
        this.loadRecettes();
        this.loadDepenses();
        this.observeTransactions();
      }
    });
  }

  loadTresorerie(): void {
    if (!this.selectedSocieteId) return;
    this.store.dispatch(TresorerieActions.loadTresorerie({ societeId: this.selectedSocieteId }));
  }

  loadRecettes(): void {
    if (!this.selectedSocieteId) return;
    this.store.dispatch(RecetteActions.loadRecettesBySociete({ societeId: this.selectedSocieteId }));
  }

  loadDepenses(): void {
    if (!this.selectedSocieteId) return;
    this.store.dispatch(DepenseActions.loadDepenses({ societeId: this.selectedSocieteId }));
  }

  observeTransactions(): void {
    combineLatest([
      this.store.select(RecetteSelectors.selectAllRecettesBySociete),
      this.store.select(DepenseSelectors.selectAllDepenses)
    ])
    .pipe(
      map(([recettes, depenses]) => {
        const recettesTresorerie = recettes
          .filter(r => r.sourceFinancement === SourceFinancement.TRESORERIE)
          .map(r => ({
            dateCreation: r.dateCreation,
            motif: r.motif,
            montant: r.montant,
            entree: true
          }));

        const depensesTresorerie = depenses
          .filter(d => d.sourceFinancement === SourceFinancement.TRESORERIE)
          .map(d => ({
            dateCreation: d.dateCreation,
            motif: d.motif,
            montant: d.montant,
            entree: false
          }));

        return [...recettesTresorerie, ...depensesTresorerie]
          .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime());
      })
    )
    .subscribe(transactions => {
      this.transactions = transactions;
      this.currentPage = 1;
      this.updatePaginatedTransactions();
    });
  }

  onSelectChange(newId: number): void {
    this.selectedSocieteId = newId;
    this.loadTresorerie();
    this.loadRecettes();
    this.loadDepenses();
  }

  setPage(event: any) {
    this.currentPage = event.page;
    this.updatePaginatedTransactions();
  }

  onPageChanged(event: any) {
    this.currentPage = event.page;
    this.updatePaginatedTransactions();
  }

  updatePaginatedTransactions() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedTransactions = this.transactions.slice(start, end);
  }

  openModal(template: TemplateRef<any>, action: string): void {
    this.modalAction = action;
    this.montantAjout = 0;
    this.modalRef = this.modalService.show(template, { class: "modal-md" });
  }

  closeModal(): void {
    this.modalRef?.hide();
  }

  validerAction(): void {
    if (this.modalAction === "initialiser") {
      this.initialiserTresorerie();
    }
  }

  ouvrirModalInitialisation(template: TemplateRef<any>): void {
    this.modalAction = "initialiser";
    this.montantAjout = 0;
    this.modalRef = this.modalService.show(template, { class: "modal-md" });
  }

  initialiserTresorerie(): void {
    if (this.montantAjout <= 0 || !this.selectedSocieteId) return;

    const nouvelleTresorerie: Tresorerie = {
      soldeInitial: this.montantAjout,
      societe: { societeId: this.selectedSocieteId } as Societe,
      devise: 'TND',
      entreesTotales : this.montantAjout,
    } as Tresorerie;

    this.store.dispatch(TresorerieActions.createTresorerie({ tresorerie: nouvelleTresorerie }));
    this.closeModal();
  }
}