import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import * as SocieteActions from 'src/app/store/societe/societe.actions';
import { Societe } from 'src/app/models/societe.model';
import { selectSocieteError, selectSocieteList, selectSocieteLoading } from 'src/app/store/societe/societe.selectors';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-societe-list',
  templateUrl: './societe-list.component.html',
  styleUrls: ['./societe-list.component.css']
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
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 8;

  selectedSociete!: Societe | null;

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    public store: Store
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Dashboard', path: '/' },
      { label: 'Liste des Sociétes', active: true }
    ];

    // Déclencher l'action NgRx pour charger les societes
    this.store.dispatch(SocieteActions.loadSocietes());

    // Sélectionner les données depuis le store

    this.store.select(selectSocieteList).subscribe(societe => {
      this.filteredSocieteList = societe;
      this.pageChanged({ page: 1 });
    });

    this.loading$ = this.store.select(selectSocieteLoading);
    this.error$ = this.store.select(selectSocieteError);


    this.societeForm = this.formBuilder.group({
      societeId: [''],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      adresse: ['', Validators.required],
      contact: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      numSiret: ['', [Validators.required]],
      numTva: ['', [Validators.required]], 
      telephone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      responsable: ['', Validators.required],
      seuilTresorerie :[0, [Validators.required , Validators.min(0)]]
    });

  }

  filterSociete() {
    this.store.select(selectSocieteList).subscribe(societe => {
      this.filteredSocieteList = societe.filter(s =>
        s.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        s.adresse.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        s.contact.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.pageChanged({ page: 1 });
    });
  }

  pageChanged(event: any) {
    this.currentPage = event.page;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedSocieteList = this.filteredSocieteList.slice(startIndex, startIndex + this.itemsPerPage);
  }

  
  refreshList() {
    this.store.dispatch(SocieteActions.loadSocietes());
  }

 
 openModalAdd(template: TemplateRef<any>) {
  this.societeForm.reset();
  this.societeForm.patchValue({ societeId: null });
  this.modalRef = this.modalService.show(template, { class: 'modal-md' });
}


  openModalEdit(societe: any, template: TemplateRef<any>) {
  this.societeForm.patchValue(societe);
  this.modalRef = this.modalService.show(template, { class: 'modal-md' });
}



  saveSociete() {
    if (this.societeForm.valid) {
      const societeData = this.societeForm.value;

      if (societeData.societeId) {
        this.store.dispatch(SocieteActions.updateSociete({ societe: societeData }));
        Swal.fire({
          icon: 'success',
          title: 'Sociéte mis à jour avec succès !',
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        this.store.dispatch(SocieteActions.addSociete({ societe: societeData }));
        Swal.fire({
          icon: 'success',
          title: 'Nouveau societe ajouté avec succès !',
          showConfirmButton: false,
          timer: 1500
        });
      }

      this.modalRef?.hide();
      this.societeForm.reset();
    }
  }

 
  onDeleteSociete(societeId: number) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.store.dispatch(SocieteActions.deleteSociete({ societeId }));
        Swal.fire({
          icon: 'success',
          title: 'Societe supprimé avec succès !',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }

  openDetailsSociete(societe: any, template: TemplateRef<any>) {
    this.selectedSociete = societe;
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

}


