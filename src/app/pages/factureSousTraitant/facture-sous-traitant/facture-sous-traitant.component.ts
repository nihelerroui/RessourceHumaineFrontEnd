import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { Store } from "@ngrx/store";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Observable } from "rxjs";
import { FactureSousTraitantService } from "src/app/core/services/factureSousTraitant.service";
import { FactureSousTraitant } from "src/app/models/FactureSousTraitant.model";
import { loadFacturesSousTraitant } from "src/app/store/factureSousTraitant/factureSousTraitant.actions";
import * as FactureSousTraitantSelectors from "src/app/store/factureSousTraitant/factureSousTraitant.selectors";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";

@Component({
  selector: "app-facture-sous-traitant",
  templateUrl: "./facture-sous-traitant.component.html",
  styleUrls: ["./facture-sous-traitant.component.css"],
})
export class FactureSousTraitantComponent implements OnInit {
  factureList$: Observable<FactureSousTraitant[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;

  filteredFactureList: FactureSousTraitant[] = [];
  paginatedFactureList: FactureSousTraitant[] = [];
  searchTerm = "";
  currentPage = 1;
  itemsPerPage = 5;

  selectedFacture: FactureSousTraitant | null = null;
  modalRef?: BsModalRef;
  consultantId!: number;

  selectedMonth: number | null = null;
  selectedYear: number | null = null;

  allFactures: FactureSousTraitant[] = [];
  isValidatingPayment = false;
  role : string ="";


  constructor(
    private store: Store,
    private modalService: BsModalService,
    private http: HttpClient,
    private factureService: FactureSousTraitantService
  ) {
    this.factureList$ = this.store.select(
      FactureSousTraitantSelectors.selectAllFactures
    );
    this.loading$ = this.store.select(
      FactureSousTraitantSelectors.selectFacturesLoading
    );
    this.error$ = this.store.select(
      FactureSousTraitantSelectors.selectFacturesError
    );
  }

  ngOnInit(): void {
    const currentUser = JSON.parse(
      localStorage.getItem("currentUser") || "{}"
    );
    this.consultantId = currentUser.consultantId;
    this.role = currentUser.user?.role || "";

    this.loadFactures();

    this.factureList$.subscribe((factures) => {
      this.allFactures = factures;
      this.filterFactures();
    });
  }

  loadFactures(): void {
    this.store.dispatch(
      loadFacturesSousTraitant({
        consultantId: 319
      })
    );
  }

  filterFactures(): void {
    const search = this.searchTerm.toLowerCase();

    this.filteredFactureList = this.allFactures.filter(
      (f) =>
        (!this.selectedMonth || f.monthId === this.selectedMonth) &&
        (!this.selectedYear || f.yearId === this.selectedYear) &&
        f.filePath.toLowerCase().includes(search)
    );

    this.pageChanged({ page: 1 });
  }

  pageChanged(event: any) {
    this.currentPage = event.page;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedFactureList = this.filteredFactureList.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  openDetailsModal(facture: FactureSousTraitant, template: TemplateRef<any>) {
    this.selectedFacture = facture;
    this.modalRef = this.modalService.show(template);
  }

  openFacture(filePath: string): void {
    const headers = new HttpHeaders();

    this.http.get(filePath, { headers, responseType: "blob" }).subscribe(
      (blob) => {
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, "_blank");
      },
      (error) => {
        console.error("Erreur d'ouverture de facture", error);
        Swal.fire("Erreur", "Impossible d’ouvrir le fichier.", "error");
      }
    );
  }

  downloadFacture(filePath: string): void {
    const headers = new HttpHeaders();

    this.http.get(filePath, { headers, responseType: "blob" }).subscribe(
      (blob) => {
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;

        const fileName =
          filePath.split("/").pop()?.split("?")[0] || "facture.pdf";
        a.download = fileName;

        a.click();
        URL.revokeObjectURL(downloadUrl);
      },
      (error) => {
        console.error("Erreur de téléchargement", error);
        Swal.fire("Erreur", "Téléchargement échoué.", "error");
      }
    );
  }

  getFileName(filePath: string): string {
    return filePath.split("/").pop() || "";
  }

  getMonthName(monthNumber: number): string {
    const monthNames = [
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
    return monthNames[monthNumber - 1] || "";
  }

  get availableMonths(): number[] {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  }

  get availableYears(): number[] {
    const currentYear = new Date().getFullYear();
    return [currentYear - 1, currentYear, currentYear + 1];
  }

validerPaiement(idFacture: number) {
  Swal.fire({
    title: "Confirmer",
    text: "Voulez-vous valider le paiement de cette facture ?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Oui, valider",
    cancelButtonText: "Annuler",
  }).then((result) => {
    if (result.isConfirmed) {
      this.isValidatingPayment = true;

      this.factureService.validerPaiement(idFacture).subscribe({
        next: (res) => {
          this.isValidatingPayment = false;
          Swal.fire("Succès", "Paiement validé avec succès.", "success");
          this.loadFactures();
        },
        error: (err) => {
          this.isValidatingPayment = false;
          Swal.fire(
            "Erreur",
            "Erreur lors de la validation du paiement.",
            "error"
          );
          console.error(err);
        },
      });
    }
  });
}

}
