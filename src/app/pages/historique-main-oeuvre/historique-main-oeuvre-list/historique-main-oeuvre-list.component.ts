import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { HistoriqueMainOeuvre } from "src/app/models/historique-mainOeuvre";
import { loadHistoriqueMainOeuvre } from "src/app/store/historique-mainOeuvre/historiqueMainOeuvre.actions";
import { ChartType, earningLineChart } from "../data";
import { selectHistoriqueMainOeuvreData } from "src/app/store/historique-mainOeuvre/historiqueMainOeuvre.selectors";

@Component({
  selector: "app-historique-main-oeuvre-list",
  templateUrl: "./historique-main-oeuvre-list.component.html",
  styleUrls: ["./historique-main-oeuvre-list.component.css"],
})
export class HistoriqueMainOeuvreListComponent implements OnInit {
  breadCrumbItems!: Array<{ label: string; path?: string; active?: boolean }>;

  historiqueData: HistoriqueMainOeuvre[] = [];
  chartSeries: any[] = [];
  totalThisMonth: number = 0;
  totalLastMonth: number = 0;
  variationPourcentage: number = 0;

  earningLineChart: ChartType;

  selectedYear: number;
  years: number[] = [];
  consultantId!: number;

  paginatedHistorique: HistoriqueMainOeuvre[] = [];
  itemsPerPage: number = 4;
  currentPage: number = 1;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Main Œuvre" },
      { label: "Historique Main d'œuvre", active: true },
    ];

    const currentUser = JSON.parse(
      sessionStorage.getItem("currentUser") || "{}"
    );
    this.consultantId = currentUser.consultantId;

    this.earningLineChart = {
      chart: {
        height: 288,
        type: "line",
        toolbar: {
          show: false,
        },
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 8,
          opacity: 0.2,
        },
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#556ee6"],
      stroke: {
        curve: "smooth",
        width: 3,
      },
      xaxis: {
        categories: [],
      },
    };

    const now = new Date();
    this.selectedYear = now.getFullYear();
    this.years = Array.from({ length: 3 }, (_, i) => this.selectedYear - i);

    this.loadHistorique(this.consultantId, this.selectedYear);

    this.store.select(selectHistoriqueMainOeuvreData).subscribe((data) => {
      this.historiqueData = data;
      this.prepareChartData();
      this.paginerHistorique();
    });
  }

  selectYear(event: any) {
    this.selectedYear = +event.target.value;
    this.loadHistorique(this.consultantId, this.selectedYear);
  }

  loadHistorique(consultantId: number, year: number) {
    this.store.dispatch(loadHistoriqueMainOeuvre({ consultantId, year }));
  }

  prepareChartData() {
    const sorted = [...this.historiqueData].sort((a, b) => a.mois - b.mois);
    const lastIndex = sorted.length - 1;
    const thisMonth = sorted[lastIndex];
    const lastMonth = sorted[lastIndex - 1];

    this.totalThisMonth = thisMonth?.montantTotal || 0;
    this.totalLastMonth = lastMonth?.montantTotal || 0;

    this.variationPourcentage = this.totalLastMonth
      ? ((this.totalThisMonth - this.totalLastMonth) / this.totalLastMonth) *
        100
      : 0;

    this.chartSeries = [
      {
        name: "Coût Main d’œuvre",
        data: sorted.map((h) => h.montantTotal),
      },
    ];

    this.earningLineChart.xaxis = {
      categories: sorted.map((h) => this.getMonthName(h.mois)),
    };
  }

  getMonthName(monthNumber: number): string {
    const months = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ];
    return months[monthNumber - 1] || "Inconnu";
  }

  paginerHistorique(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedHistorique = [...this.historiqueData]
      .sort((a, b) => a.mois - b.mois)
      .slice(start, end);
  }

  onPageChanged(event: any) {
    this.currentPage = event.page;
    this.paginerHistorique();
  }

  getMoyenneAnnuelle(): number {
    if (!this.historiqueData.length) return 0;
    const total = this.historiqueData.reduce(
      (acc, h) => acc + h.montantTotal,
      0
    );
    return total / this.historiqueData.length;
  }

  getMoisPlusCouteux(): HistoriqueMainOeuvre | null {
    if (!this.historiqueData.length) return null;
    return this.historiqueData.reduce((prev, curr) =>
      prev.montantTotal > curr.montantTotal ? prev : curr
    );
  }
  getMoisPlusCouteuxLabel(): string {
    const moisObj = this.getMoisPlusCouteux();
    return moisObj
      ? `${this.getMonthName(moisObj.mois)} - ${moisObj.montantTotal.toFixed(
          2
        )} €`
      : "N/A";
  }

  getMoisMoinsCouteuxLabel(): string {
    if (!this.historiqueData.length) return "N/A";
    const min = this.historiqueData.reduce((prev, curr) =>
      prev.montantTotal < curr.montantTotal ? prev : curr
    );
    return `${this.getMonthName(min.mois)} - ${min.montantTotal.toFixed(2)} €`;
  }

  getMontantAnnuel(): number {
    return this.historiqueData.reduce(
      (acc, item) => acc + item.montantTotal,
      0
    );
  }
}
