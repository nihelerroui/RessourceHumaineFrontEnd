import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { selectFactureClients, selectError, selectLoading } from '../../../store/FactureClient/factureclient.selectors';
import { FactureClientService } from '../../../core/services/factureclient.service';

@Component({
  selector: 'app-clientsidefacture',
  templateUrl: './clientsidefacture.component.html',
  styleUrls: ['./clientsidefacture.component.scss'],
})
export class ClientViewFactureComponent implements OnInit {
  highlightedWords: string[] = ['excellente', 'détaillée', 'cool'];
  page: any = 1;
  term: any;
  searchTerm: any;
  searchResults: any;
  modalRef?: BsModalRef;
  factureClientForm!: FormGroup;
  submitted: boolean = false;
  isEditMode: boolean = false;
  lists?: any[] = [];
  factureClients$: Observable<any[]>;  
  selectedDate?: Date;
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);
  bsConfig: Partial<BsDatepickerConfig>;
  breadCrumbItems: Array<{}>;
  factures: any[] = [];  
  statutPaiementFilter: string = '';
  statutFactureFilter: string = '';
  typePaiementFilter: string = '';
  selectedPrestationIds: number[] = [];
  selectedConsultantId: number | null = null;
  selectedContratId: number | null = null;
  clientId: number | null = null;  // Store clientId

  @ViewChild('commentSection') commentSection!: ElementRef;
  
  originalFactures: any[] = []; 
  statusFilter: string = '';

  constructor(
    public store: Store,
    private router: Router,
    private route: ActivatedRoute,  // ActivatedRoute to capture route params
    private modalService: BsModalService,
    private formBuilder: UntypedFormBuilder,
    private factureClientService: FactureClientService,
    private cdRef: ChangeDetectorRef
  ) {
    this.breadCrumbItems = [{ label: 'Factures Clients' }, { label: 'Factures Clients View', active: true }];
    this.bsConfig = {
      showWeekNumbers: false,
      dateInputFormat: 'DD/MM/YYYY',
    };

    this.factureClients$ = this.store.select(selectFactureClients);
  }
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.clientId = +params.get('id')!;
      console.log('id:', this.clientId);
      if (this.clientId) {
        this.fetchFactureClients();
      }
    });
  
    this.loading$.subscribe(loading => console.log('Loading state:', loading));
    this.error$.subscribe(error => { if (error) console.error('Store error:', error) });
  
    this.factureClients$.subscribe(data => {
      console.log('Store data received:', data);
      if (data && data.length) {
        this.originalFactures = data;
        this.factures = [...data];  // Clone data to preserve the original
        this.applyFilters();  // Apply filters on initial load
      }
    });
  }

  searchFactureClient(): void {
    if (!this.term) {
      this.fetchFactureClients();
      return;
    }
  
    const lowerCaseTerm = this.term.toLowerCase();
    this.factures = this.factures.filter(facture => 
      Object.values(facture).some(value => 
        value && value.toString().toLowerCase().includes(lowerCaseTerm)
    ));
  }
  applyFilters(): void {
    let filteredData = [...this.originalFactures];
  
    if (this.term) {
      const lowerCaseTerm = this.term.toLowerCase();
      filteredData = filteredData.filter(facture => 
        Object.values(facture).some(value => 
          value && value.toString().toLowerCase().includes(lowerCaseTerm)
      ));
    }
  
    if (this.statutPaiementFilter) {
      filteredData = filteredData.filter(facture => 
        facture.statutPaiement === this.statutPaiementFilter
      );
    }
  
    if (this.statutFactureFilter) {
      filteredData = filteredData.filter(facture => 
        facture.statutFacture === this.statutFactureFilter
      );
    }
   
    if (this.typePaiementFilter) {
      filteredData = filteredData.filter(facture => 
        facture.typePaiement === this.typePaiementFilter
      );
    }
  
    // Update factures and trigger change detection
    this.factures = filteredData;
    this.cdRef.detectChanges();  // Ensure changes are reflected in the view
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
        return '';
    }
  }

  resetFilters(): void {
    this.term = '';
    this.statutPaiementFilter = '';
    this.statutFactureFilter = '';
    this.typePaiementFilter = '';
    this.applyFilters();
  }

  fetchFactureClients(): void {
    if (this.clientId) {
      this.factureClientService.getFacturesByClientId(this.clientId).subscribe({
        next: (data) => {
          console.log('Fetched facture clients:', data);
          this.originalFactures = data;
          this.factures = [...data];  // Ensure the original data is copied
          this.applyFilters();  // Apply filters after data is fetched
          this.cdRef.detectChanges();
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
  }
  pageChanged(event: any) {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    
    this.factureClients$.subscribe((data) => {
      this.lists = data.slice(startItem, endItem);
    });
  }

  openCommentModal(facture: any, template: any): void {
    this.modalRef = this.modalService.show(template);
  }

  viewDetails(factureClientId: number): void {
    this.router.navigate(['/facture/client/details', factureClientId]);
  }
}
