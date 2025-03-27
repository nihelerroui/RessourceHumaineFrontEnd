import { Component, OnInit, TemplateRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { Observable } from "rxjs";
import * as ContratActions from "../../../store/contratClient/contratClient.actions";
import { selectAllContratsClient, selectContratsClientLoading } from "../../../store/contratClient/contratClient-selector";
import { ContratClient } from "src/app/models/contratClient.models";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { CommentContratModalComponent } from "../comment-contrat-modal/comment-contrat-modal.component";

@Component({
  selector: "app-contrats-client-list",
  templateUrl: "./contrats-client-list.component.html"
})
export class ContratsClientListComponent implements OnInit {
  contratsClients$: Observable<ContratClient[]> = this.store.pipe(select(selectAllContratsClient));
  loading$: Observable<boolean> ;
  token: string | null = null;
  modalRef?: BsModalRef;
  contratFileUrl: string | null = null;
  breadCrumbItems: Array<{}>;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    // Récupérer le token depuis l'URL
      this.token = this.route.snapshot.paramMap.get("token");
      this.store.dispatch(ContratActions.loadContratsClientByToken({ token: this.token }));
      
      this.loading$ = this.store.select(selectContratsClientLoading);
      this.loading$.subscribe(value => console.log('🔥 Chargement en cours ?', value));


  }
  trackById(index: number, item: ContratClient): number {
    return item.contratClientId;
  }
  

  // Fonction pour afficher un contrat dans le modal
  visualiserContrat(contrat: ContratClient, template: TemplateRef<any>) {
    if (contrat.filePath) {
      this.contratFileUrl = `http://localhost:8089/contratsClient/fichier/${contrat.filePath}`;
      this.modalRef = this.modalService.show(template);
    } else {
      console.warn("⚠️ Aucun fichier disponible pour ce contrat.");
      this.contratFileUrl = null;
      this.modalRef = this.modalService.show(template);
    }
  }
  ouvrirCommentairesClient(contrat: ContratClient): void {
    if (!this.token) return;

    this.modalRef = this.modalService.show(CommentContratModalComponent, {
      initialState: {
        contrat: contrat,
        contratClientId: contrat.contratClientId,
        token: this.token,
        isClientMode: true
      },
      class: "modal-lg"
    });
  }
}
