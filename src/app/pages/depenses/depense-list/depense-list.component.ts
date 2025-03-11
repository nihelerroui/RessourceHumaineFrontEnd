import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Observable } from 'rxjs';

import { fetchDepenseData, deleteDepense } from '../../../store/Depense/depense.actions';
import { selectData, selectError, selectLoading } from '../../../store/Depense/depense.selectors';
import { DepenseService } from '../../../core/services/depense.service';

@Component({
  selector: 'app-depense-list',
  templateUrl: './depense-list.component.html',
  styleUrls: ['./depense-list.component.scss'],
})
export class DepenseListComponent implements OnInit {
  // Pagination and variables
  page: any = 1;
  term: any;
  searchTerm: any;
  searchResults: any;
  modalRef?: BsModalRef;
  depenseForm!: UntypedFormGroup;
  submitted: boolean = false;
  isEditMode: boolean = false;
  createForm: FormGroup;
  editForm: FormGroup;
  lists?: any[] = [];
  depenses?: any[] = [];
  selectedDate?: Date;
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);
  bsConfig: Partial<BsDatepickerConfig>;
  breadCrumbItems: Array<{}>;
  depenseDetailsForm: FormGroup;
  societes: any[] = []; // Store societies
  factures: any[] = [];

  constructor(
    public store: Store,
    private modalService: BsModalService,
    private formBuilder: UntypedFormBuilder,
    private depenseService: DepenseService
  ) {
    this.breadCrumbItems = [{ label: 'Depenses' }, { label: 'Depenses List', active: true }];
    this.bsConfig = {
      showWeekNumbers: false,
      dateInputFormat: 'DD/MM/YYYY',
    };
  }

  ngOnInit(): void {
    // Initialize forms
    this.depenseForm = this.formBuilder.group({
      mois: ['', [Validators.required]],
      type: ['', [Validators.required]],
      montant: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      motif: ['', [Validators.required]],
    });

    this.loading$.subscribe((loading) => console.log('Loading state:', loading));
    this.error$.subscribe((error) => { if (error) console.error('Store error:', error); });

    this.fetchDepenses();

    this.createForm = this.formBuilder.group({
      mois: ['', Validators.required], // Select (1-12)
      type: ['', Validators.required], // Input (text)
      montant: ['', [Validators.required, Validators.pattern(/^\d+$/)]], // Input (number)
      designation: ['', Validators.required], // Input (text)
      motif: ['', Validators.required], // Input (text)
      societeId: ['', Validators.required], // Select (societeId)
    });

    this.editForm = this.formBuilder.group({
      depenseId: ['', Validators.required],
      mois: ['', Validators.required],
      type: ['', Validators.required],
      montant: ['', Validators.required],
      designation: ['', Validators.required],
      motif: ['', Validators.required],
      societeId: ['', Validators.required], // Added societe selection
    });

    this.depenseDetailsForm = this.formBuilder.group({
      mois: ['', Validators.required],
      type: ['', Validators.required],
      montant: ['', Validators.required],
      designation: ['', Validators.required],
      motif: ['', Validators.required],
    });

    this.fetchSocietes();
    //this.fetchUnassignedFactures();

    // Dispatch action to fetch depense data
    this.store.dispatch(fetchDepenseData());

    // Subscribe to store data
    this.store.select(selectData).subscribe({
      next: (data) => {
        console.log('Store data received:', data);
        this.depenses = data;
        this.lists = data?.slice(0, 8);
      },
      error: (error) => console.error('Store subscription error:', error),
    });

    this.loading$.subscribe((loading) => console.log('Loading state:', loading));
    this.error$.subscribe((error) => { if (error) console.error('Store error:', error); });
  }

  // Open create modal
  openCreateModal(content: any): void {
    this.createForm.reset();
    this.modalRef = this.modalService.show(content, { class: 'modal-md' });
  }

  fetchDepenses(): void {
    this.depenseService.getAll().subscribe({
      next: (data) => {
        console.log('Fetched depenses:', data);
        this.depenses = data;
        this.lists = data?.slice(0, 8);
      },
      error: (error) => {
        console.error('Error fetching depenses:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error fetching depenses',
          text: error.message,
        });
      },
    });
  }

  fetchSocietes(): void {
    this.depenseService.getSocietes().subscribe({
      next: (data) => {
        this.societes = data;
      },
      error: (error) => console.error('Error fetching societes:', error),
    });
  }

  fetchUnassignedFactures(): void {
    this.depenseService.getUnassignedFactures().subscribe({
      next: (data) => {
        this.factures = data;
      },
      error: (error) => {
        console.error('Error fetching unassigned factures:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error fetching factures',
          text: error.message,
        });
      },
    });
  }

  // Save new depense
  saveDepense() {
    if (this.createForm.valid) {
      const depenseDTO = {
        ...this.createForm.value,
        societe: { societeId: this.createForm.value.societeId },
      };

      // Use the `create` method from GenericService
      this.depenseService.create(depenseDTO).subscribe({
        next: () => {
          Swal.fire('Success', 'Depense created!', 'success');
          this.modalRef?.hide();
          this.fetchDepenses(); // Refresh list
        },
        error: (error) => Swal.fire('Error', error.message, 'error'),
      });
    }
  }

  // Open edit modal
  editDataGet(id: any, content: any): void {
    const depense = this.depenses.find((d) => d.depenseId === id);
    if (depense) {
      this.editForm.patchValue({
        depenseId: depense.depenseId,
        mois: depense.mois,
        type: depense.type,
        montant: depense.montant,
        designation: depense.designation,
        motif: depense.motif,
        societeId: depense.societe ? depense.societe.societeId : '', // patch current societe
      });
      this.modalRef = this.modalService.show(content, { class: 'modal-md' });
    }
  }

  // Update depense
  updateDepense() {
    if (this.editForm.valid) {
      const updatedDepense = {
        ...this.editForm.value,
        depenseId: this.editForm.value.depenseId, // Ensure ID is included in body
        societe: { societeId: this.editForm.value.societeId },
      };

      // Use the service with dummy ID (not actually used)
      this.depenseService.update(updatedDepense).subscribe({
        next: () => {
          Swal.fire('Success', 'Depense updated!', 'success');
          this.modalRef?.hide();
          this.fetchDepenses();
        },
        error: (error) => {
          Swal.fire('Error', error.message, 'error');
          console.error('Update error:', error);
        }
      });
    }
  }

  // View depense details
  viewDetails(id: any, content: any) {
    console.log('Viewing depense details:', id);
    this.depenseService.getDepenseDetails(id).subscribe({
      next: (response: any) => {
        console.log('Depense Details:', response);
        this.depenseDetailsForm.patchValue({
          mois: response.mois,
          type: response.type,
          montant: response.montant,
          designation: response.designation,
          motif: response.motif,
        });
        this.modalRef = this.modalService.show(content, { class: 'modal-md' });
      },
      error: (error) => {
        console.error('Error fetching depense details:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error fetching depense details',
          text: error.message,
        });
      },
    });
  }

  // Delete depense
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
          this.store.dispatch(deleteDepense({ id }));
          swalWithBootstrapButtons.fire('Deleted!', 'Your depense has been deleted.', 'success');
          event.target.closest('tr')?.remove();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire('Cancelled', 'Your depense is safe :)', 'error');
        }
      });
  }

  // Search depense
  searchDepense() {
    if (this.term && this.depenses) {
      this.lists = this.depenses.filter((data: any) => {
        return (
          data.mois.toLowerCase().includes(this.term.toLowerCase()) ||
          data.type.toLowerCase().includes(this.term.toLowerCase()) ||
          data.designation.toLowerCase().includes(this.term.toLowerCase())
        );
      });
    } else {
      this.lists = this.depenses?.slice(0, 8);
    }
  }

  // Pagination
  pageChanged(event: any) {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.lists = this.depenses?.slice(startItem, endItem);
  }
}