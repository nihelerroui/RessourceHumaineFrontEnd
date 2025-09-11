import { Component, OnInit, TemplateRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Pays } from 'src/app/models/pays.model';
import { selectPaysError, selectPaysList, selectPaysLoading } from 'src/app/store/pays/pays.selectors';
import { addPays, deletePays, loadPays, updatePays } from 'src/app/store/pays/pays.actions';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-pays-list',
  templateUrl: './pays-list.component.html',
  styleUrls: ['./pays-list.component.css']
})
export class PaysListComponent implements OnInit {
  breadCrumbItems!: Array<{ label: string; path?: string; active?: boolean }>;
  paysList$: Observable<Pays[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  modalRef?: BsModalRef;
  paysForm!: FormGroup;
  submitted: boolean = false;
  filteredPaysList: Pays[] = [];
  paginatedPaysList: Pays[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 8;

  selectedPays!: Pays | null; 

  role: string = '';

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    public store: Store
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Dashboard', path: '/' },
      { label: 'Liste des Pays', active: true }
    ];

    const currentUser = JSON.parse(sessionStorage.getItem("currentUser") || "{}");
    this.role = currentUser?.user?.role || '';
    
    this.store.dispatch(loadPays());

    this.store.select(selectPaysList).subscribe(pays => {
      this.filteredPaysList = pays;
      this.pageChanged({ page: 1 }); 
    });
    this.loading$ = this.store.select(selectPaysLoading);
    this.error$ = this.store.select(selectPaysError);

    this.paysForm = this.formBuilder.group({
      paysId: [''],
      nomFrFr: ['', [Validators.required]],
      nomEnGb: ['', [Validators.required]],
      alphaFr: [
        '',
        [Validators.required, Validators.pattern('^[A-Za-z]{2,3}$'), Validators.maxLength(3)]
      ],
      alphaEn: [
        '',
        [Validators.required, Validators.pattern('^[A-Za-z]{2,3}$'), Validators.maxLength(3)]
      ],
    });

  }

  filterPays() {
    this.store.select(selectPaysList).subscribe(pays => {
      this.filteredPaysList = pays.filter(p =>
        p.nomFrFr.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.nomEnGb.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.pageChanged({ page: 1 });
    });
  }

  pageChanged(event: any) {
    this.currentPage = event.page;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedPaysList = this.filteredPaysList.slice(startIndex, startIndex + this.itemsPerPage);
  }

  refreshList() {
    this.store.dispatch(loadPays());
  }


  openModalAdd(template: TemplateRef<any>) {
    this.paysForm.reset(); 
    this.paysForm.patchValue({ paysId: null }); 
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }


  openModalEdit(pays: Pays, template: TemplateRef<any>) {
    this.paysForm.patchValue(pays); 
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }


  savePays() {
    if (this.paysForm.valid) {
      const paysData = this.paysForm.value;

      if (paysData.paysId) {
        this.store.dispatch(updatePays({ pays: paysData }));
        Swal.fire({
          icon: 'success',
          title: 'Pays mis à jour avec succès !',
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        this.store.dispatch(addPays({ pays: paysData }));
        Swal.fire({
          icon: 'success',
          title: 'Nouveau pays ajouté avec succès !',
          showConfirmButton: false,
          timer: 1500
        });
      }

      this.modalRef?.hide();
      this.paysForm.reset();
    }
  }

  onDeletePays(paysId: number) {
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
        this.store.dispatch(deletePays({ paysId }));
        Swal.fire({
          icon: 'success',
          title: 'Pays supprimé avec succès !',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }

  showDetails(pays: Pays, template: TemplateRef<any>) {
    this.selectedPays = pays; 
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }
}