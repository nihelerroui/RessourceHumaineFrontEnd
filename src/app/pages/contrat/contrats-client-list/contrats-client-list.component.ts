import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { combineLatest, map, Observable } from "rxjs";
import * as ContratActions from "../../../store/contratClient/contratClient.actions";
import {
  selectAllContratsClient,
  selectContratsClientLoading,
  selectContratsClientSearchResults
} from "../../../store/contratClient/contratClient-selector";
import { ContratClient, StatutContrat } from "src/app/models/contratClient.models";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { CommentContratModalComponent } from "../comment-contrat-modal/comment-contrat-modal.component";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-contrats-client-list",
  templateUrl: "./contrats-client-list.component.html"
})
export class ContratsClientListComponent implements OnInit {
  contratsClients$: Observable<ContratClient[]> = this.store.pipe(select(selectAllContratsClient));
  loading$: Observable<boolean> = this.store.select(selectContratsClientLoading);

  contratsPagination$: Observable<ContratClient[]> = new Observable();
  total$: Observable<number> = new Observable();

  token: string | null = null;
  modalRef: BsModalRef | null = null;
  contratFileUrl: string | null = null;
  // Critères de recherche
  searchTerm: string = "";
  selectedStatut: string = "";
  minTjm: number | null = null;
  maxTjm: number | null = null;
  statutContratValues = Object.values(StatutContrat);

  page = 1;
  contratsParPage = 5;

  @ViewChild('contratModal', { static: true }) contratModalTemplate!: TemplateRef<any>;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private modalService: BsModalService
  ) { }
  ngOnInit(): void {
    const idFromStorage = localStorage.getItem("clientId");
    if (idFromStorage) {
      const clientId = Number(idFromStorage);
      this.store.dispatch(ContratActions.loadContratsClientByClientId({ clientId }));
      this.updatePagination();
    }
    this.searchContrat();
  }
  //pagination
  updatePagination(): void {
    this.contratsPagination$ = combineLatest([this.contratsClients$]).pipe(
      map(([contratsClients]) => {
        const total = contratsClients.length;
        this.total$ = new Observable(observer => observer.next(total));
        const start = (this.page - 1) * this.contratsParPage;
        return contratsClients.slice(start, start + this.contratsParPage);
      })
    );
  }
  trackById(index: number, item: ContratClient): number {
    return item.contratClientId;
  }

  visualiserContrat(contrat: ContratClient): void {
    if (!contrat.filePath) {
      console.error("❌ Erreur : Aucun fichier associé à ce contrat !");
      return;
    }

    const fileName = contrat.filePath.split("\\").pop();
    const fileUrl = `${environment.apiUrl}/contratsClient/fichier/${fileName}`;

    console.log("Ouverture du fichier :", fileUrl);
    window.open(fileUrl, "_blank");
  }
  ouvrirCommentairesClient(contrat: ContratClient): void {
    const emailClient = contrat.client?.email || 'client@featway.com';

    this.modalRef = this.modalService.show(CommentContratModalComponent, {
      initialState: {
        contrat: contrat,
        contratClientId: contrat.contratClientId,
        isClientMode: true,
        currentUserEmail: emailClient
      },
      class: "modal-lg"
    });
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
  searchContrat() {
    this.contratsPagination$ = combineLatest([this.contratsClients$]).pipe(
      map(([contratsClients]) => {
        let filtered = contratsClients;

        // Filtrer par statut
        if (this.selectedStatut) {
          filtered = filtered.filter(c => c.statutContrat === this.selectedStatut);
        }

        // Filtrer par min TJM
        if (this.minTjm !== null) {
          filtered = filtered.filter(c => c.tjm >= this.minTjm!);
        }

        // Filtrer par max TJM
        if (this.maxTjm !== null) {
          filtered = filtered.filter(c => c.tjm <= this.maxTjm!);
        }

        // Mettre à jour le total
        const total = filtered.length;
        this.total$ = new Observable(observer => observer.next(total));

        // Appliquer la pagination
        const start = (this.page - 1) * this.contratsParPage;
        return filtered.slice(start, start + this.contratsParPage);
      })
    );
  }

}