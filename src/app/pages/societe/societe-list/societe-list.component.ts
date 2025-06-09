import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { combineLatest, filter, Observable, take } from "rxjs";
import * as SocieteActions from "src/app/store/societe/societe.actions";
import { Societe } from "src/app/models/societe.model";
import * as AuthActions from "src/app/store/Authentication/authentication.actions";
import * as SocieteSelectors from "src/app/store/societe/societe.selectors";
import Swal from "sweetalert2";
import { selectAdminSocietes } from "src/app/store/Authentication/authentication-selector";
import { AdminSociete } from "src/app/models/adminSociete.model";

@Component({
  selector: "app-societe-list",
  templateUrl: "./societe-list.component.html",
  styleUrls: ["./societe-list.component.css"],
})
export class SocieteListComponent implements OnInit {
  breadCrumbItems!: Array<{ label: string; path?: string; active?: boolean }>;
  societeList$: Observable<Societe[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  modalRef?: BsModalRef;
  societeForm!: FormGroup;
  submitted: boolean = false;

  filteredSocieteList: Societe[] = [];
  paginatedSocieteList: Societe[] = [];
  searchTerm: string = "";
  currentPage: number = 1;
  itemsPerPage: number = 8;

  selectedSociete!: Societe | null;

  private originalSocieteList: Societe[] = [];

  adminSocieteNamesSet = new Set<string>();


  adminSocieteList$: Observable<AdminSociete[]>;
  adminSocieteMappedList: Societe[] = [];

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    public store: Store
  ) {}

 ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Dashboard', path: '/' },
      { label: 'Liste des Sociétes', active: true }
    ];
    this.store.dispatch(SocieteActions.loadSocietes());
this.store.dispatch(AuthActions.loadAdminSocietes());

this.loading$ = this.store.select(SocieteSelectors.selectSocieteLoading);
  this.error$ = this.store.select(SocieteSelectors.selectSocieteError);

  this.initSocieteForm();

 combineLatest([
  this.store.select(SocieteSelectors.selectSocieteList), // Toutes les sociétés de la BD
  this.store.select(selectAdminSocietes) // Celles de l'API externe
]).subscribe(([allSocietes, adminSocietes]) => {
  const existingNames = allSocietes.map(s => s.nom.trim().toLowerCase());

  const societesToAdd = adminSocietes.filter(s =>
    !existingNames.includes(s.name.trim().toLowerCase()) 
  );

  societesToAdd.forEach(apiSociete => {
    const newSociete: Societe = {
      nom: apiSociete.name,
      adresse: apiSociete.adresse || '',
      contact: apiSociete.contact || '',
      email: apiSociete.email || '',
      numSiret: apiSociete.numSiret || '',
      numTva: apiSociete.numTva || '',
      telephone: apiSociete.telephone || '',
      responsable: apiSociete.contact || ''
    };

    this.store.dispatch(SocieteActions.addSociete({ societe: newSociete }));
  });

  const adminSocieteNames = adminSocietes.map(s => s.name.trim().toLowerCase());
  this.originalSocieteList = allSocietes.filter(s =>
    adminSocieteNames.includes(s.nom.trim().toLowerCase())
  );

  this.filterSociete();
});



  }






  private initSocieteForm(): void {
    this.societeForm = this.formBuilder.group({
      societeId: [""],
      seuilTresorerie: [0, [Validators.required, Validators.min(0)]],
    });
  }

 filterSociete() {
  this.filteredSocieteList = this.originalSocieteList.filter(
    s =>
      s.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      s.adresse.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      s.contact.toLowerCase().includes(this.searchTerm.toLowerCase())
  );
  this.pageChanged({ page: 1 });
}



  pageChanged(event: any) {
    this.currentPage = event.page;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedSocieteList = this.filteredSocieteList.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  trackBySocieteId(index: number, societe: Societe): number {
    return societe.societeId;
  }

  openModalEdit(societe: any, template: TemplateRef<any>) {
    this.societeForm.reset();
    this.societeForm.patchValue({
      societeId: societe.societeId,
      seuilTresorerie: societe.seuilTresorerie,
    });
    this.modalRef = this.modalService.show(template, { class: "modal-md" });
  }

  saveSociete() {
    if (this.societeForm.valid) {
      const { societeId, seuilTresorerie } = this.societeForm.value;

      this.store
        .select(SocieteSelectors.selectSocieteById(societeId))
        .pipe(take(1))
        .subscribe((original) => {
          if (original) {
            const updatedSociete = {
              ...original,
              seuilTresorerie,
            };

            this.store.dispatch(
              SocieteActions.updateSociete({ societe: updatedSociete })
            );
            this.store.dispatch(SocieteActions.loadSocietes()); 

            Swal.fire({
              icon: "success",
              title: "Seuil mis à jour avec succès !",
              showConfirmButton: false,
              timer: 1500,
            });

            this.modalRef?.hide();
            this.societeForm.reset();
          }
        });
    }
  }

  openDetailsSociete(societe: any, template: TemplateRef<any>) {
    this.selectedSociete = societe;
    this.modalRef = this.modalService.show(template, { class: "modal-md" });
  }
}
