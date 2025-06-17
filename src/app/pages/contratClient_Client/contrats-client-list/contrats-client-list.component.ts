import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { Observable } from "rxjs";
import * as ContratActions from "../../../store/contratClient/contratClient.actions";
import { selectAllContratsClient, selectContratsClientLoading } from "../../../store/contratClient/contratClient-selector";
import { ContratClient, StatutContrat } from "src/app/models/contratClient.models";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { environment } from "src/environments/environment";
import { CommentContratComponent } from "../../comment-contratClient/comment-contrat-list/comment-contrat.component";

@Component({
  selector: "app-contrats-client-list",
  templateUrl: "./contrats-client-list.component.html"
})
export class ContratsClientListComponent implements OnInit {

  contratsClients$: Observable<ContratClient[]> = this.store.pipe(select(selectAllContratsClient));
  loading$: Observable<boolean> = this.store.select(selectContratsClientLoading);

  @ViewChild('contratModal', { static: true }) contratModalTemplate!: TemplateRef<any>;

  allContrats: ContratClient[] = [];
  filteredContrats: ContratClient[] = [];
  paginatedContrats: ContratClient[] = [];

  // Modal et session
  modalRef: BsModalRef | null = null;
  clientId!: number;
  token: string | null = null;

  // Recherche & Filtres
  searchTerm = "";
  selectedStatut = "";
  minTjm: number | null = null;
  maxTjm: number | null = null;

  // Pagination
  page = 1;
  contratsParPage = 5;

  // Enum to array
  statutContratValues = Object.values(StatutContrat);

  constructor(private route: ActivatedRoute, private store: Store, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.initSession();
    this.loadContrats();
    this.listenContrats();
  }
  private initSession(): void {
    const idFromStorage = localStorage.getItem("clientId");
    this.token = localStorage.getItem("clientToken");
    if (idFromStorage) this.clientId = +idFromStorage;
  }

  private loadContrats(): void {
    if (this.clientId) {
      this.store.dispatch(ContratActions.loadContratsClientByClientId({ clientId: this.clientId }));
    }
  }

  private listenContrats(): void {
    this.contratsClients$.subscribe(contrats => {
      this.allContrats = contrats;
      this.filterContrats();
    });
  }
  //pagination
  filterContrats() {
    const termLower = this.searchTerm.toLowerCase().trim();
    this.filteredContrats = this.allContrats.filter(c =>
      (!this.searchTerm || c.designation.toLowerCase().includes(termLower)) &&
      (!this.selectedStatut || c.statutContrat === this.selectedStatut) &&
      (!this.minTjm || c.tjm >= this.minTjm) &&
      (!this.maxTjm || c.tjm <= this.maxTjm)
    );
    this.pageChanged({ page: 1 });
  }

  pageChanged(event: any) {
    this.page = event.page;
    const start = (this.page - 1) * this.contratsParPage;
    this.paginatedContrats = this.filteredContrats.slice(start, start + this.contratsParPage);
  }

  refreshList() {
    this.selectedStatut = '';
    this.minTjm = 0;
    this.maxTjm = 0;
    this.page = 1;
    this.loadContrats();
  }

  visualiserContrat(contrat: ContratClient): void {
    if (!contrat.filePath) {
      console.error("❌ Erreur : Aucun fichier associé à ce contrat !");
      return;
    }

    const fileName = contrat.filePath.split("\\").pop();
    const fileUrl = `${environment.apiUrl}/contratsClient/fichier/${fileName}`;
    window.open(fileUrl, "_blank");
  }
  ouvrirCommentairesClient(contrat: ContratClient): void {
    const emailClient = contrat.client?.email || 'client@featway.com';

    this.modalRef = this.modalService.show(CommentContratComponent, {
      initialState: {
        contrat: contrat,
        contratClientId: contrat.contratClientId,
        isClientMode: true,
        currentUserEmail: emailClient,
        token: this.token
      },
      class: "modal-lg"
    });
  }
  
  trackById(index: number, item: ContratClient): number {
    return item.contratClientId;
  }

  getStatutLabel(statut: string): string {
    const statutLabels: { [key: string]: string } = {
      EN_ATTENTE: "En Attente",
      CONFIRME_ADMIN: "Confirmé Admin",
      CONFIRMATION_COMPLETE: "Confirmation Complète",
      REJETE: "Rejeté",
    };
    return statutLabels[statut] || "Inconnu";
  }
  getStatutClass(statut: string): string {
    const statutClasses: { [key: string]: string } = {
      EN_ATTENTE: "badge bg-warning text-dark",
      CONFIRME_ADMIN: "badge bg-primary",
      CONFIRMATION_COMPLETE: "badge bg-success",
      REJETE: "badge bg-danger",
    };
    return statutClasses[statut] || "badge bg-secondary";
  }

}