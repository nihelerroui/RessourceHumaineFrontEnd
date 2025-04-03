import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { combineLatest, map, Observable } from "rxjs";
import * as ContratActions from "../../../store/contratClient/contratClient.actions";
import {
  selectAllContratsClient,
  selectContratsClientLoading
} from "../../../store/contratClient/contratClient-selector";
import { ContratClient } from "src/app/models/contratClient.models";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { CommentContratModalComponent } from "../comment-contrat-modal/comment-contrat-modal.component";

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
    const fileUrl = `http://localhost:8089/spring/contratsClient/fichier/${fileName}`;

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

}