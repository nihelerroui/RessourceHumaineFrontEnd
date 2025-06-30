import { Component, OnInit, TemplateRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin, Observable } from 'rxjs';
import { DepenseService } from 'src/app/core/services/depense.service';
import { RecetteService } from 'src/app/core/services/recette.service';
import { TresorerieService } from 'src/app/core/services/tresorerie.service';
import { AdminSociete } from 'src/app/models/adminSociete.model';
import { Societe } from 'src/app/models/societe.model';
import { SourceFinancement } from 'src/app/models/SourceFinancement.enum';
import { Tresorerie } from 'src/app/models/Tresorerie.model';
import { selectAllSocietes } from 'src/app/store/Authentication/authentication-selector';
import * as AuthActions from "src/app/store/Authentication/authentication.actions";


@Component({
  selector: 'app-tresorerie',
  templateUrl: './tresorerie.component.html',
  styleUrl: './tresorerie.component.scss'
})
export class TresorerieComponent implements OnInit {
  breadCrumbItems!: Array<{ label: string; path?: string; active?: boolean }>;
  tresorerie$!: Observable<Tresorerie>;
 transactions: any[] = [];
  adminSocietes: AdminSociete[] = [];
  selectedSocieteId!: number;

  role: string = '';
  montantAjout: number = 0;
  modalAction: string = '';

  modalRef?: BsModalRef;

  constructor(
    private tresorerieService: TresorerieService,
    private modalService: BsModalService,
    private store: Store,
     private recetteService: RecetteService,
  private depenseService: DepenseService,
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Trésorerie', path: '/' },
      { label: 'Suivi Trésorerie Bancaire', active: true }
    ];

    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    this.selectedSocieteId = currentUser?.societe?.societeId;
    this.role = currentUser?.user?.role || '';

    this.store.dispatch(AuthActions.loadAdminSocietes());
    this.store.select(selectAllSocietes).subscribe((societes) => {
      this.adminSocietes = societes;
      if (!this.selectedSocieteId && societes.length > 0) {
        this.selectedSocieteId = societes[0].societeId;
      }
      if (this.selectedSocieteId) {
        this.loadTresorerie();
        this.loadTransactions();
      }
    });
  }

  loadTresorerie(): void {
    if (!this.selectedSocieteId) return;
    this.tresorerie$ = this.tresorerieService.getTresorerieBySociete(this.selectedSocieteId);
  }

  loadTransactions() {
  if (!this.selectedSocieteId) return;

  forkJoin([
    this.recetteService.getRecettesBySociete(this.selectedSocieteId),
    this.depenseService.getDepensesBySociete(this.selectedSocieteId)
  ]).subscribe(([recettes, depenses]) => {
    
    const recettesTresorerie = recettes.filter(r => r.sourceFinancement === SourceFinancement.TRESORERIE);
    const depensesTresorerie = depenses.filter(d => d.sourceFinancement === SourceFinancement.TRESORERIE);

    this.transactions = [
      ...recettesTresorerie.map(r => ({
        dateCreation: r.dateCreation,
        motif: r.motif,
        montant: r.montant,
        entree: true
      })),
      ...depensesTresorerie.map(d => ({
        dateCreation: d.dateCreation,
        motif: d.motif,
        montant: d.montant,
        entree: false
      }))
    ].sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime());
  });
}



  onSelectChange(newId: number): void {
    this.selectedSocieteId = newId;
    this.loadTresorerie();
    this.loadTransactions();
  }

  openModal(template: TemplateRef<any>, action: string) {
    this.modalAction = action;
    this.montantAjout = 0;
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  closeModal() {
    this.modalRef?.hide();
  }

  validerAction() {
    if (this.modalAction === 'initialiser') {
      this.initialiserTresorerie();
    }
  }


  ouvrirModalInitialisation(template: TemplateRef<any>) {
  this.modalAction = 'initialiser';
  this.montantAjout = 0;
  this.modalRef = this.modalService.show(template, { class: 'modal-md' });
}

initialiserTresorerie() {
  if (this.montantAjout <= 0 || !this.selectedSocieteId) return;

  const nouvelleTresorerie: Partial<Tresorerie> = {
    soldeInitial: this.montantAjout,
    societe: { societeId: this.selectedSocieteId } as Societe
  };

  this.tresorerieService.createTresorerie(nouvelleTresorerie as Tresorerie)
    .subscribe({
      next: () => {
        this.closeModal();
        this.loadTresorerie();
        this.loadTransactions();
      },
      error: (err) => {
        console.error('Erreur création trésorerie :', err);
      }
    });
}

}