import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  ContratSousTraitant,
  StatutContrat,
} from "../../../store/contrat/contrat.models";
import * as ContratActions from "../../../store/contrat/contrat.actions";
import { selectAllContracts } from "../../../store/contrat/contrat-selector";

import Swal from "sweetalert2";
import { ContratService } from "../../../core/services/contrat.service";

@Component({
  selector: "app-contrat-sous-traitant",
  templateUrl: "./contrat-sous-traitant.component.html",
  styleUrls: ["./contrat-sous-traitant.component.css"],
})
export class ContratSousTraitantComponent implements OnInit {
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
    this.initForm();
    this.loadContrats();
    this.statutContrats = Object.values(StatutContrat);
  }
  //Charger la liste des contrats
  loadContrats() {
    this.store.dispatch(ContratActions.loadContracts());
  }
  //initialiser le formulaire
  initForm() {
    this.contratForm = this.formBuilder.group({
      tjm: ['', [Validators.required, Validators.min(1)]], 
      dateDebut: ['', Validators.required], 
      dateFin: ['', Validators.required],
      conditionsFac: ['', [Validators.required, Validators.minLength(10)]],
      statutContrat: ['', Validators.required]
    }, {
      validator: this.validateDates
    });
  }
  
  //Vérifie que la date de fin est après la date de début
  validateDates(group: FormGroup) {
    const dateDebut = group.get('dateDebut')?.value;
    const dateFin = group.get('dateFin')?.value;
    return dateDebut && dateFin && dateFin < dateDebut
      ? { invalidDateRange: true }
      : null;
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

  //Ouvrir la modale d'ajout
  openModal(template: any) {
    this.submitted = false;
    this.modalRef = this.modalService.show(template, { class: "modal-md" });
  }
  //Récupérer les valeurs du formulaire
  get form() {
    return this.contratForm.controls;
  }
  //gérer la sélection de fichier
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const allowedExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension && allowedExtensions.includes(fileExtension)) {
        this.selectedFile = file;
        this.fileName = file.name;
        this.fileError = false;
        this.fileSelected = true; // Fichier sélectionné correctement
      } else {
        this.selectedFile = null;
        this.fileName = "Aucun fichier sélectionné";
        this.fileError = true;
        this.fileSelected = false; // Fichier invalide
      }
    }
  }
  //Ajouter ou modifier un contrat
  saveContrat() {
    if (this.contratForm.valid) {
      const contrat: ContratSousTraitant = {
        ...this.contratForm.value,
        consultant: { consultantId: 1 },
        statutContrat: "EN_ATTENTE",
      };
      if (this.selectedContratId) {
        //Modification du contrat
        contrat.contratId = this.selectedContratId;
        console.log("🔄 Mise à jour du contrat :", contrat);
        this.store.dispatch(
          ContratActions.updateContract({
            id: this.selectedContratId,
            contrat,
            fichier: this.selectedFile,
          })
        );
      } else {
        //Ajout d'un nouveau contrat
        console.log("🆕 Ajout d'un contrat :", contrat);
        this.store.dispatch(
          ContratActions.addContract({ contrat, fichier: this.selectedFile })
        );
      }
      //Fermer la modal après l'ajout/modification
      if (this.modalRef) {
        this.modalRef.hide();
      }

      //Réinitialiser le formulaire
      this.contratForm.reset();
      this.fileName = "Aucun fichier sélectionné";
      this.selectedFile = null;
      this.selectedContratId = null;
    }
  }
  //Modifier un contrat
  editContrat(contrat: ContratSousTraitant, template: any) {
    this.submitted = false;
    this.modalRef = this.modalService.show(template, { class: "modal-md" });
    this.contratForm.patchValue({
      contratId: contrat.contratId,
      tjm: contrat.tjm,
      dateDebut: contrat.dateDebut,
      dateFin: contrat.dateFin,
      conditionsFac: contrat.conditionsFac,
      statutContrat: contrat.statutContrat,
    });
    if (contrat.filePath) {
      this.fileName = contrat.filePath.split('/').pop() || "Aucun fichier sélectionné";
    } else {
      this.fileName = "Aucun fichier sélectionné";
    }
    this.selectedContratId = contrat.contratId;
  }
  //Supprimer un contrat
  deleteContrat(id: number) {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Une fois supprimé, ce contrat ne pourra pas être récupéré.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.store.dispatch(ContratActions.deleteContract({ id }));
        Swal.fire("Supprimé!", "Le contrat a été supprimé.", "success");
      }
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
  // Recherche avancée des contrats
  searchContrat() {
    const filters = {
      statutContrat: this.selectedStatut || null,
      dateDebut: this.dateDebut || null,
      dateFin: this.dateFin || null,
      minTjm: this.minTjm !== null ? this.minTjm : null,
      maxTjm: this.maxTjm !== null ? this.maxTjm : null
    };
  
    this.store.dispatch(ContratActions.searchContracts({ filters }));
  }
  
}
