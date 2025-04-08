import { Component, OnInit, TemplateRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Observable } from 'rxjs';

import { fetchDepenseData } from '../../../store/Depense/depense.actions';
import { selectData, selectError, selectLoading } from '../../../store/Depense/depense.selectors';
import { DepenseService } from 'src/app/core/services/depense.service';
import { Depense } from 'src/app/models/depense.model';

@Component({
  selector: 'app-depense-list',
  templateUrl: './depense-list.component.html',
  styleUrls: ['./depense-list.component.scss'],
})
export class DepenseListComponent implements OnInit {
  breadCrumbItems!: Array<{ label: string; path?: string; active?: boolean }>;
  moisSelectionne: string = '';
  montantMin: number = 0;
  montantMax: number = 1000000; 
  listeMois: string[] = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  depensesFiltrees: Depense[] = [];

  // Pagination and variables
  page: any = 1;
  term: any;
  searchTerm: any;
  searchResults: any;
  modalRef?: BsModalRef;
  submitted: boolean = false;
  lists?: any[] = [];
  depenses?: any[] = [];
  selectedDate?: Date;
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);
  bsConfig: Partial<BsDatepickerConfig>;
  depenseDetailsForm: FormGroup;
  societes: any[] = []; // Store societies
  factures: any[] = [];

  constructor(
    public store: Store,
    private modalService: BsModalService,
    private formBuilder: UntypedFormBuilder,
    private depenseService: DepenseService
  ) {
    this.bsConfig = {
      showWeekNumbers: false,
      dateInputFormat: 'DD/MM/YYYY',
    };
  }

  ngOnInit(): void {

    this.breadCrumbItems = [
      { label: 'Depenses', path: '/' },
      { label: 'Liste des Depenses', active: true }
    ];

    this.loading$.subscribe((loading) => console.log('Loading state:', loading));
    this.error$.subscribe((error) => { if (error) console.error('Store error:', error); });

    this.fetchDepenses();

    this.depenseDetailsForm = this.formBuilder.group({
      mois: ['', Validators.required],
      type: ['', Validators.required],
      montant: ['', Validators.required],
      designation: ['', Validators.required],
      motif: ['', Validators.required],
    });

    this.fetchSocietes();

    // Dispatch action to fetch depense data
    this.store.dispatch(fetchDepenseData());

    // Subscribe to store data
    this.store.select(selectData).subscribe({
      next: (data) => {
        console.log('Store data received:', data);
        this.depensesFiltrees = data;;
        this.lists = data?.slice(0, 8);
      },
      error: (error) => console.error('Store subscription error:', error),
    });

    this.loading$.subscribe((loading) => console.log('Loading state:', loading));
    this.error$.subscribe((error) => { if (error) console.error('Store error:', error); });
  }



  fetchDepenses(): void {
    this.store.dispatch(fetchDepenseData());
    this.store.select(selectData).subscribe(depenses => {
      this.depenses = depenses;
      this.pageChanged({ page: 1 });
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

  // View depense details
  viewDetails(id: any, content: TemplateRef<any>) {
    if (!content) {
      console.error('Le template du modal est manquant.');
      return;
    }
  
    this.depenseService.getDepenseDetails(id).subscribe({
      next: (response: any) => {
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
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: error.message,
        });
      }
    });
  }

  openDetailsModal(depense: Depense, template: TemplateRef<any>) {
    this.depenseDetailsForm.patchValue(depense);
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }
  


  // Search depense
  filtrerDepenses() {
    const terme = this.term?.toLowerCase() || '';

    const filtered = this.depenses?.filter(d =>
      (!this.moisSelectionne || d.mois?.toLowerCase() === this.moisSelectionne.toLowerCase()) &&
      (!this.montantMin || d.montant >= this.montantMin) &&
      (!this.montantMax || d.montant <= this.montantMax) &&
      (
        !terme ||
        d.designation?.toLowerCase().includes(terme) ||
        d.motif?.toLowerCase().includes(terme)
      )
    );

    // Mise à jour de la liste affichée (avec pagination page 1)
    this.depensesFiltrees = filtered;
    this.lists = filtered?.slice(0, 8);
    this.page = 1;
  }

  // Pagination
  pageChanged(event: any) {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.lists = this.depensesFiltrees?.slice(startItem, endItem); // ← change ici
  }
 
  
  
}