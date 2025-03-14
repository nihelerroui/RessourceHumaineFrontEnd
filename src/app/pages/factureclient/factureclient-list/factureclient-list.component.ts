import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UntypedFormBuilder, FormGroup, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { createFactureClient } from '../../../store/FactureClient/factureclient.actions';
import { selectFactureClients, selectError, selectLoading } from '../../../store/FactureClient/factureclient.selectors';
import { FactureClientService } from '../../../core/services/factureclient.service';
import { fetchFactureClients } from '../../../store/FactureClient/factureclient.actions';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-factureclient-list',
  templateUrl: './factureclient-list.component.html',
  styleUrls: ['./factureclient-list.component.scss'],
})
export class FactureClientListComponent implements OnInit {
  highlightedWords: string[] = ['excellente', 'détaillée', 'cool'];
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
  statutPaiementFilter: string = '';
  statutFactureFilter: string = '';
  typePaiementFilter: string = '';
  selectedPrestationIds: number[] = [];
  selectedConsultantId: number | null = null;
  selectedContratId: number | null = null;
  

  @ViewChild('commentSection') commentSection!: ElementRef;
  
  originalFactures: any[] = []; // Store the original data

  statusFilter: string = '';


  filteredFactures$: Observable<any[]>; // Observable for filtered factures
  scrollToBottom(): void {
    setTimeout(() => {
      this.commentSection.nativeElement.scrollTop = this.commentSection.nativeElement.scrollHeight;
    }, 100); // Timeout ensures it's after the view is fully initialized
  }
  constructor(
    public store: Store,
    private router: Router,
    private modalService: BsModalService,
    private formBuilder: UntypedFormBuilder,
    private factureClientService: FactureClientService,
    private cdRef: ChangeDetectorRef
  ) {
    this.editForm = this.formBuilder.group({
      factureClientId: ['', Validators.required],
      prestationIds: [[], Validators.required],
      consultantId: ['', Validators.required],
      contratId: ['', Validators.required],
      dateEcheance: ['', Validators.required],
      typePaiement: ['', Validators.required],
      pourcentageRemise: [''],
    });
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
  openEditModal(content: any, factureClientId: number): void {
    console.log('Editing facture client:', factureClientId);
    
    // Fetch facture client details based on the ID
    this.factureClientService.getFacturePreview(factureClientId).subscribe((factureClientData) => {
      
      // Ensure the form is patched with the correct values
      this.editForm.patchValue({
        factureClientId: factureClientData.factureClientId,
        prestationIds: factureClientData.prestations.map(p => p.prestationId), // Extract prestation IDs
        consultantId: factureClientData.consultantId,
        contratId: factureClientData.contratClientId,
        dateEcheance: factureClientData.dateEcheance,
        typePaiement: factureClientData.typePaiement,
        pourcentageRemise: factureClientData.pourcentageRemise,
      });
  
      // Select the relevant options for prestations, consultant, and contrat
      this.selectedPrestationIds = factureClientData.prestations.map(p => p.prestationId); // Store selected prestations
      this.selectedConsultantId = factureClientData.consultantId; // Store selected consultant
      this.selectedContratId = factureClientData.contratClientId; // Store selected contrat
      
      // Show the modal
      this.modalRef = this.modalService.show(content, { class: 'modal-lg' });
    });
  }
  

  updateFactureClient() {
    if (this.editForm.valid) {
      const factureClientDTO = {
        factureClientId: this.editForm.value.factureClientId,
        prestationIds: this.editForm.value.prestationIds,
        consultantId: this.editForm.value.consultantId,
        contratId: this.editForm.value.contratId,
        dateEcheance: this.editForm.value.dateEcheance,
        typePaiement: this.editForm.value.typePaiement,
        pourcentageRemise: this.editForm.value.pourcentageRemise || 0
      };
  
      this.factureClientService.updateFactureClient(factureClientDTO.factureClientId, factureClientDTO).subscribe({
        next: () => {
          Swal.fire('Success', 'Facture Client updated!', 'success');
          this.modalRef?.hide();
          this.fetchFactureClients(); // Refresh the list after update
        },
        error: (error) => {
          Swal.fire('Error', error.message, 'error');
        }
      });
    }
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

  highlightText(commentText: string): string {
    const regex = new RegExp(`(${this.highlightedWords.join('|')})`, 'gi');
    return commentText.replace(regex, (match) => `<span class="highlight">${match}</span>`);
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
    if (!this.term) {
      this.fetchFactureClients(); // Reset to original list if search term is empty
      return;
    }
  
    const lowerCaseTerm = this.term.toLowerCase();
    this.factures = this.factures.filter(facture => 
      Object.values(facture).some(value => 
        value && value.toString().toLowerCase().includes(lowerCaseTerm)
    ));
  }
  applyFilters(): void {
    let filteredData = [...this.originalFactures]; // Start with the original data
  
    // Apply search term filter
    if (this.term) {
      const lowerCaseTerm = this.term.toLowerCase();
      filteredData = filteredData.filter(facture => 
        Object.values(facture).some(value => 
          value && value.toString().toLowerCase().includes(lowerCaseTerm)
      ));
    }
  
    // Apply Statut Paiement filter
    if (this.statutPaiementFilter) {
      filteredData = filteredData.filter(facture => 
        facture.statutPaiement === this.statutPaiementFilter
      );
    }
  
    // Apply Statut Facture filter
    if (this.statutFactureFilter) {
      filteredData = filteredData.filter(facture => 
        facture.statutFacture === this.statutFactureFilter
      );
    }
    
    // Apply Type Paiement filter
    if (this.typePaiementFilter) {
      filteredData = filteredData.filter(facture => 
        facture.typePaiement === this.typePaiementFilter
      );
    }
  
    // Update the displayed data
    this.factures = filteredData;
  }
  getRowClass(statutFacture: string): string {
    switch (statutFacture) {
      case 'En_Attente':
        return 'highlight-en-attente';
      case 'Confirmé_Admin':
        return 'highlight-confirme-admin';
      case 'Confirmation_Complet':
        return 'highlight-confirmation-complet';
      case 'Rejete':
        return 'highlight-rejete';
      default:
        return ''; // No highlight for unknown states
    }
  }

  resetFilters(): void {
    this.term = '';
    this.statutPaiementFilter = '';
    this.statutFactureFilter = '';
    this.typePaiementFilter = '';
    this.applyFilters(); // Reapply filters (which will reset to the original data)
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
        this.originalFactures = data; // Store the original data
        this.factures = data; // Initialize the displayed data
        this.applyFilters(); // Apply filters after fetching
        this.cdRef.detectChanges(); // Ensure change detection is triggered
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
  openCommentModal(facture: any, template: any): void {
    // Open the modal, passing the template reference
    this.modalRef = this.modalService.show(template);
  }
  viewDetails(factureClientId: number): void {
    // Navigate to the route defined as factureclient/:id
    this.router.navigate(['/facture/client/details', factureClientId]);
  }
}
