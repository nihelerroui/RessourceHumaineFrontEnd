import { Component, TemplateRef, ViewChild, OnInit } from "@angular/core";
import {FormGroup } from "@angular/forms";
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
} from "../../../store/contratClient/contratClient-selector";
import {
  loadContratsClient,
  updateContratClient,
} from "src/app/store/contratClient/contratClient.actions";
import {SafeResourceUrl } from "@angular/platform-browser";
import { CommentContratModalComponent } from "../../contrat/comment-contrat-modal/comment-contrat-modal.component";

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
  submitted: boolean = false;
  fileName: string = "Aucun fichier sélectionné";
  fileSelected: boolean = false;
  contratFileUrl: SafeResourceUrl | null = null;
  contratsParPage = 5;
  page = 1;
  contratsPagination$: Observable<ContratClient[]> = new Observable();
  total$: Observable<number> = new Observable();
  @ViewChild("contratModal") contratModal!: TemplateRef<any>;

  constructor(private modalService: BsModalService, private store: Store) {
    this.contratsClients$ = this.store.select(selectAllContratsClient);
    this.loading$ = this.store.select(selectContratsClientLoading);
  }

  ngOnInit(): void {
    console.log("🚀 Dispatch de loadContratsClient");
    this.store.dispatch(loadContratsClient());

    this.contratsClients$.subscribe((contrats) => {
      console.log("✅ Contrats récupérés du store:", contrats);
    });
    this.total$ = this.contratsClients$.pipe(map(contrats => contrats.length));
    this.updatePagination();
  }
  //pagination
    updatePagination() {
      this.contratsPagination$ = combineLatest([this.contratsClients$]).pipe(
        map(([contratsClients]) => {
          const start = (this.page - 1) * this.contratsParPage;
          return contratsClients.slice(start, start + this.contratsParPage);
        })
      );
    }

  openModal(template: any) {
    this.submitted = false;
    this.modalRef = this.modalService.show(template, { class: "modal-md" });
  }

  //Modifier le statut du contrat (Valider ou Rejeter)
  modifierStatutContrat(
    contrat: ContratClient,
    nouveauStatut: StatutContrat
  ): void {
    if (!contrat.contratClientId) {
      console.error("❌ Erreur : L'ID du contrat est NULL !");
      return;
    }
  
    const contratModifie: ContratClient = {
      ...contrat,
      statutContrat: nouveauStatut,
      client: {
        clientId: contrat.client?.clientId!
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
    const fileUrl = `http://localhost:8089/spring/contratsClient/fichier/${fileName}`;

    console.log("📄 Ouverture du fichier :", fileUrl);
    window.open(fileUrl, "_blank");
  }
  ouvrirCommentaireContrat(contrat: ContratClient): void {
    const emailAdmin = 'admin@featway.com';
    this.modalRef = this.modalService.show(CommentContratModalComponent, {
      initialState: {
        contratClientId: contrat.contratClientId,
        contrat: contrat,
        isAdminMode: true,
        currentUserEmail: emailAdmin 
      },
      class: "modal-lg",
    });
  }
}
