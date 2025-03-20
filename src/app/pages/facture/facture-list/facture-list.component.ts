import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { addFacture, deleteFacture, loadFactures, updateFacture } from 'src/app/store/facture/facture.actions';
import { Facture } from 'src/app/models/facture.model';
import { selectFactureError, selectFactureList, selectFactureLoading } from 'src/app/store/facture/facture.selectors';
import { TypeFacture } from 'src/app/models/type-facture.enum';
import { TypePaiement } from 'src/app/models/type-paiement.enum';
import { validerPaiement } from 'src/app/store/tresorie/tresorie.actions';
import Swal from 'sweetalert2';
import { StatutPaiement } from 'src/app/models/statut-paiement.enum';

@Component({
  selector: 'app-facture-list',
  templateUrl: './facture-list.component.html',
  styleUrls: ['./facture-list.component.css']
})
export class FactureListComponent implements OnInit {

  breadCrumbItems!: Array<{ label: string; path?: string; active?: boolean }>;
  factureList$: Observable<Facture[]>;
  loading$: Observable<boolean>;

  error$: Observable<string | null>;
  modalRef?: BsModalRef;
  factureForm!: FormGroup;

  submitted: boolean = false;
  typeFactureOptions = Object.values(TypeFacture);
  typePaiementOptions = Object.values(TypePaiement);
  statutPaiementOptions = Object.values(StatutPaiement);
  filteredTypePaiementOptions: TypePaiement[] = [];

  filteredFactureList: Facture[] = [];
  paginatedFactureList: Facture[] = [];
  searchTerm: string = '';
  selectedStatutPaiement: string = '';
  selectedTypeFacture: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 8;

  selectedFacture!: Facture | null;

  factures: Facture[] = [];

