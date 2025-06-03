import { Component, TemplateRef, ViewChild, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Store } from "@ngrx/store";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { combineLatest, map, Observable } from "rxjs";
import {
  ContratClient,
  StatutContrat,
} from "src/app/models/contratClient.models";
import {
  selectAllContratsClient,
  selectContratsClientLoading,
  selectContratsClientSearchResults,
} from "../../../store/contratClient/contratClient-selector";
import {
  loadContratsClient,
  updateContratClient,
} from "src/app/store/contratClient/contratClient.actions";
import { SafeResourceUrl } from "@angular/platform-browser";
//import { CommentContratClientComponent } from "../../comment-contratClient/comment-contrat-list/comment-contrat.component";
import { environment } from "src/environments/environment";
import { CommentContratComponent } from "../../comment-contratClient/comment-contrat-list/comment-contrat.component";

@Component({
  selector: "app-contrat-client-admin",
  templateUrl: "./contrat-client.component.html",
})
export class ContratClientAdminComponent implements OnInit {
  contratsClients$: Observable<ContratClient[]>;
  breadCrumbItems: Array<{}>;
  loading$: Observable<boolean>;
  StatutContrat = StatutContrat;
  modalRef?: BsModalRef;
  contratForm!: FormGroup;
  contratFileUrl: SafeResourceUrl | null = null;
  // Critères de recherche
  searchTerm: string = "";
  selectedStatut: string = "";
  minTjm: number | null = null;
  maxTjm: number | null = null;
  //pagination
  contratsParPage = 5;
  page = 1;
  contratsPagination$: Observable<ContratClient[]> = new Observable();
  total$: Observable<number> = new Observable();
  @ViewChild("contratModal") contratModal!: TemplateRef<any>;
  statutContratValues = Object.values(StatutContrat);


  constructor(private modalService: BsModalService, private store: Store) {
    this.contratsClients$ = this.store.select(selectAllContratsClient);
    this.loading$ = this.store.select(selectContratsClientLoading);
  }

  ngOnInit(): void {
    console.log("Dispatch de loadContratsClient");
    this.store.dispatch(loadContratsClient());

    this.contratsClients$.subscribe((contrats) => {
      console.log("✅ Contrats récupérés du store:", contrats);
    });
    this.total$ = this.contratsClients$.pipe(map(contrats => contrats.length));
    this.updatePagination();
    this.store.select(selectAllContratsClient).subscribe(() => {
  this.updatePagination();
});

  }
  
  //pagination
  updatePagination() {
    this.contratsPagination$ = this.contratsClients$.pipe(
      map((contratsClients) => {
        const start = (this.page - 1) * this.contratsParPage;
        return contratsClients.slice(start, start + this.contratsParPage);
      })
    );
  }

  modifierStatutContrat(
    contrat: ContratClient,
    nouveauStatut: StatutContrat
  ): void {
    if (!contrat.contratClientId || !contrat.client?.clientId) {
      console.error("❌ Erreur : L'ID du contrat ou du client est manquant !");
      return;
    }

    const contratModifie: ContratClient = {
      ...contrat,
      statutContrat: nouveauStatut,
      client: {
        clientId: contrat.client.clientId
      }
    };

    this.store.dispatch(updateContratClient({ contrat: contratModifie }));
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

  ouvrirCommentaireContrat(contrat: ContratClient): void {
    const emailAdmin = 'admin@featway.com';
    this.modalRef = this.modalService.show(CommentContratComponent, {
      initialState: {
        contratClientId: contrat.contratClientId,
        contrat: contrat,
        isAdminMode: true,
        currentUserEmail: emailAdmin
      },
      class: "modal-lg",
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
        if (this.selectedStatut) {
          filtered = filtered.filter(c => c.statutContrat === this.selectedStatut);
        }
        if (this.minTjm !== null) {
          filtered = filtered.filter(c => c.tjm >= this.minTjm!);
        }
        if (this.maxTjm !== null) {
          filtered = filtered.filter(c => c.tjm <= this.maxTjm!);
        }
        const total = filtered.length;
        this.total$ = new Observable(observer => observer.next(total));
        const start = (this.page - 1) * this.contratsParPage;
        return filtered.slice(start, start + this.contratsParPage);
      })
    );
  }
}
