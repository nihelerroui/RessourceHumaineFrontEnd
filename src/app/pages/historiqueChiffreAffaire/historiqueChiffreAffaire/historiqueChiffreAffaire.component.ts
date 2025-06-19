import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable, tap } from 'rxjs';
import { HistoriqueChiffreAffaire } from 'src/app/models/HistoriqueChiffreAffaire.model';
import * as ChiffreAffaireActions from 'src/app/store/ChiffreAffaire/ChiffreAffaire.actions';
import * as fromSelectors from 'src/app/store/ChiffreAffaire/ChiffreAffaire.selectors';

import { ApexAxisChartSeries } from 'ng-apexcharts';
import { selectAllSocietes } from 'src/app/store/Authentication/authentication-selector';
import * as AuthActions from 'src/app/store/Authentication/authentication.actions';

@Component({
  selector: 'app-chiffre-affaire',
  templateUrl: './historiqueChiffreAffaire.component.html',
})
export class HistoriqueChiffreAffaireComponent implements OnInit {
  historique$: Observable<HistoriqueChiffreAffaire[]> = this.store.select(fromSelectors.selectAllChiffres);
  adminSocietes$: Observable<any[]> = this.store.select(selectAllSocietes);
  originalHistorique: HistoriqueChiffreAffaire[] = [];
  filteredChiffre: HistoriqueChiffreAffaire[] = [];
  paginatedChiffre: HistoriqueChiffreAffaire[] = [];

  selectedYear: string = '';
  selectedSocieteId: number | '' = '';
  consultantSocieteId: number = 0;

  page = 1;
  ChiffreAffaireParPage = 5;
  anneesDisponibles: string[] = [];

  role : string ="";

  apexChartSeries: ApexAxisChartSeries = [];
  apexChartOptions = {
    chart: { type: 'bar', height: 350 },
    xaxis: { categories: [] },
    title: { text: "Chiffre d'Affaire par Société" },
    plotOptions: { bar: { horizontal: false } },
    dataLabels: { enabled: false }
  };

  constructor(private store: Store) { }

  ngOnInit(): void {
    const user = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    this.consultantSocieteId = user?.societe?.societeId;
    this.selectedSocieteId = this.consultantSocieteId;
    this.role = user?.role;

    this.store.dispatch(ChiffreAffaireActions.loadChiffreAffaire());
    this.store.dispatch(AuthActions.loadAdminSocietes());

    this.historique$.subscribe(data => {
      if (!data || data.length === 0) return;

      this.originalHistorique = data;
      this.anneesDisponibles = [...new Set(data.map(h => h.annee))];
      this.filterChiffreAffaire();
    });
  }

  filterChiffreAffaire(): void {
    this.filteredChiffre = this.originalHistorique.filter(item =>
      (!this.selectedYear || item.annee === this.selectedYear) &&
      (!this.selectedSocieteId || item.client?.societe?.societeId === +this.selectedSocieteId)
    );

    this.pageChanged({ page: 1 });
    this.updateChart(this.filteredChiffre);
  }

  resetFilters(): void {
    this.selectedYear = '';
    this.selectedSocieteId = this.consultantSocieteId;
    this.filterChiffreAffaire();
  }

  pageChanged(event: any): void {
    this.page = event.page;
    const start = (this.page - 1) * this.ChiffreAffaireParPage;
    this.paginatedChiffre = this.filteredChiffre.slice(start, start + this.ChiffreAffaireParPage);
    this.loadMontantsParClient();
  }

  loadMontantsParClient(): void {
    this.paginatedChiffre.forEach(chiffre => {
      const clientId = chiffre.client.clientId;

      this.store.dispatch(ChiffreAffaireActions.loadTotalFactures({ clientId }));
      this.store.dispatch(ChiffreAffaireActions.loadTotalFacturesPayees({ clientId }));
    });
  }


  getMontantPaye(clientId: number): Observable<number> {
    return this.store.select(fromSelectors.selectTotalPayeesByClient(clientId)).pipe(
      tap(value => console.log('Montant payé pour le client', clientId, ':', value))
    );
  }

  getMontantTotal(clientId: number): Observable<number> {
    return this.store.select(fromSelectors.selectTotalByClient(clientId));
  }

  getMontantNonPaye$(clientId: number, montantTotal: number): Observable<number> {
  return this.getMontantPaye(clientId).pipe(
    map(montantPaye => montantTotal - montantPaye)
  );
}

  getTauxPaiement(chiffre: HistoriqueChiffreAffaire): number {
    const clientId = chiffre.client.clientId;
    const payé = this.getMontantSync(this.store.select(fromSelectors.selectTotalPayeesByClient(clientId)));
    return chiffre.montant > 0 ? payé / chiffre.montant : 0;
  }

  private getMontantSync(obs$: Observable<number>): number {
    let value = 0;
    obs$.subscribe(v => value = v).unsubscribe();
    return value;
  }

  updateChart(data: HistoriqueChiffreAffaire[]): void {
  const grouped = new Map<string, number>();

  data.forEach(item => {
    const societeName = item.client?.societe?.nom || 'Inconnu';
    const label = `${item.annee} - ${societeName}`;
    const current = grouped.get(label) || 0;
    grouped.set(label, current + item.montant);
  });

  this.apexChartSeries = [{
    name: 'Chiffre d\'Affaire',
    data: Array.from(grouped.values())
  }];

  this.apexChartOptions = {
    ...this.apexChartOptions,
    xaxis: {
      categories: Array.from(grouped.keys())
    }
  };
}

}