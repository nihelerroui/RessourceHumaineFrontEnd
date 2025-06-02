import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { map, Observable } from "rxjs";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  ContratSousTraitant,
  StatutContrat,
} from "../../../models/contrat.models";
import * as ContratActions from "../../../store/contratSousTraitant/contrat.actions";
import { selectAllContracts } from "../../../store/contratSousTraitant/contrat-selector";

import Swal from "sweetalert2";
import { ContratService } from "../../../core/services/contrat.service";
import { CommentContratComponent } from "../../comment-contratClient/comment-contrat-list/comment-contrat.component";

@Component({
  selector: "app-contrat-sous-traitant",
  templateUrl: "./contrat-sous-traitant.component.html",
})
export class ContratSousTraitantComponent implements OnInit {
  modalRef?: BsModalRef;
  
  contratsPagination$: Observable<ContratSousTraitant[]> = new Observable();
  total$: Observable<number> = new Observable();
  selectedFile: File | null = null;
  fileName: string = "Aucun fichier sélectionné";
  breadCrumbItems: Array<{}>;
  contratForm!: FormGroup;
  submitted: boolean = false;
  contrats: any[] = [];
  contrats$: Observable<ContratSousTraitant[]>;
  selectedContratId: number | null = null;
  fileError: boolean = false;
  fileSelected: boolean = false;
  
  page = 1;
  contratsParPage = 5;
  filteredContrats: ContratSousTraitant[] = [];
  paginatedContrats: ContratSousTraitant[] = [];
  allContrats: ContratSousTraitant[] = [];

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
    this.contrats$.subscribe(contrats => {
  console.log("📦 Données reçues par le store :", contrats);
  this.allContrats = contrats;
  this.filterContrats();
});

    this.statutContrats = Object.values(StatutContrat);
  
    this.total$ = this.contrats$.pipe(map(contrats => contrats.length)); 
    
  
    setTimeout(() => {
      this.checkFormValidity();
    }, 500);
  }
  
  //Charger la liste des contrats
  loadContrats() {
    const consultantId = 1; 
    this.store.dispatch(ContratActions.loadContractsByConsultant({ consultantId }));
  }
  checkFormValidity() {
    console.log("Formulaire valide :", this.contratForm.valid, "Fichier sélectionné :", this.fileSelected);
  }
  
  //initialiser le formulaire
  initForm() {
    this.contratForm = this.formBuilder.group({
      tjm: ['', [Validators.required, Validators.min(1)]], 
      dateDebut: ['', Validators.required], 
      dateFin: ['', Validators.required],
      conditionsFac: ['', [Validators.minLength(10)]]
    }, {
      validator: this.validateDates
    });
    console.log("✅ Formulaire initialisé :", this.contratForm);
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
        this.fileSelected = true;
      } else {
        this.selectedFile = null;
        this.fileName = "Aucun fichier sélectionné";
        this.fileError = true;
        this.fileSelected = false;
      }
    }
  
    console.log("Fichier sélectionné ?", this.fileSelected);
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
        contrat.contratId = this.selectedContratId;
        console.log("Mise à jour du contrat :", contrat);
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
        this.store.dispatch(ContratActions.addContract({ contrat, fichier: this.selectedFile }));
        Swal.fire({
          title: "Succès !",
          text: "Le contrat a été ajouté avec succès.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
      if (this.modalRef) {
        this.modalRef.hide();
      }

      this.contratForm.reset();
      this.fileName = "Aucun fichier sélectionné";
      this.selectedFile = null;
      this.selectedContratId = null;
    } else {
      Swal.fire({
        title: "Erreur",
        text: "Veuillez remplir tous les champs obligatoires correctement.",
        icon: "error",
        confirmButtonText: "OK",
      });
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
  filterContrats() {
    this.filteredContrats = this.allContrats.filter(c =>
        (!this.selectedStatut || c.statutContrat === this.selectedStatut) &&
        (!this.dateDebut || c.dateDebut === this.dateDebut) &&
        (!this.dateFin || c.dateFin === this.dateFin) &&
        (!this.minTjm || c.tjm >= this.minTjm) &&
        (!this.maxTjm || c.tjm <= this.maxTjm)
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
        this.dateDebut = '';
        this.dateFin = '';
        this.minTjm = 0;
        this.maxTjm = 0;
        this.page = 1;
        this.loadContrats();
      }
  
  ouvrirCommentaireContrat(contrat: ContratSousTraitant): void {
    const emailSousTraitant = contrat.consultant?.user?.email || 'consultant@featway.com';
  
    this.modalRef = this.modalService.show(CommentContratComponent, {
      initialState: {
        contratId: contrat.contratId,
        contrat: contrat,
        currentUserEmail: emailSousTraitant
      },
      class: "modal-lg",
    });
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