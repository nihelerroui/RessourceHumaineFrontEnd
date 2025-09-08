import { Component, TemplateRef, ViewChild, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Store } from "@ngrx/store";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { map, Observable } from "rxjs";
import { ContratClient, StatutContrat } from "src/app/models/contratClient.models";
import { selectAllContratsClient, selectContratsClientLoading } from "../../../store/contratClient/contratClient-selector";
import { loadContratsClient, updateContratClient } from "src/app/store/contratClient/contratClient.actions";
import { SafeResourceUrl } from "@angular/platform-browser";
import { environment } from "src/environments/environment";
import { CommentContratComponent } from "../../comment-contratClient/comment-contrat-list/comment-contrat.component";
import { selectAllSocietes } from "src/app/store/Authentication/authentication-selector";
import * as AuthActions from "src/app/store/Authentication/authentication.actions";

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
  page = 1;
  contratsParPage = 5;
  filteredContrats: ContratClient[] = [];
  paginatedContrats: ContratClient[] = [];
  allContrats: ContratClient[] = [];
  total$: Observable<number> = new Observable();

  selectedSocieteId: number | "" = "";
  consultantSocieteId: number = 0;
  adminSocietes$: Observable<any[]> = this.store.select(selectAllSocietes);

  currentUserEmail: string = '';

  role : string ="";

  @ViewChild("contratModal") contratModal!: TemplateRef<any>;

  // ===== AJOUTS pour la confirmation =====
  @ViewChild("confirmModal") confirmModal!: TemplateRef<any>;
  contratEnCours: ContratClient | null = null;
  nouveauStatutEnCours: StatutContrat | null = null;
  isUpdating = false;

  statutContratValues = Object.values(StatutContrat);


  constructor(private modalService: BsModalService, private store: Store) {
    this.contratsClients$ = this.store.select(selectAllContratsClient);
    this.loading$ = this.store.select(selectContratsClientLoading);
  }

  ngOnInit(): void {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser") || "{}");
    this.currentUserEmail = currentUser.user.email || '';
    this.consultantSocieteId = currentUser.societe?.societeId;
    this.selectedSocieteId = this.consultantSocieteId;
    this.role = currentUser.user?.role;
    

    this.store.dispatch(loadContratsClient());
    this.store.dispatch(AuthActions.loadAdminSocietes());

    this.total$ = this.contratsClients$.pipe(map(contrats => contrats.length));

    this.contratsClients$.subscribe(allContracts => {
      const filtered = allContracts.filter(contract =>
        this.selectedSocieteId
          ? contract.client?.societe?.societeId === +this.selectedSocieteId
          : contract.client?.societe?.societeId === this.consultantSocieteId
      );
      this.allContrats = filtered;
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
      (!this.maxTjm || c.tjm <= this.maxTjm) &&
      (!this.selectedSocieteId || c.client.societe.societeId === +this.selectedSocieteId)
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
    this.selectedSocieteId = this.consultantSocieteId;
    this.page = 1;
    this.store.dispatch(loadContratsClient());
  }
  demanderConfirmation(contrat: ContratClient, nouveauStatut: StatutContrat): void {
    // si le statut demandé est identique, pas d'action
    if (contrat.statutContrat === nouveauStatut) {
      return;
    }
    this.contratEnCours = contrat;
    this.nouveauStatutEnCours = nouveauStatut;
    this.modalRef = this.modalService.show(this.confirmModal, { class: 'modal-sm' });
  }

  confirmerChangementStatut(): void {
    if (!this.contratEnCours || !this.nouveauStatutEnCours) return;

    this.isUpdating = true;

    // délégué à la méthode existante
    this.modifierStatutContrat(this.contratEnCours, this.nouveauStatutEnCours);

    // on ferme tout de suite (si tu veux attendre la réussite NgRx, branche-toi sur l'effet de succès)
    this.isUpdating = false;
    this.modalRef?.hide();

    // nettoyage
    this.contratEnCours = null;
    this.nouveauStatutEnCours = null;
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
    this.modalRef = this.modalService.show(CommentContratComponent, {
      initialState: {
        contratClientId: contrat.contratClientId,
        contrat: contrat,
        currentUserEmail: this.currentUserEmail,
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
}
