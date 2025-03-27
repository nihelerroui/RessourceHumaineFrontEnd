import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { Observable } from "rxjs";
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

  token: string | null = null;
  contratFileUrl: string | null = null;
  modalRef: BsModalRef | null = null;

  @ViewChild('contratModal', { static: true }) contratModalTemplate!: TemplateRef<any>; // ✅ Important

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get("token");
    if (this.token) {
      this.store.dispatch(ContratActions.loadContratsClientByToken({ token: this.token }));
    }
  }

  trackById(index: number, item: ContratClient): number {
    return item.contratClientId;
  }

  visualiserContrat(contrat: ContratClient): void {
    this.contratFileUrl = contrat.filePath
      ? `http://localhost:8089/contratsClient/fichier/${contrat.filePath}`
      : null;

    this.modalRef = this.modalService.show(this.contratModalTemplate, {
      class: 'modal-lg'
    });
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