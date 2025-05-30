import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import * as ChiffreActions from '../../../store/ChiffreAffaire/ChiffreAffaire.actions';
import * as ChiffreSelectors from '../../../store/ChiffreAffaire/ChiffreAffaire.selectors';
import { HistoriqueChiffreAffaire } from '../../../models/HistoriqueChiffreAffaire.model';
import * as FactureAction from 'src/app/store/FactureClient/factureclient.actions';
import { FactureClient } from 'src/app/models/factureClient.models';
import { selectFactureClients } from 'src/app/store/FactureClient/factureclient.selector';
import { Client } from 'src/app/models/client.model';
import { selectClientList } from 'src/app/store/client/client.selectors';
import { loadClients, loadClientsBySocieteAdmin } from 'src/app/store/client/client.actions';

@Component({
  selector: 'app-chiffre-affaire',
  templateUrl: './chiffreaffaire-list.component.html'
})
export class ChiffreAffaireComponent implements OnInit {
  clients$: Observable<Client[]>;
  historique$: Observable<HistoriqueChiffreAffaire[]>;
  totalFactures$: Observable<number>;
  totalFacturesPayees$: Observable<number>;
  loading$: Observable<boolean>;

  selectedClient: string = '';
  montantTotal: number = 0;
  montantTotalPayees: number = 0;
  montantTotalNonPayees: number = 0;
  factures$: Observable<FactureClient[]>;
  filteredFactures: FactureClient[] = [];

  constructor(private store: Store) {
    this.historique$ = this.store.select(ChiffreSelectors.selectHistorique);
    this.totalFactures$ = this.store.select(ChiffreSelectors.selectTotalFactures);
    this.totalFacturesPayees$ = this.store.select(ChiffreSelectors.selectTotalFacturesPayees);
    this.loading$ = this.store.select(ChiffreSelectors.selectLoading);
    this.factures$ = this.store.select(selectFactureClients);
    this.clients$ = this.store.select(selectClientList);
  }

  ngOnInit(): void {
    this.loadFactures();
    this.loadClients();
    this.loadChiffreAffaire();
  }

  loadFactures(): void {
    this.store.dispatch(FactureAction.loadFacturesBySocieteAdmin());
    this.factures$.subscribe(factures => {
      this.filteredFactures = factures;  
    });
  }

  loadClients(): void {
    this.store.dispatch(loadClientsBySocieteAdmin());
    this.clients$ = this.store.select(selectClientList);
  }

  loadChiffreAffaire(): void {
    this.store.dispatch(ChiffreActions.loadChiffreAffaire());
  
    this.totalFactures$.subscribe((total) => {
      this.montantTotal = total || 0;
      this.calculateNonPayees();
    });
  
    this.totalFacturesPayees$.subscribe((payees) => {
      this.montantTotalPayees = payees || 0;
      this.calculateNonPayees();
    });
  }
  
  refresh(): void {
    this.store.dispatch(ChiffreActions.resetMontants());
  
    this.montantTotal = 0;
    this.montantTotalPayees = 0;
    this.montantTotalNonPayees = 0;
    this.selectedClient = '';
    this.filteredFactures = [];
  
    this.loadFactures();
    this.loadChiffreAffaire();
  }
  
  filterByClient(): void {
    if (!this.selectedClient) {
      this.loadFactures();
      return;
    }
    this.getClientId(this.selectedClient).subscribe((clientId) => {
      if (clientId) {
        this.store.dispatch(FactureAction.loadFacturesClientByClientId({ clientId }));
        this.store.dispatch(ChiffreActions.getTotalFactures({ clientId }));
        this.store.dispatch(ChiffreActions.getTotalFacturesPayees({ clientId }));

        this.factures$.subscribe((factures) => {
          this.filteredFactures = factures.filter(facture => facture.contratClient.client.clientId === clientId);
        });
      } else {
        console.warn("Client non trouvé : ", this.selectedClient);
      }
    });
  }

  getClientId(clientName: string): Observable<number | null> {
    return this.clients$.pipe(
      map(clients => {
        const foundClient = clients.find(client => client.nom === clientName);
        return foundClient ? foundClient.clientId : null;
      })
    );
  }

  calculateNonPayees(): void {
    this.montantTotalNonPayees = this.montantTotal - this.montantTotalPayees;
  }
}
