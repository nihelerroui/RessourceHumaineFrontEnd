import { Component, OnInit, TemplateRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormGroup, FormBuilder } from '@angular/forms';
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
  currentPage: number = 1;
  itemsPerPage: number = 8;
  modalRef?: BsModalRef;
  selectedDepense!: Depense | null;
  lists: Depense[] = [];
  depenses: Depense[] = [];
  depensesFiltrees: Depense[] = [];
  term: string = '';
  moisSelectionne: string = '';
  montantMin: number = 0;
  montantMax: number = 1000000;


  loading$!: Observable<boolean>;
  error$!: Observable<any>;

  listeMois: string[] = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  constructor(
    private store: Store,
    private modalService: BsModalService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Dépenses', path: '/' },
      { label: 'Liste des Dépenses', active: true }
    ];


    this.loading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);

    this.store.dispatch(fetchDepenseData());

    this.store.select(selectData).subscribe(data => {
      this.depenses = data;
      this.depensesFiltrees = data;
      this.lists = data.slice(0, this.itemsPerPage);
    });
  }


  openDetailsModal(depense: Depense, template: TemplateRef<any>) {
    this.selectedDepense = depense;
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }
  

  filtrerDepenses(): void {
    const terme = this.term?.toLowerCase() || '';
  
    this.depensesFiltrees = this.depenses.filter(d =>
      (!this.moisSelectionne || d.mois?.toLowerCase() === this.moisSelectionne.toLowerCase()) &&
      (!this.montantMin || +d.montant >= +this.montantMin) &&
      (!this.montantMax || +d.montant <= +this.montantMax) &&
      (
        !terme ||
        d.designation?.toLowerCase().includes(terme) ||
        d.motif?.toLowerCase().includes(terme)
      )
    );
  
    this.pageChanged({ page: 1 });
  }
  


  pageChanged(event: any): void {
    this.currentPage = event.page;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.lists = this.depensesFiltrees.slice(startIndex, startIndex + this.itemsPerPage);
  }
  
}