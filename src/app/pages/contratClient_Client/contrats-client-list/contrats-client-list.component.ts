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
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DomSanitizer } from "@angular/platform-browser";

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

  @ViewChild('confirmDeleteModal') confirmDeleteModal!: TemplateRef<any>;
contratASupprimer: ContratClient | null = null;
isDeleting = false;
  constructor(private route: ActivatedRoute, private store: Store, private modalService: BsModalService, private http: HttpClient,private sanitizer: DomSanitizer) { }

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
  private openContratPdf(filePath: string, token?: string) {
    if (!filePath) { console.error('Aucun fichier'); return; }
  
    // ne garder que le nom du fichier (compat Windows/Linux)
    const fileName = filePath.split(/[/\\]/).pop()!;
    const url = `${environment.apiUrl}/contratsClient/fichier/${encodeURIComponent(fileName)}`;
  
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : new HttpHeaders();
  
    this.http.get(url, { headers, responseType: 'blob' }).subscribe({
      next: (blob) => {
        const objectUrl = URL.createObjectURL(blob);
        // Ouvrir dans un nouvel onglet :
        window.open(objectUrl, '_blank');
      },
      error: (err) => console.error('Erreur de lecture du contrat', err)
    });
  }
  visualiserContrat(contrat: ContratClient): void {
  const token = localStorage.getItem('clientToken') || undefined;
  this.openContratPdf(contrat.filePath!, token);
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
  demanderSuppression(contrat: ContratClient) {
  this.contratASupprimer = contrat;
  this.modalRef = this.modalService.show(this.confirmDeleteModal, { class: 'modal-sm' });
}

confirmerSuppression() {
  if (!this.contratASupprimer?.contratClientId) return;
  this.isDeleting = true;
  this.store.dispatch(ContratActions.deleteContratClient({ id: this.contratASupprimer.contratClientId }));
  this.isDeleting = false;
  this.modalRef?.hide();
  this.contratASupprimer = null;
}

}