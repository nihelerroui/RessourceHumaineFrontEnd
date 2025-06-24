import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { EventService } from '../../../core/services/event.service';

import { ConfigService } from '../../../core/services/config.service';
import { combineLatest, map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAllSocietes } from 'src/app/store/Authentication/authentication-selector';
import * as AuthActions from "src/app/store/Authentication/authentication.actions";
import { loadNbContratsEcheance, loadNbContratsEcheanceMoisPrecedent } from 'src/app/store/contratSousTraitant/contrat.actions';
import { selectNbContratsEcheance, selectNbContratsEcheanceMoisPrecedent } from 'src/app/store/contratSousTraitant/contrat-selector';
import { selectNbFacturesValider, selectNbFacturesValiderMoisPrecedent } from 'src/app/store/FactureClient/factureclient.selector';
import { loadNbFacturesValider, loadNbFacturesValiderMoisPrecedent } from 'src/app/store/FactureClient/factureclient.actions';
import { loadClientMetrics, loadClients } from 'src/app/store/client/client.actions';
import { selectClientList, selectClientMetrics } from 'src/app/store/client/client.selectors';
import { Client } from 'src/app/models/client.model';
import { ClientMetrics } from 'src/app/models/ClientMetrics.model';
import { loadChiffreAffaireDeuxDernieresAnnees } from 'src/app/store/ChiffreAffaire/ChiffreAffaire.actions';
import { selectCaAnneePrecedente, selectCaDeuxAnsAvant } from 'src/app/store/ChiffreAffaire/ChiffreAffaire.selectors';


