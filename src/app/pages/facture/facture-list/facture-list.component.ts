import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { fetchFactureById } from '../../../store/Facture/facture.actions';
import { selectFacture, selectLoading, selectError } from '../../../store/Facture/facture.selectors';
import { Tooltip } from 'bootstrap';


@Component({
  selector: 'app-facture-list',
  templateUrl: './facture-list.component.html',
  styleUrls: ['./facture-list.component.scss']
})
export class FactureListComponent implements OnInit, OnDestroy {
  facture$ = this.store.select(selectFacture);
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);

  // Breadcrumb items
  breadCrumbItems: Array<{}> = [
    { label: 'Factures' },
    { label: 'Detail', active: true }
  ];

  constructor(
    private store: Store,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    console.log('Facture ID:', id);
    this.store.dispatch(fetchFactureById({ id }));
    Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    .forEach(tooltipNode => new Tooltip(tooltipNode));
  }

  ngOnDestroy() {
    // Clean up if needed
  }
}