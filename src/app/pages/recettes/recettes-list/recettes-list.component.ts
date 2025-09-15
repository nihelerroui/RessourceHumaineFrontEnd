import { Component, TemplateRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { Recette } from 'src/app/models/recette.models';
import { SourceFinancement } from 'src/app/models/SourceFinancement.enum';
import { selectAllSocietes } from 'src/app/store/Authentication/authentication-selector';
import * as AuthActions from "src/app/store/Authentication/authentication.actions";
import { loadRecettes } from 'src/app/store/recette/recette.actions';
import { selectAllRecettes, selectRecetteError, selectRecetteLoading } from 'src/app/store/recette/recette.selectors';

@Component({
  selector: 'app-recettes-list',
  templateUrl: './recettes-list.component.html',
  styleUrls: ['./recettes-list.component.css']
})
export class RecettesListComponent {

   breadCrumbItems!: Array<{ label: string; path?: string; active?: boolean }>;
  currentPage: number = 1;
  itemsPerPage: number = 8;
  modalRef?: BsModalRef;
  selectedRecette!: Recette | null;
  lists: Recette[] = [];
  recettes: Recette[] = [];
  recettesFiltrees: Recette[] = [];
  term: string = "";
  moisSelectionne: string = "";

  loading$!: Observable<boolean>;
  error$!: Observable<any>;



  selectedSocieteId!: number;
  consultantSocieteId!: number;
  adminSocietes: any[] = [];

  role : String ="";

  sourceFinancementEnum = SourceFinancement;
 sourceFinancementOptions: string[] = [];
 sourceFinancementSelectionne: string = "";



  constructor(
    private store: Store,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "GESTION FINANCIERE", path: "/" },
      { label: "Liste des Recettes", active: true },
    ];

    this.sourceFinancementOptions = Object.values(SourceFinancement);

    const currentUser = JSON.parse(sessionStorage.getItem("currentUser") || "{}");
    this.consultantSocieteId = currentUser.societe?.societeId;
    this.selectedSocieteId = this.consultantSocieteId;
    this.role = currentUser?.user?.role || "";

    this.store.dispatch(AuthActions.loadAdminSocietes());

    this.store.select(selectAllSocietes).subscribe((societes) => {
      this.adminSocietes = societes;
      const matchingSociete = societes.find(s => s.societeId === this.consultantSocieteId);
      if (!matchingSociete && societes.length > 0) {
        this.selectedSocieteId = societes[0].societeId;
      }
      this.filtrerRecettes();
    });

    this.loading$ = this.store.select(selectRecetteLoading);
    this.error$ = this.store.select(selectRecetteError);

    this.store.dispatch(loadRecettes());


    this.store.select(selectAllRecettes).subscribe((data) => {
      this.recettes = data;
      this.filtrerRecettes();
    });
  }

  openDetailsModal(recette: Recette, template: TemplateRef<any>) {
    this.selectedRecette = recette;
    this.modalRef = this.modalService.show(template, { class: "modal-md" });
  }

 filtrerRecettes(): void {
  const terme = this.term?.toLowerCase() || "";

  this.recettesFiltrees = this.recettes.filter(
    (r) =>
      r.societe?.societeId === this.selectedSocieteId &&
      (!this.moisSelectionne ||
        r.dateCreation?.toLowerCase().includes(this.moisSelectionne.toLowerCase())) &&
      (!terme ||
        r.source?.toLowerCase().includes(terme) ||
        r.motif?.toLowerCase().includes(terme)) &&
      (!this.sourceFinancementSelectionne ||
        r.sourceFinancement === this.sourceFinancementSelectionne)
  );

  this.pageChanged({ page: 1 });
}


  pageChanged(event: any): void {
    this.currentPage = event.page;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.lists = this.recettesFiltrees.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }


}
