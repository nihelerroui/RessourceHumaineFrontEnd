import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import {
  BsModalService,
  BsModalRef,
  ModalDirective,
} from "ngx-bootstrap/modal";
import { EventService } from "../../../core/services/event.service";

import { ConfigService } from "../../../core/services/config.service";
import { combineLatest, map, Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { selectAllSocietes, selectUserImage } from "src/app/store/Authentication/authentication-selector";
import * as AuthActions from "src/app/store/Authentication/authentication.actions";
import * as ContratClientActions from "src/app/store/contratSousTraitant/contrat.actions";
import {
  selectNbContratsEcheance,
  selectNbContratsEcheanceMoisPrecedent,
} from "src/app/store/contratSousTraitant/contrat-selector";
import {
  selectNbFacturesValider,
  selectNbFacturesValiderMoisPrecedent,
} from "src/app/store/FactureClient/factureclient.selector";
import * as FactureClientActions from "src/app/store/FactureClient/factureclient.actions";
import {
  loadClientMetrics,
  loadClients,
} from "src/app/store/client/client.actions";
import {
  selectClientList,
  selectClientMetrics,
} from "src/app/store/client/client.selectors";
import { Client } from "src/app/models/client.model";
import { ClientMetrics } from "src/app/models/ClientMetrics.model";
import { loadChiffreAffaireDeuxDernieresAnnees } from "src/app/store/ChiffreAffaire/ChiffreAffaire.actions";
import {
  selectCaAnneePrecedente,
  selectCaDeuxAnsAvant,
} from "src/app/store/ChiffreAffaire/ChiffreAffaire.selectors";
import * as RecetteSelectors from "src/app/store/recette/recette.selectors";
import * as DepenseSelectors from "src/app/store/Depense/depense.selectors";
import * as RecetteActions from "src/app/store/recette/recette.actions";
import * as DepenseActions from "src/app/store/Depense/depense.actions";
import { SourceFinancement } from "src/app/models/SourceFinancement.enum";
import * as TresorerieSelectors from "src/app/store/tresorerie/tresorerie.selectors";
import * as TresorerieActions from "src/app/store/tresorerie/tresorerie.actions";
import { selectMainOeuvreData } from "src/app/store/mainOeuvre/mainOeuvre.selectors";
import { loadHistoriqueMainOeuvre } from "src/app/store/historique-mainOeuvre/historiqueMainOeuvre.actions";
import { selectHistoriqueMainOeuvreData } from "src/app/store/historique-mainOeuvre/historiqueMainOeuvre.selectors";

@Component({
  selector: "app-default",
  templateUrl: "./default.component.html",
  styleUrls: ["./default.component.scss"],
})
export class DefaultComponent implements OnInit {
  modalRef?: BsModalRef;
  isVisible: string;
  rentabiliteChart: any;
  transactions: any;
  statData: any;
  config: any = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  selectedSocieteId: number | "" = "";
  consultantSocieteId: number = 0;
  adminSocietes$: Observable<any[]> = this.store.select(selectAllSocietes);
  currentUserEmail: string = "";
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

  recettes$: Observable<any[]>;
  depenses$: Observable<any[]>;
  margeMensuelleChart: any;

  margeToday = 0;
  margeMois = 0;
  margeAnnee = 0;

  margeMoisPct = 0;
  margeAnneePct = 0;

  soldeInitial = 0;
  soldeActuel = 0;
  nombreTransactions = 0;

coutAnnuelTotal = 0;
moyenneMensuelle = 0;
moisMax = '';
coutMax = 0;
moisMin = '';
coutMin = 0;

mainOeuvre$!: Observable<any[]>;

chartSeries: any[] = [];
historiqueCategories: string[] = [];

currentUserNom = '';
currentUserPhoto = '';
currentUserSociete = ''; 



  @ViewChild("content") content;
  @ViewChild("center", { static: false }) center?: ModalDirective;
  constructor(
    private modalService: BsModalService,
    private configService: ConfigService,
    private eventService: EventService,
    private store: Store
  ) {}

  ngOnInit() {
    const currentUser = JSON.parse(
      sessionStorage.getItem("currentUser") || "{}"
    );
    if (currentUser && currentUser.user) {
  this.currentUserNom = currentUser.fullName || 'Utilisateur';
    this.currentUserSociete = currentUser.societe?.nom || 'societe';
  this.currentUserEmail = currentUser.user.email || '';
  this.currentUserPhoto = currentUser.personalDetails?.photoUrl || '';
}
this.store.dispatch(AuthActions.loadUserImage());
this.store.select(selectUserImage).subscribe((img) => {
  if (img) {
    this.currentUserPhoto = img;
  }
});

    this.consultantSocieteId = currentUser.societe?.societeId;
    this.selectedSocieteId = this.consultantSocieteId;
    this.store.dispatch(AuthActions.loadAdminSocietes());
    this.store.dispatch(loadChiffreAffaireDeuxDernieresAnnees());
    this.store.dispatch(ContratClientActions.loadNbContratsEcheance());
    this.store.dispatch(FactureClientActions.loadNbFacturesValider());
    this.store.dispatch(
      ContratClientActions.loadNbContratsEcheanceMoisPrecedent()
    );
    this.store.dispatch(
      FactureClientActions.loadNbFacturesValiderMoisPrecedent()
    );
    this.store.dispatch(loadClients());
    this.store.dispatch(loadClientMetrics());
    const currentYear = new Date().getFullYear();
this.store.dispatch(loadHistoriqueMainOeuvre({
  consultantId: this.consultantSocieteId,
  year: currentYear
}));


    this.mainOeuvre$ = this.store.select(selectHistoriqueMainOeuvreData);



    this.store.select(TresorerieSelectors.selectTresorerie).subscribe(treso => {
  if (treso) {
    this.soldeInitial = treso.soldeInitial;
    this.soldeActuel = treso.soldeActuel;
  }
});

this.mainOeuvre$.subscribe(data => {
  this.chartSeries = [{
    name: 'Coût Main d’œuvre',
    data: data.map(e => e.montant)
  }];

  this.historiqueCategories = data.map(e =>
    this.getMonthName(new Date(e.date).getMonth() + 1)
  );

  if (!data || data.length === 0) {
    this.coutAnnuelTotal = 0;
    this.moyenneMensuelle = 0;
    this.moisMax = 'N/A';
    this.coutMax = 0;
    this.moisMin = 'N/A';
    this.coutMin = 0;
    return;
  }

  // coût annuel
  this.coutAnnuelTotal = data.reduce((sum, item) => sum + item.montantTotal, 0);

  // moyenne mensuelle
  this.moyenneMensuelle = this.coutAnnuelTotal / 12;

  // mois le plus coûteux
  const max = data.reduce((prev, curr) => prev.montantTotal > curr.montantTotal ? prev : curr);
  this.moisMax = this.getMonthName(max.mois);
  this.coutMax = max.montantTotal;

  // mois le moins coûteux
  const min = data.reduce((prev, curr) => prev.montantTotal < curr.montantTotal ? prev : curr);
  this.moisMin = this.getMonthName(min.mois);
  this.coutMin = min.montantTotal;
});




    this.clientMetrics$ = this.store.select(selectClientMetrics);
    this.clients$ = this.store.select(selectClientList);
    this.caAnneePrecedente$ = this.store.select(selectCaAnneePrecedente);
    this.caDeuxAnsAvant$ = this.store.select(selectCaDeuxAnsAvant);
    this.nbFacturesValider$ = this.store.select(selectNbFacturesValider);
    this.nbContratsEcheance$ = this.store.select(selectNbContratsEcheance);
    this.nbContratsEcheanceMoisPrecedent$ = this.store.select(
      selectNbContratsEcheanceMoisPrecedent
    );
    this.nbFacturesValiderMoisPrecedent$ = this.store.select(
      selectNbFacturesValiderMoisPrecedent
    );
    this.store.dispatch(AuthActions.loadAdminSocietes());
    this.store.dispatch(
      RecetteActions.loadRecettesBySociete({
        societeId: this.selectedSocieteId,
      })
    );
    this.store.dispatch(
      DepenseActions.loadDepenses({ societeId: this.selectedSocieteId })
    );

    this.recettes$ = this.store.select(
      RecetteSelectors.selectAllRecettesBySociete
    );
    this.depenses$ = this.store.select(DepenseSelectors.selectAllDepenses);
    this.store.dispatch(TresorerieActions.loadTresorerie({ societeId: this.selectedSocieteId }));


    combineLatest([this.recettes$, this.depenses$]).subscribe(
      ([recettes, depenses]) => {
        const recettesFiltrees = recettes.filter(
          (r) =>
            r.societe?.societeId === this.selectedSocieteId &&
            r.sourceFinancement === SourceFinancement.TRESORERIE
        );
        const depensesFiltrees = depenses.filter(
          (d) =>
            d.societe?.societeId === this.selectedSocieteId &&
            d.sourceFinancement === SourceFinancement.TRESORERIE
        );

        this.nombreTransactions = recettesFiltrees.length + depensesFiltrees.length;

        const grouped: {
          [monthIndex: number]: { recettes: number; depenses: number };
        } = {};

        recettesFiltrees.forEach((r) => {
          const monthIndex = new Date(r.dateCreation).getMonth();
          if (!grouped[monthIndex])
            grouped[monthIndex] = { recettes: 0, depenses: 0 };
          grouped[monthIndex].recettes += r.montant;
        });

        depensesFiltrees.forEach((d) => {
          const monthIndex = new Date(d.dateCreation).getMonth();
          if (!grouped[monthIndex])
            grouped[monthIndex] = { recettes: 0, depenses: 0 };
          grouped[monthIndex].depenses += d.montant;
        });

        const today = new Date();
        this.margeToday =
          recettesFiltrees
            .filter((r) => this.isSameDate(r.dateCreation, today))
            .reduce((sum, r) => sum + r.montant, 0) -
          depensesFiltrees
            .filter((d) => this.isSameDate(d.dateCreation, today))
            .reduce((sum, d) => sum + d.montant, 0);

        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        const recettesMois = recettesFiltrees
          .filter(
            (r) =>
              new Date(r.dateCreation).getMonth() === currentMonth &&
              new Date(r.dateCreation).getFullYear() === currentYear
          )
          .reduce((sum, r) => sum + r.montant, 0);

        const depensesMois = depensesFiltrees
          .filter(
            (d) =>
              new Date(d.dateCreation).getMonth() === currentMonth &&
              new Date(d.dateCreation).getFullYear() === currentYear
          )
          .reduce((sum, d) => sum + d.montant, 0);

        this.margeMois = recettesMois - depensesMois;

        const recettesAnnee = recettesFiltrees
          .filter((r) => new Date(r.dateCreation).getFullYear() === currentYear)
          .reduce((sum, r) => sum + r.montant, 0);

        const depensesAnnee = depensesFiltrees
          .filter((d) => new Date(d.dateCreation).getFullYear() === currentYear)
          .reduce((sum, d) => sum + d.montant, 0);

        this.margeAnnee = recettesAnnee - depensesAnnee;

        this.margeMoisPct = this.calculateVariation(recettesMois, depensesMois);
        this.margeAnneePct = this.calculateVariation(
          recettesAnnee,
          depensesAnnee
        );

        this.margeAnnee = recettesAnnee - depensesAnnee;

        for (let i = 0; i < 12; i++) {
          if (!grouped[i]) grouped[i] = { recettes: 0, depenses: 0 };
        }

        const sortedMonths = Array.from({ length: 12 }, (_, i) => i);
        const monthLabels = [
          "Janv",
          "Févr",
          "Mars",
          "Avr",
          "Mai",
          "Juin",
          "Juil",
          "Août",
          "Sept",
          "Oct",
          "Nov",
          "Déc",
        ];
        const recettesMensuelles = sortedMonths.map((i) => grouped[i].recettes);
        const depensesMensuelles = sortedMonths.map((i) => grouped[i].depenses);

        this.margeMensuelleChart = {
          series: [
            {
              name: "Recettes",
              data: recettesMensuelles,
            },
            {
              name: "Dépenses",
              data: depensesMensuelles,
            },
          ],
          chart: {
            type: "area",
            height: 350,
            toolbar: { show: false },
          },
          dataLabels: { enabled: false },
          stroke: { curve: "smooth", width: 2 },

          fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.2,
              opacityTo: 0.05,
              stops: [0, 90, 100],
            },
          },
          colors: ["#556ee6", "#f1b44c"],
          xaxis: {
            categories: monthLabels,
          },
          yaxis: {
            title: { text: "Montant" },
          },
          legend: {
            show: true,
            position: "top",
            horizontalAlign: "right",
            fontSize: "14px",
            markers: {
              radius: 12,
            },
          },
        };
      }
    );

    this.clientMetricsFiltres$ = combineLatest([
      this.clientMetrics$,
      this.clients$,
      this.adminSocietes$,
    ]).pipe(
      map(([metrics, clients, adminSocietes]) => {
        return metrics.filter((metric) => {
          const client = clients.find((c) => c.clientId === metric.clientId);
          const societeId = client?.societe?.societeId;
          return adminSocietes.some(
            (societe) => societe.societeId === societeId
          );
        });
      })
    );

    combineLatest([this.caAnneePrecedente$, this.caDeuxAnsAvant$]).subscribe(
      ([caAnneePrecedente, caDeuxAnsAvant]) => {
        if (caDeuxAnsAvant && caDeuxAnsAvant !== 0) {
          this.pourcentageEvolutionCA =
            ((caAnneePrecedente - caDeuxAnsAvant) / caDeuxAnsAvant) * 100;
        } else {
          this.pourcentageEvolutionCA = null;
        }

        if (caAnneePrecedente && caAnneePrecedente !== 0) {
          this.pourcentageNMoins1vsActuel =
            ((caDeuxAnsAvant - caAnneePrecedente) / caAnneePrecedente) * 100;
        } else {
          this.pourcentageNMoins1vsActuel = null;
        }
      }
    );

    combineLatest([
      this.nbContratsEcheance$,
      this.nbContratsEcheanceMoisPrecedent$,
    ]).subscribe(([actuel, precedent]) => {
      if (precedent && precedent !== 0) {
        this.evolutionContratsPourcent =
          ((actuel - precedent) / precedent) * 100;
      } else {
        this.evolutionContratsPourcent = null;
      }
    });

    combineLatest([
      this.nbFacturesValider$,
      this.nbFacturesValiderMoisPrecedent$,
    ]).subscribe(([actuel, precedent]) => {
      if (precedent && precedent !== 0) {
        this.evolutionFacturesPourcent =
          ((actuel - precedent) / precedent) * 100;
      } else {
        this.evolutionFacturesPourcent = null;
      }
    });

    combineLatest([this.clients$, this.adminSocietes$]).subscribe(
      ([clients, adminSocietes]) => {
        console.log("AdminSocietes depuis combineLatest:", adminSocietes);
        const filteredClients = clients.filter((client) =>
          adminSocietes.some(
            (societe) => societe.societeId === client.societe?.societeId
          )
        );
        console.log(
          "Clients filtrés (sociétés administrées) :",
          filteredClients
        );

        const categories = filteredClients.map((client) => client.nom);
        // const data = filteredClients.map(_ => Math.floor(Math.random() * 100));

        this.rentabiliteChart = {
          series: [
            {
              name: "Rentabilité (%)",
              data: [40, 90, 30, 60, 15, 80],
            },
          ],
          chart: {
            type: "bar",
            height: 350,
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "55%",
              endingShape: "rounded",
            },
          },
          dataLabels: {
            enabled: true,
            formatter: function (val: number) {
              return val + "%";
            },
          },
          colors: ["#1980e6"],
          xaxis: {
            categories: categories,
          },
          yaxis: {
            title: {
              text: "Rentabilité (%)",
            },
            min: 0,
            max: 100,
          },
        };
      }
    );

    /**
     * horizontal-vertical layput set
     */
    const attribute = document.body.getAttribute("data-layout");

    this.isVisible = attribute;
    const vertical = document.getElementById("layout-vertical");
    if (vertical != null) {
      vertical.setAttribute("checked", "true");
    }
    if (attribute == "horizontal") {
      const horizontal = document.getElementById("layout-horizontal");
      if (horizontal != null) {
        horizontal.setAttribute("checked", "true");
      }
    }

    this.clientMetricsFiltres$.subscribe((metrics) => {
      this.allMetrics = metrics;
      this.totalItems = metrics.length;
      this.updatePagination();
    });
  }
  getBadgeClass(value: number, type: "score" | "paiement"): string {
    if (type === "score") {
      if (value >= 80) return "badge badge-soft-success";
      if (value >= 60) return "badge badge-soft-warning";
      return "badge badge-soft-danger";
    }
    if (type === "paiement") {
      if (value >= 80) return "badge badge-soft-success";
      if (value >= 50) return "badge badge-soft-warning";
      return "badge badge-soft-danger";
    }
    return "badge badge-secondary";
  }
  updatePagination(): void {
    const start = (this.page - 1) * this.metricsParPage;
    this.paginatedMetrics = this.allMetrics.slice(
      start,
      start + this.metricsParPage
    );
  }

  pageChanged(event: any): void {
    this.page = event.page;
    this.updatePagination();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.center?.show();
    }, 2000);
  }

  /**
   * Fetches the data
   */

  opencenterModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  weeklyreport() {
    this.isActive = "week";
    //this.emailSentBarChart.series =
    [
      {
        name: "Series A",
        data: [44, 55, 41, 67, 22, 43, 36, 52, 24, 18, 36, 48],
      },
      {
        name: "Series B",
        data: [11, 17, 15, 15, 21, 14, 11, 18, 17, 12, 20, 18],
      },
      {
        name: "Series C",
        data: [13, 23, 20, 8, 13, 27, 18, 22, 10, 16, 24, 22],
      },
    ];
  }

  monthlyreport() {}

  yearlyreport() {}

  /**
   * Change the layout onclick
   * @param layout Change the layout
   */
  changeLayout(layout: string) {
    this.eventService.broadcast("changeLayout", layout);
  }

  calculateVariation(recettes: number, depenses: number): number {
    if (depenses === 0) return 0;
    return ((recettes - depenses) / depenses) * 100;
  }

  isSameDate(dateStr: string, target: Date): boolean {
    const d = new Date(dateStr);
    return (
      d.getDate() === target.getDate() &&
      d.getMonth() === target.getMonth() &&
      d.getFullYear() === target.getFullYear()
    );
  }
  getMonthName(monthNumber: number): string {
  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
  ];
  return months[monthNumber - 1] || "Inconnu";
}

}
