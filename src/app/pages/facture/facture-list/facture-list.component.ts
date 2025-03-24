import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { addFacture, deleteFacture, loadFactures, updateFacture } from 'src/app/store/Facture/facture.actions';
import { Facture } from 'src/app/models/facture.model';
import { selectFactureError, selectFactureList, selectFactureLoading } from 'src/app/store/Facture/facture.selectors';
import { StatutFacture } from 'src/app/models/statut-facture.enum';
import { TypeFacture } from 'src/app/models/type-facture.enum';
import { TypePaiement } from 'src/app/models/type-paiement.enum';
import { validerPaiement } from 'src/app/store/tresorie/tresorie.actions';
import Swal from 'sweetalert2';

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
  statutFactureOptions = Object.values(StatutFacture);
  typeFactureOptions = Object.values(TypeFacture);
  typePaiementOptions = Object.values(TypePaiement);

  filteredFactureList: Facture[] = [];
  paginatedFactureList: Facture[] = [];
  searchTerm: string = '';
  selectedStatutFacture: string = '';
  selectedTypeFacture: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 8;

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    public store: Store
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Dashboard', path: '/' },
      { label: 'Liste des Factures', active: true }
    ];

    // Déclencher l'action NgRx pour charger les factures
    this.store.dispatch(loadFactures());


    // Sélectionner les données depuis le store
    this.store.select(selectFactureList).subscribe(factures => {
      this.filteredFactureList = factures;
      this.pageChanged({ page: 1 }); // Initialisation pagination
    });
    this.loading$ = this.store.select(selectFactureLoading);
    this.error$ = this.store.select(selectFactureError);
// Initialisation du formulaire
this.factureForm = this.formBuilder.group({
  factureId: [''],
  designation: ['', [Validators.required, Validators.minLength(2)]],
  refFacture: ['', [Validators.required , Validators.minLength(3)]],
  montantTtc: [0, [Validators.required, Validators.min(0)]],
  dateEmmission: ['', Validators.required],
  statutFacture: ['', Validators.required],
  typeFacture: ['', Validators.required],
  typePaiement: ['', Validators.required]
  
});
}
/** 🔍 Filtrer la liste des factures */
filterFactures() {
  this.store.select(selectFactureList).subscribe(factures => {
    this.filteredFactureList = factures.filter(facture =>
      (facture.designation.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       facture.refFacture.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
      (this.selectedStatutFacture === '' || facture.statutFacture === this.selectedStatutFacture) &&
      (this.selectedTypeFacture === '' || facture.typeFacture === this.selectedTypeFacture)
    );
    this.pageChanged({ page: 1 });
  });
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

openModal(template: TemplateRef<any>) {
  this.submitted = false;
  this.modalRef = this.modalService.show(template, { class: 'modal-md' });
}

editDataGet(facture: Facture, template: TemplateRef<any>) {
  this.submitted = false;
  this.factureForm.patchValue({
    factureId: facture.factureId,
    designation: facture.designation,
    refFacture: facture.refFacture,
    montantTtc: facture.montantTtc,
    dateEmmission: facture.dateEmmission,
    statutFacture: facture.statutFacture,
    typeFacture: facture.typeFacture,
    statutPaiement: facture.statutPaiement,
    typePaiement: facture.typePaiement
  });

  this.modalRef = this.modalService.show(template, { class: 'modal-md' });
}


saveFacture() {
  if (this.factureForm.valid) {
    let factureData = this.factureForm.value;

    if (factureData.factureId) {
      this.store.dispatch(updateFacture({ facture: factureData }));
      Swal.fire({
        icon: 'success',
        title: 'Facture mise à jour avec succès !',
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      this.store.dispatch(addFacture({ facture: factureData }));
      Swal.fire({
        icon: 'success',
        title: 'Nouvelle facture ajoutée avec succès !',
        showConfirmButton: false,
        timer: 1500
      });
    }

    this.modalRef?.hide();
    this.factureForm.reset();
  }
}

/** ✅ Supprimer une facture avec confirmation */
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
      Swal.fire({
        icon: 'success',
        title: 'Facture supprimée avec succès !',
        showConfirmButton: false,
        timer: 1500
      });
    }
  });
}

/** ✅ Valider le paiement d'une facture */
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
      // 🛠 Déclencher l'action NgRx pour valider le paiement
      this.store.dispatch(validerPaiement({ factureId }));
      Swal.fire('Succès', 'Le paiement a été validé.', 'success');
    }
  });
}



}