  selectedFile: File | null = null;



  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    public store: Store
  ) {
    this.factureList$ = this.store.select(selectFactureList);
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Dashboard', path: '/' },
      { label: 'Liste des Factures', active: true }
    ];

    // Charger les factures
    this.store.dispatch(loadFactures());

    // Récupérer les factures depuis le store
    this.factureList$.subscribe(factures => {
      this.factures = factures;
      this.filteredFactureList = factures;
      this.pageChanged({ page: 1 });
    });

    this.loading$ = this.store.select(selectFactureLoading);
    this.error$ = this.store.select(selectFactureError);

    // Initialisation du formulaire avec les validations
    this.factureForm = this.formBuilder.group({
      factureId: [''],
      designation: ['', [Validators.required, Validators.minLength(2)]],
      refFacture: ['', [Validators.required, Validators.minLength(3)]],
      montantTtc: [0, [Validators.required, Validators.min(0)]],
      dateEmmission: ['', [Validators.required, this.dateEmmissionValidator.bind(this)]],
      typeFacture: ['', Validators.required],
      typePaiement: ['', Validators.required],
    });

    this.factureForm.get('typeFacture')?.valueChanges.subscribe(() => {
      this.updatePaiementOptions();
    });
  
    // Initialiser les options de paiement au chargement
    this.updatePaiementOptions();
  }

  /** ✅ Vérifier si la date d’émission est <= aujourd’hui */
  dateEmmissionValidator(control: any) {
    const dateValue = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Supprimer l'heure pour comparer uniquement la date

    return dateValue <= today ? null : { invalidDate: true };
  }

  /** ✅ Vérifier si la référence facture est unique */
  isRefFactureUnique(ref: string, factureId?: number): boolean {
    return !this.factures.some(facture => facture.refFacture === ref && facture.factureId !== factureId);
  }

  /** 🔍 Filtrer la liste des factures */
  filterFactures() {
    this.filteredFactureList = this.factures.filter(facture =>
      (facture.designation.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       facture.refFacture.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
      (this.selectedStatutPaiement === '' || facture.statutPaiement === this.selectedStatutPaiement) &&
      (this.selectedTypeFacture === '' || facture.typeFacture === this.selectedTypeFacture)
    );
    this.pageChanged({ page: 1 });
  }

  /** 📌 Pagination */
  pageChanged(event: any) {
    this.currentPage = event.page;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedFactureList = this.filteredFactureList.slice(startIndex, startIndex + this.itemsPerPage);
  }

  /** 🔄 Rafraîchir la liste */
  refreshList() {
    this.store.dispatch(loadFactures());
  }

  /** ✅ Ouvrir le modal en mode ajout */
  openModalAdd(template: TemplateRef<any>) {
    this.factureForm.reset();
    this.factureForm.patchValue({ factureId: null });
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  /** ✅ Ouvrir le modal en mode modification */
  openModalEdit(facture: Facture, template: TemplateRef<any>) {
    this.factureForm.patchValue(facture);
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  saveFacture() {
    if (this.factureForm.valid) {
      let factureData = this.factureForm.value;
      factureData.consultant = { consultantId: 1 };

      if (!factureData.consultant || !factureData.consultant.consultantId) {
        console.error("Erreur : consultantId manquant !");
        Swal.fire("Erreur", "Veuillez sélectionner un consultant.", "error");
        return;
      }
  
      if (!factureData.statutPaiement) {
        factureData.statutPaiement = 'NON_PAYÉE';
      }
  
      // ✅ Vérification de l'unicité de la référence facture
      if (!this.isRefFactureUnique(factureData.refFacture, factureData.factureId)) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'La référence de la facture existe déjà !',
          confirmButtonText: 'OK'
        });
        return;
      }
  
      // ✅ Construire correctement FormData
      const formData = new FormData();
      formData.append('facture', JSON.stringify(factureData)); // ✅ Envoi en tant que string et non fichier
  
      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }
  
      // ✅ Vérifier que FormData contient bien les données avant l'envoi
      console.log("FormData contenu :");
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });
  
      if (factureData.factureId) {
        this.store.dispatch(updateFacture({ facture: formData })); // ✅ Corrigé
        Swal.fire({
          icon: 'success',
          title: 'Facture mise à jour avec succès !',
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        this.store.dispatch(addFacture({ facture: formData })); // ✅ Corrigé
        Swal.fire({
          icon: 'success',
          title: 'Nouvelle facture ajoutée avec succès !',
          showConfirmButton: false,
          timer: 1500
        });
      }
  
      this.modalRef?.hide();
      this.factureForm.reset();
      this.selectedFile = null; // Réinitialiser le fichier
    }
  }
  
  

  onDeleteFacture(factureId: number) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.store.dispatch(deleteFacture({ factureId }));
        Swal.fire('Succès', 'Facture supprimée avec succès.', 'success');
      }
    });
  }

  openDetailsModal(facture: Facture, template: TemplateRef<any>) {
    console.log("Détails de la facture :", facture);
    this.selectedFacture = facture;
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

validerPaiement(factureId: number) {
  Swal.fire({
    title: 'Confirmer le paiement ?',
    text: "Cette action est irréversible.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, valider !',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      this.store.dispatch(validerPaiement({ factureId }));


      Swal.fire('Succès', 'Le paiement a été validé.', 'success');
      this.store.dispatch(loadFactures());
    }
  });
}

onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    const allowedTypes = ['application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: 'error',
        title: 'Format invalide',
        text: 'Seuls les fichiers PDF sont autorisés.',
        confirmButtonText: 'OK'
      });
      return;
    }
    this.selectedFile = file;
  }
}

openFacture(filePath: string): void {
  const fileUrl = 'http://localhost:8089/spring/factures/files/' + this.getFileName(filePath) + '?disposition=inline';
  window.open(fileUrl, '_blank'); // 📄 Ouvre dans un nouvel onglet
}


/** ✅ Récupère uniquement le nom du fichier */
getFileName(filePath: string): string {
  return filePath.split('\\').pop() || ''; // Extrait le nom du fichier depuis le chemin
}

downloadFacture(filePath: string): void {
  if (!filePath) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Aucun fichier disponible pour cette facture.',
      confirmButtonText: 'OK'
    });
    return;
  }

  const fileUrl = 'http://localhost:8089/spring/factures/files/' + this.getFileName(filePath) + '?disposition=attachment';
  window.open(fileUrl, '_blank'); // 📥 Télécharge le fichier
}


updatePaiementOptions() {
  const selectedTypeFacture = this.factureForm.get('typeFacture')?.value;
  
  if (selectedTypeFacture === 'SOUSTRAITANT') {
    this.filteredTypePaiementOptions = [TypePaiement.VIREMENT_BANCAIRE, TypePaiement.CHEQUE];
  } else {
    this.filteredTypePaiementOptions = Object.values(TypePaiement);
  }

  // Réinitialiser la valeur de typePaiement pour afficher "Sélectionner un type de paiement"
  this.factureForm.patchValue({ typePaiement: '' });
}



}
