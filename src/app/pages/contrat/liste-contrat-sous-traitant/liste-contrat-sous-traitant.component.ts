import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { combineLatest, map, Observable } from "rxjs";
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
  contratsParPage = 5;
  page = 1;
  contratsPagination$: Observable<ContratSousTraitant[]> = new Observable();
  total$: Observable<number> = new Observable();

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
  //pagination
  updatePagination() {
    this.contratsPagination$ = combineLatest([this.contrats$]).pipe(
      map(([contrats]) => {
        const start = (this.page - 1) * this.contratsParPage;
        return contrats.slice(start, start + this.contratsParPage);
      })
    );
  }
  //Charger la liste des contrats
  loadContrats() {
    this.store.dispatch(ContratActions.loadContracts());
  }
  //commentaires
  ouvrirCommentaireContrat(contrat: ContratSousTraitant): void {
    const emailAdmin = 'admin@featway.com';

    this.modalRef = this.modalService.show(CommentContratModalComponent, {
      initialState: {
        contratId: contrat.contratId,
        contrat: contrat,
        isAdminMode: true,
        currentUserEmail: emailAdmin
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
  searchContrat() {
    const filters = {
      statutContrat: this.selectedStatut || null,
      dateDebut: this.dateDebut || null,
      dateFin: this.dateFin || null,
      minTjm: this.minTjm !== null ? this.minTjm : null,
      maxTjm: this.maxTjm !== null ? this.maxTjm : null
    };
    this.store.dispatch(ContratActions.searchContracts({ filters }));
    this.updatePagination();
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
