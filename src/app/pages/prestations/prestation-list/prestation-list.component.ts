// src/app/pages/prestations/prestation-list/prestation-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { fetchPrestationData, deletePrestation } from '../../../store/Prestation/prestation.action';
import { selectData, selectError, selectLoading } from '../../../store/Prestation/prestation-selector';
import { PrestationService } from '../../../core/services/prestation.service';

@Component({
  selector: 'app-prestation-list',
  templateUrl: './prestation-list.component.html',
  styleUrls: ['./prestation-list.component.scss'],
})
export class PrestationListComponent implements OnInit {
  // Pagination and variables
  page: any = 1;
  term: any;
  searchTerm: any;
  searchResults: any;
  modalRef?: BsModalRef;
  prestationForm!: UntypedFormGroup;
  submitted: boolean = false;
  isEditMode: boolean = false;
  createForm: FormGroup;
  editForm: FormGroup;
  lists?: any[] = [];
  prestations?: any[] = [];
  selectedDate?: Date;
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);
  bsConfig: Partial<BsDatepickerConfig>;
  breadCrumbItems: Array<{}>;
  contracts$: Observable<any[]>;
  contracts: any[] = [];
  prestationDetailsForm: FormGroup;

  constructor(
    public store: Store,
    private modalService: BsModalService,
    private formBuilder: UntypedFormBuilder,
    private prestationService: PrestationService,
    private http: HttpClient
  ) {
    this.breadCrumbItems = [{ label: 'Prestations' }, { label: 'Prestations List', active: true }];
    this.bsConfig = {
      showWeekNumbers: false,
      dateInputFormat: 'DD/MM/YYYY',
    };
  }

  ngOnInit(): void {
    // Initialize forms
    this.prestationForm = this.formBuilder.group({
      consultantId: [140, [Validators.required]],
      contratId: ['', [Validators.required]],
      month: ['', [Validators.required]],
      year: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });

    this.createForm = this.formBuilder.group({
      consultantId: [140, Validators.required],
      contratId: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
      description: ['', Validators.required],
    });
  
    this.editForm = this.formBuilder.group({
      prestationId: ['', Validators.required],
      description: ['', Validators.required],
      prixUnitaire: ['', Validators.required],
      quantite: ['', Validators.required],
      montantHt: ['', Validators.required],
     // contratId: ['', Validators.required],
    });

    this.prestationDetailsForm = this.formBuilder.group({
      description: ['', Validators.required],
      client: ['', Validators.required],
      prixUnitaire: ['', Validators.required],
      quantite: ['', Validators.required],
      montantHt: ['', Validators.required],
    });

    // Dispatch action to fetch prestation data
    this.store.dispatch(fetchPrestationData());
    
    // Subscribe to store data
    this.store.select(selectData).subscribe({
      next: (data) => {
        console.log('Store data received:', data);
        this.prestations = data;
        this.lists = data?.slice(0, 8);
      },
      error: (error) => console.error('Store subscription error:', error),
    });
    
    this.loadContracts();

    this.loading$.subscribe((loading) => console.log('Loading state:', loading));
    this.error$.subscribe((error) => { if (error) console.error('Store error:', error); });
  }

  loadContracts() {
    this.contracts$ = this.http.get<any[]>('http://localhost:8089/spring/contratsClient');
    this.contracts$.subscribe({
      next: (data) => {
        this.contracts = data;
        console.log('Contracts received:', data);
      },
      error: (error) => console.error('Error fetching contracts:', error),
    });
  }

  // Convert contratId to number if necessary and return the matching designation
  getContratName(contratId: number | string): string {
    const id = typeof contratId === 'string' ? parseInt(contratId, 10) : contratId;
    const contrat = this.contracts.find(c => c.contratClientId === id);
    return contrat ? contrat.designation : 'N/A';
  }

  get form() {
    return this.prestationForm.controls;
  }

  openModal(content: any) {
    this.submitted = false;
    this.isEditMode = false;
    this.prestationForm.reset();
    this.prestationForm.patchValue({ consultantId: 140 });
    
    setTimeout(() => {
      const modelTitle = document.querySelector('.modal-title') as HTMLElement;
      if (modelTitle) modelTitle.innerHTML = 'Add Prestation';
      
      const addBtn = document.getElementById('add-btn') as HTMLElement;
      if (addBtn) addBtn.innerHTML = "Add Prestation";
    });
    
    this.modalRef = this.modalService.show(content, { class: 'modal-md' });
  }

  viewDetails(id: any, content: any) {
    console.log('Viewing prestation details:', id);
    this.http.get(`http://localhost:8089/spring/prestations/${id}`).subscribe({
      next: (response: any) => {
        console.log('Prestation Details:', response);
        this.prestationDetailsForm.patchValue({
          description: response.description,
          client: response.client?.nom || 'N/A',
          prixUnitaire: response.prixUnitaire,
          quantite: response.quantite,
          montantHt: response.montantHt,
        });
        this.modalRef = this.modalService.show(content, { class: 'modal-md' });
      },
      error: (error) => {
        console.error('Error fetching prestation details:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error fetching prestation details',
          text: error.message,
        });
      },
    });
  }
  
  openCreateModal(content: any): void {
    this.createForm.reset();
    this.createForm.patchValue({ consultantId: 140 });
    this.modalRef = this.modalService.show(content, { class: 'modal-md' });
  }

  editDataGet(id: any, content: any): void {
    const prestation = this.prestations.find(p => p.prestationId === id);
    if (prestation) {
      this.editForm.patchValue({
        prestationId: prestation.prestationId,
        description: prestation.description,
        prixUnitaire: prestation.prixUnitaire,
        quantite: prestation.quantite,
        montantHt: prestation.montantHt,
        //contratId: prestation.contratId,
      });
      this.modalRef = this.modalService.show(content, { class: 'modal-md' });
    }
  }
  
  // Use createForm data when saving a new prestation
  savePrestation() {
    this.submitted = true;
  
    if (this.createForm.valid) {
      const prestationDTO = this.createForm.value;
      console.log('Prestation Data being sent:', prestationDTO);
  
      this.prestationService.createPrestation(prestationDTO).subscribe({
        next: (response) => {
          console.log('Prestation creation response:', response);
          Swal.fire({
            icon: 'success',
            title: 'Prestation created successfully!',
            showConfirmButton: false,
            timer: 1500,
          });
          this.modalRef?.hide();
          this.store.dispatch(fetchPrestationData());
        },
        error: (error) => {
          console.error('Error creating prestation:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error creating prestation',
            text: error.message,
          });
        },
      });
    }
  }

  // Example update method for editing a prestation
  updatePrestation() {
    this.submitted = true;
  
    if (this.editForm.valid) {
      const updatedPrestation = this.editForm.value;
      console.log('Updated prestation data:', updatedPrestation);
  
      this.prestationService.updatePrestation(updatedPrestation).subscribe({
        next: (response) => {
          console.log('Prestation update response:', response);
          Swal.fire({
            icon: 'success',
            title: 'Prestation updated successfully!',
            showConfirmButton: false,
            timer: 1500,
          });
          this.modalRef?.hide();
          this.store.dispatch(fetchPrestationData());
        },
        error: (error) => {
          console.error('Error updating prestation:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error updating prestation',
            text: error.message,
          });
        },
      });
    }
  }

  delete(event: any, id: number) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger ms-2',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        showCancelButton: true,
      })
      .then((result) => {
        if (result.value) {
          this.store.dispatch(deletePrestation({ id }));
          swalWithBootstrapButtons.fire('Deleted!', 'Your prestation has been deleted.', 'success');
          event.target.closest('tr')?.remove();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire('Cancelled', 'Your prestation is safe :)', 'error');
        }
      });
  }

  searchPrestation() {
    if (this.term && this.prestations) {
      this.lists = this.prestations.filter((data: any) => {
        return (
          data.description.toLowerCase().includes(this.term.toLowerCase()) ||
          (data.client && data.client.toLowerCase().includes(this.term.toLowerCase()))
        );
      });
    } else {
      this.lists = this.prestations?.slice(0, 8);
    }
  }

  selectStatus() {
    const status = (document.getElementById('idStatus') as HTMLInputElement).value;
    if (status && this.prestations) {
      this.lists = this.prestations.filter((data: any) => data.status === status);
    } else {
      this.lists = this.prestations?.slice(0, 8);
    }
  }

  selectType() {
    const type = (document.getElementById('idType') as HTMLInputElement).value;
    if (type && this.prestations) {
      this.lists = this.prestations.filter((data: any) => data.type === type);
    } else {
      this.lists = this.prestations?.slice(0, 8);
    }
  }

  pageChanged(event: any) {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.lists = this.prestations?.slice(startItem, endItem);
  }
}
