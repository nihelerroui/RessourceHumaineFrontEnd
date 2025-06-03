import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { loadChiffreAffaire } from '../../../store/ChiffreAffaire/ChiffreAffaire.actions';
import { selectHistorique } from '../../../store/ChiffreAffaire/ChiffreAffaire.selectors';
import { HistoriqueChiffreAffaire } from '../../../models/HistoriqueChiffreAffaire.model';

@Component({
  selector: 'app-chiffre-affaire',
  templateUrl: './historiquechiffreaffaire.component.html'
})
export class HistoriqueChiffreAffaireComponent implements OnInit {
  historique$: Observable<HistoriqueChiffreAffaire[]>;
  filteredHistorique: HistoriqueChiffreAffaire[] = [];
  selectedClient: string = '';
  selectedYear: string = '';
  uniqueClients: string[] = [];
  uniqueYears: string[] = [];
  totalCA: number = 0;
  totalPayees: number = 0;
  totalNonPayees: number = 0;

  barChart: any = {
    series: [],
    chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      }
    },
    dataLabels: {
      enabled: true
    },
    xaxis: {
      categories: []
    },
    colors: ['#3b82f6'],
    tooltip: {
      y: {
        formatter: (val: number) => `${val.toLocaleString()} EUR`
      }
    }
  };

  constructor(private store: Store) {
    this.historique$ = this.store.select(selectHistorique);
  }

  ngOnInit(): void {
    this.loadHistorique();
    this.historique$.pipe(take(1)).subscribe((data) => {
      this.filteredHistorique = data;
      this.extractUniqueClientsAndYears(data);
      this.calculateTotals(data);
      this.updateBarChart();
    });
  }

  loadHistorique(): void {
    this.store.dispatch(loadChiffreAffaire());
  }

  filterHistorique(): void {
    this.historique$.pipe(take(1)).subscribe((data) => {
      this.filteredHistorique = data.filter(item => {
        const matchesClient = this.selectedClient ? item.client.nom === this.selectedClient : true;
        const matchesYear = this.selectedYear ? item.annee === this.selectedYear : true;
        return matchesClient && matchesYear;
      });
      this.calculateTotals(this.filteredHistorique);
      this.updateBarChart();
    });
  }

  resetFilters(): void {
    this.selectedClient = '';
    this.selectedYear = '';
    this.loadHistorique();
    this.filterHistorique();
  }

  extractUniqueClientsAndYears(data: HistoriqueChiffreAffaire[]): void {
    this.uniqueClients = [...new Set(data.map(item => item.client.nom))];
    this.uniqueYears = [...new Set(data.map(item => item.annee))];
  }

  calculateTotals(data: HistoriqueChiffreAffaire[]): void {
    this.totalCA = data.reduce((acc, item) => acc + item.montant, 0);
    this.totalPayees = data
      .filter(item => item.montant > 0)
      .reduce((acc, item) => acc + item.montant, 0);
    this.totalNonPayees = this.totalCA - this.totalPayees;
  }

  updateBarChart(): void {
    const clientNames = this.filteredHistorique.map(item => item.client.nom);
    const clientMontants = this.filteredHistorique.map(item => item.montant);

    this.barChart = {
      ...this.barChart,
      series: [{
        name: 'Chiffre d\'Affaire',
        data: clientMontants
      }],
      xaxis: {
        categories: clientNames
      }
    };
  }
}