@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  modalRef?: BsModalRef;
  isVisible: string;
  rentabiliteChart: any;
  transactions: any;
  statData: any;
  config: any = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  selectedSocieteId: number | "" = "";
  consultantSocieteId: number = 0;
  adminSocietes$: Observable<any[]> = this.store.select(selectAllSocietes);
  currentUserEmail: string = '';
  adminSocietes: any[] = [];

  isActive: string;
  caAnneePrecedente$!: Observable<number>;
  caDeuxAnsAvant$!: Observable<number>;
  nbContratsEcheance$!: Observable<number>;
  nbFacturesValider$!: Observable<number>;
  nbContratsEcheanceMoisPrecedent$!: Observable<number>;
  nbFacturesValiderMoisPrecedent$!: Observable<number>;
  clients$!: Observable<Client[]>;
  tauxPaiementATemps$!: Observable<number>;
  delaiMoyenPaiement$!: Observable<number>;
  nombreContratsRealises$!: Observable<number>;
  montantTotalChiffreAffaire$!: Observable<number>;
  clientMetrics$!: Observable<ClientMetrics[]>;
  clientMetricsFiltres$!: Observable<ClientMetrics[]>;


  pourcentageEvolutionCA: number | null = null;
  pourcentageNMoins1vsActuel: number | null = null;
  evolutionContratsPourcent: number | null = null;
  evolutionFacturesPourcent: number | null = null;
  clientId: number;

  //pagination
  totalItems = 0;
  page = 1;
  metricsParPage = 5;
  allMetrics: ClientMetrics[] = [];
  paginatedMetrics: ClientMetrics[] = [];

  @ViewChild('content') content;
  @ViewChild('center', { static: false }) center?: ModalDirective;
  constructor(private modalService: BsModalService, private configService: ConfigService, private eventService: EventService, private store: Store) {
  }

  ngOnInit() {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser") || "{}");
    this.currentUserEmail = currentUser.user.email || '';
    this.consultantSocieteId = currentUser.societe?.societeId;
    this.selectedSocieteId = this.consultantSocieteId;
    this.store.dispatch(AuthActions.loadAdminSocietes());
    this.store.dispatch(loadChiffreAffaireDeuxDernieresAnnees());
    this.store.dispatch(loadNbContratsEcheance());
    this.store.dispatch(loadNbFacturesValider());
    this.store.dispatch(loadNbContratsEcheanceMoisPrecedent());
    this.store.dispatch(loadNbFacturesValiderMoisPrecedent());
    this.store.dispatch(loadClients());
    this.store.dispatch(loadClientMetrics());

    this.clientMetrics$ = this.store.select(selectClientMetrics);
    this.clients$ = this.store.select(selectClientList);
    this.caAnneePrecedente$ = this.store.select(selectCaAnneePrecedente);
    this.caDeuxAnsAvant$ = this.store.select(selectCaDeuxAnsAvant);
    this.nbFacturesValider$ = this.store.select(selectNbFacturesValider);
    this.nbContratsEcheance$ = this.store.select(selectNbContratsEcheance);
    this.nbContratsEcheanceMoisPrecedent$ = this.store.select(selectNbContratsEcheanceMoisPrecedent);
    this.nbFacturesValiderMoisPrecedent$ = this.store.select(selectNbFacturesValiderMoisPrecedent);
    this.store.dispatch(AuthActions.loadAdminSocietes());

    this.clientMetricsFiltres$ = combineLatest([
      this.clientMetrics$,
      this.clients$,
      this.adminSocietes$
    ]).pipe(
      map(([metrics, clients, adminSocietes]) => {
        return metrics.filter(metric => {
          const client = clients.find(c => c.clientId === metric.clientId);
          const societeId = client?.societe?.societeId;
          return adminSocietes.some(societe => societe.societeId === societeId);
        });
      })
    );

    combineLatest([
      this.caAnneePrecedente$,
      this.caDeuxAnsAvant$
    ]).subscribe(([caAnneePrecedente, caDeuxAnsAvant]) => {
      if (caDeuxAnsAvant && caDeuxAnsAvant !== 0) {
        this.pourcentageEvolutionCA = ((caAnneePrecedente - caDeuxAnsAvant) / caDeuxAnsAvant) * 100;
      } else {
        this.pourcentageEvolutionCA = null;
      }

      if (caAnneePrecedente && caAnneePrecedente !== 0) {
        this.pourcentageNMoins1vsActuel = ((caDeuxAnsAvant - caAnneePrecedente) / caAnneePrecedente) * 100;
      } else {
        this.pourcentageNMoins1vsActuel = null;
      }
    });


    combineLatest([this.nbContratsEcheance$, this.nbContratsEcheanceMoisPrecedent$])
      .subscribe(([actuel, precedent]) => {
        if (precedent && precedent !== 0) {
          this.evolutionContratsPourcent = ((actuel - precedent) / precedent) * 100;
        } else {
          this.evolutionContratsPourcent = null;
        }
      });

    combineLatest([this.nbFacturesValider$, this.nbFacturesValiderMoisPrecedent$]).subscribe(([actuel, precedent]) => {
      if (precedent && precedent !== 0) {
        this.evolutionFacturesPourcent = ((actuel - precedent) / precedent) * 100;
      } else {
        this.evolutionFacturesPourcent = null;
      }
    });

    combineLatest([this.clients$, this.adminSocietes$]).subscribe(([clients, adminSocietes]) => {
      console.log('AdminSocietes depuis combineLatest:', adminSocietes);
      const filteredClients = clients.filter(client =>
        adminSocietes.some(societe => societe.societeId === client.societe?.societeId)
      );
      console.log("Clients filtrés (sociétés administrées) :", filteredClients);

      const categories = filteredClients.map(client => client.nom);
      // const data = filteredClients.map(_ => Math.floor(Math.random() * 100));

      this.rentabiliteChart = {
        series: [{
          name: 'Rentabilité (%)',
          data: [40, 90, 30, 60, 15, 80]
        }],
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
          enabled: true,
          formatter: function (val: number) {
            return val + "%";
          }
        },
        colors: ['#1980e6'],
        xaxis: {
          categories: categories
        },
        yaxis: {
          title: {
            text: 'Rentabilité (%)'
          },
          min: 0,
          max: 100
        }
      };
    });


    /**
     * horizontal-vertical layput set
     */
    const attribute = document.body.getAttribute('data-layout');

    this.isVisible = attribute;
    const vertical = document.getElementById('layout-vertical');
    if (vertical != null) {
      vertical.setAttribute('checked', 'true');
    }
    if (attribute == 'horizontal') {
      const horizontal = document.getElementById('layout-horizontal');
      if (horizontal != null) {
        horizontal.setAttribute('checked', 'true');
      }
    }

    this.clientMetricsFiltres$.subscribe(metrics => {
      this.allMetrics = metrics;
      this.totalItems = metrics.length;
      this.updatePagination();
    });

  }
  getBadgeClass(value: number, type: 'score' | 'paiement'): string {
    if (type === 'score') {
      if (value >= 80) return 'badge badge-soft-success';
      if (value >= 60) return 'badge badge-soft-warning';
      return 'badge badge-soft-danger';
    }
    if (type === 'paiement') {
      if (value >= 80) return 'badge badge-soft-success';
      if (value >= 50) return 'badge badge-soft-warning';
      return 'badge badge-soft-danger';
    }
    return 'badge badge-secondary';
  }
  updatePagination(): void {
    const start = (this.page - 1) * this.metricsParPage;
    this.paginatedMetrics = this.allMetrics.slice(start, start + this.metricsParPage);
  }

  pageChanged(event: any): void {
    this.page = event.page;
    this.updatePagination();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.center?.show()
    }, 2000);
  }

  /**
   * Fetches the data
   */

  opencenterModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  weeklyreport() {
    this.isActive = 'week';
    //this.emailSentBarChart.series =
    [{
      name: 'Series A',
      data: [44, 55, 41, 67, 22, 43, 36, 52, 24, 18, 36, 48]
    }, {
      name: 'Series B',
      data: [11, 17, 15, 15, 21, 14, 11, 18, 17, 12, 20, 18]
    }, {
      name: 'Series C',
      data: [13, 23, 20, 8, 13, 27, 18, 22, 10, 16, 24, 22]
    }];
  }

  monthlyreport() {

  }

  yearlyreport() {

  }


  /**
   * Change the layout onclick
   * @param layout Change the layout
   */
  changeLayout(layout: string) {
    this.eventService.broadcast('changeLayout', layout);
  }
}

