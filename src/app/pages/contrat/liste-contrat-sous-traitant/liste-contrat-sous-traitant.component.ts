import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  ContratSousTraitant,
  StatutContrat,
} from "../../../models/contrat.models";
import * as ContratActions from "../../../store/contrat/contrat.actions";
import { selectAllContracts } from "../../../store/contrat/contrat-selector";

import Swal from "sweetalert2";
import { ContratService } from "../../../core/services/contrat.service";
import { CommentContratModalComponent } from "../comment-contrat-modal/comment-contrat-modal.component";

@Component({
  selector: "app-liste-contrat-sous-traitant",
  templateUrl: "./liste-contrat-sous-traitant.component.html",
})
export class ListeContratSousTraitantComponent {
  modalRef?: BsModalRef;
  page: number = 1;
  selectedFile: File | null = null;
  fileName: string = "Aucun fichier sélectionné";
  breadCrumbItems: Array<{}>;
  contratForm!: FormGroup;
  submitted: boolean = false;
  contrats: any[] = [];
  filteredContrats: any[] = [];
  contrats$: Observable<ContratSousTraitant[]>;
  selectedContratId: number | null = null;
  fileError: boolean = false;
  fileSelected: boolean = false;
  // Critères de recherche
  searchTerm: string = "";
  selectedStatut: string = "";
  dateDebut: string = "";
  dateFin: string = "";
  minTjm: number | null = null;
  maxTjm: number | null = null;

  // Liste des statuts disponibles
  statutContrats: string[] = [];

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private contratService: ContratService,
    private store: Store
  ) {
    this.contrats$ = this.store.select(selectAllContracts);
  }
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Contrats" },
      { label: "Liste des Contrats", active: true },
    ];
    this.loadContrats();
    this.statutContrats = Object.values(StatutContrat);
  }

  //Charger la liste des contrats
  loadContrats() {
    this.store.dispatch(ContratActions.loadContracts());
  }
  //commentaires
  ouvrirCommentaireContrat(contrat: ContratSousTraitant): void {
    this.modalRef = this.modalService.show(CommentContratModalComponent, {
      initialState: {
        contratId: contrat.contratId,
        contrat: contrat,
        isAdminMode: true,
      },
      class: "modal-lg",
    });
  }
  //téléchargement de fichier
  downloadContrat(id: number) {
    this.contratService.downloadContrat(id).subscribe(
      (file: Blob) => {
        const a = document.createElement("a");
        const objectUrl = URL.createObjectURL(file);
        a.href = objectUrl;
        a.download = `contrat_${id}.pdf`;
        a.click();
        URL.revokeObjectURL(objectUrl);
      },
      (error) => {
        console.error("Erreur lors du téléchargement du contrat", error);
        Swal.fire("Erreur", "Impossible de télécharger le contrat.", "error");
      }
    );
  }
  modifierStatutContrat(
    contrat: ContratSousTraitant,
    nouveauStatut: StatutContrat
  ): void {
    const contratModifie: ContratSousTraitant = {
      ...contrat,
      statutContrat: nouveauStatut,
      consultant: {
        consultantId: contrat.consultant?.consultantId!,
      },
    };
    this.contratService.update(contratModifie).subscribe({
      next: () => {
        Swal.fire(
          "Succès",
          "Le statut du contrat a été mis à jour.",
          "success"
        );
        this.loadContrats();
      },
      error: () => {
        Swal.fire(
          "Erreur",
          "Erreur lors de la mise à jour du contrat.",
          "error"
        );
      },
    });
  }
}
