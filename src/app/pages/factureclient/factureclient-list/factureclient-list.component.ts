import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { createFactureClient } from '../../../store/FactureClient/factureclient.actions';
import { selectFactureClients, selectError, selectLoading } from '../../../store/FactureClient/factureclient.selectors';
import { FactureClientService } from '../../../core/services/factureclient.service';
import { fetchFactureClients } from '../../../store/FactureClient/factureclient.actions';

@Component({
  selector: 'app-factureclient-list',
  templateUrl: './factureclient-list.component.html',
  styleUrls: ['./factureclient-list.component.scss'],
})
export class FactureClientListComponent implements OnInit {
  // Pagination and variables
  page: any = 1;
  term: any;
  searchTerm: any;
  searchResults: any;
  modalRef?: BsModalRef;
  factureClientForm!: FormGroup;
  submitted: boolean = false;
  isEditMode: boolean = false;
  createForm: FormGroup;
  editForm: FormGroup;
  lists?: any[] = [];
  factureClients$: Observable<any[]>;  // Using observable for async data fetching
  selectedDate?: Date;
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);
  bsConfig: Partial<BsDatepickerConfig>;
  breadCrumbItems: Array<{}>;
  factureClientDetailsForm: FormGroup;
  prestations: any[] = []; // Store prestations
  consultants: any[] = []; // Store consultants
  contratsClient: any[] = []; // Store contratsClient
  factures: any[] = [];  // Define the factures array

  constructor(
    public store: Store,
    private router: Router,
    private modalService: BsModalService,
    private formBuilder: UntypedFormBuilder,
    private factureClientService: FactureClientService,
    private cdRef: ChangeDetectorRef  // Add this
  ) {
    this.breadCrumbItems = [{ label: 'Factures Clients' }, { label: 'Factures Clients List', active: true }];
    this.bsConfig = {
      showWeekNumbers: false,
      dateInputFormat: 'DD/MM/YYYY',
    };

    // Initialize FactureClients observable for async data fetching
    this.factureClients$ = this.store.select(selectFactureClients);
  }

  ngOnInit(): void {
    
    console.log('Facture Clients:', this.factureClients$);
    this.factureClients$.subscribe({
      next: (data) => {
        console.log('Fetched data:', data);
        this.factures = data;  // Set the factures array here
      },
      error: (error) => console.error('Error fetching factures:', error),
    });
    // Initialize forms
    this.createForm = this.formBuilder.group({
      prestationIds: [[], Validators.required], // Array of prestation IDs (e.g., [2])
      consultantId: ['', Validators.required], // ID of the consultant (e.g., 2)
      contratId: ['', Validators.required], // ID of the contrat (e.g., 1)
      dateEcheance: ['', Validators.required], // Due date for the invoice (e.g., "2025-12-31")
      typePaiement: ['', Validators.required], // Type of payment (e.g., "CHEQUE")
      pourcentageRemise: [''] // Optional discount percentage (e.g., 10.0)
    });

    this.editForm = this.formBuilder.group({
      factureClientId: ['', Validators.required],
      prestationIds: [[], Validators.required],
      consultantId: ['', Validators.required],
      contratId: ['', Validators.required],
      dateEcheance: ['', Validators.required],
      typePaiement: ['', Validators.required],
      pourcentageRemise: ['']
    });

    this.factureClientDetailsForm = this.formBuilder.group({
      prestationIds: [[], Validators.required],
      consultantId: ['', Validators.required],
      contratId: ['', Validators.required],
      dateEcheance: ['', Validators.required],
      typePaiement: ['', Validators.required],
      pourcentageRemise: ['']
    });

    // Fetch the data once component initializes
    this.store.dispatch(createFactureClient({ factureClientData: {} }));  // For testing purpose

    this.loading$.subscribe((loading) => console.log('Loading state:', loading));
    this.error$.subscribe((error) => { if (error) console.error('Store error:', error); });

    // Subscribe to store data
    this.factureClients$.subscribe({
      next: (data) => {
        console.log('Store data received:', data);
        this.lists = data?.slice(0, 8);
      },
      error: (error) => console.error('Store subscription error:', error),
    });

    // Fetch all options needed for creating facture
    this.fetchPrestations();
    this.fetchConsultants();
    this.fetchContratsClient();
    this.fetchFactureClients();
  }

  // Open create modal
  openCreateModal(content: any): void {
    this.createForm.reset();
    this.modalRef = this.modalService.show(content, { class: 'modal-md' });
  }

  // Save new factureClient
  saveFactureClient() {
    if (this.createForm.valid) {
      const factureClientDTO = {
        prestationIds: this.createForm.value.prestationIds,  // Array of prestation IDs
        consultantId: this.createForm.value.consultantId,    // Consultant ID
        contratId: this.createForm.value.contratId,          // Contrat ID
        dateEcheance: this.createForm.value.dateEcheance,    // Due date (formatted as yyyy-MM-dd)
        typePaiement: this.createForm.value.typePaiement,    // Payment type (enum)
        pourcentageRemise: this.createForm.value.pourcentageRemise || 0, // Discount percentage (optional)
      };

      // Use the `create` method from FactureClientService
      this.factureClientService.createFactureClient(factureClientDTO).subscribe({
        next: () => {
          Swal.fire('Success', 'Facture Client created!', 'success');
          this.modalRef?.hide();
          this.fetchFactureClients(); // Refresh list
        },
        error: (error) => Swal.fire('Error', error.message, 'error'),
      });
    }
  }

  

  // Fetch all prestations
  fetchPrestations(): void {
    this.factureClientService.getPrestations().subscribe({
      next: (data) => {
        this.prestations = data;
      },
      error: (error) => console.error('Error fetching prestations:', error),
    });
  }

  // Fetch all consultants
  fetchConsultants(): void {
    this.factureClientService.getConsultants().subscribe({
      next: (data) => {
        this.consultants = data;
      },
      error: (error) => console.error('Error fetching consultants:', error),
    });
  }
  searchFactureClient(): void {
    // Implement search logic here
    console.log('Searching for:', this.term);
  }

  // Fetch all contratsClient
  fetchContratsClient(): void {
    this.factureClientService.getContratsClient().subscribe({
      next: (data) => {
        this.contratsClient = data;
      },
      error: (error) => console.error('Error fetching contratsClient:', error),
    });
  }

  // Fetch Facture Clients
  fetchFactureClients(): void {
    this.factureClientService.getAll().subscribe({
      next: (data) => {
        console.log('Fetched facture clients:', data);
        this.factures = data?.slice(0, 8);  // Set this directly to factures
        this.cdRef.detectChanges();  // Ensure change detection is triggered
      },
      error: (error) => {
        console.error('Error fetching facture clients:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error fetching facture clients',
          text: error.message,
        });
      },
    });
  }

  // Pagination
  pageChanged(event: any) {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    
    // Subscribe to the observable and slice the data
    this.factureClients$.subscribe((data) => {
      this.lists = data.slice(startItem, endItem);
    });
  }


  deleteFacture(factureClientId: number): void {
    // Ask for confirmation before deleting
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        // Call the delete service
        this.factureClientService.delete(factureClientId.toString()).subscribe({
          next: () => {
            // On success, show a success message
            Swal.fire('Deleted!', 'The facture has been deleted.', 'success');
            // Update the list of factures
            this.fetchFactureClients();  // Refresh the list after deletion
          },
          error: (error) => {
            // On error, show an error message
            Swal.fire('Error!', 'There was an error deleting the facture.', 'error');
            console.error('Error deleting facture:', error);
          },
        });
      }
    });
  }
  viewDetails(factureClientId: number): void {
    // Navigate to the route defined as factureclient/:id
    this.router.navigate(['/facture/client/details', factureClientId]);
  }
}
