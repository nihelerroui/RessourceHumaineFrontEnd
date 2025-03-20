import { Component, OnInit, TemplateRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { Tresorie } from 'src/app/models/tresorie.model';
import { augmenterSoldeActuel, loadTresorie, setSoldeInitial } from 'src/app/store/tresorie/tresorie.actions';
import { TresorieState } from 'src/app/store/tresorie/tresorie.reducer';
import { selectPeutAugmenterSolde, selectTresorie, selectTresorieError, selectTresorieLoading } from 'src/app/store/tresorie/tresorie.selectors';

@Component({
  selector: 'app-tresorie',
  templateUrl: './tresorie.component.html',
  styleUrls: ['./tresorie.component.css']
})
export class TresorieComponent implements OnInit {

  breadCrumbItems!: Array<{ label: string; path?: string; active?: boolean }>;
  tresorie$: Observable<Tresorie | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  peutAugmenterSolde$: Observable<boolean>; // ✅ Vérifie si on peut augmenter le solde
  montantInitial: number = 0;
  montantAjout: number = 0; // ✅ Montant à ajouter
  societeId: number = 1; // ✅ ID de la société
  modalAction: string = '';
  modalRef?: BsModalRef;
  submitted: boolean = false;


  constructor(private modalService: BsModalService, private store: Store<{ tresorie: TresorieState }>) {
    this.tresorie$ = this.store.select(selectTresorie);
    this.loading$ = this.store.select(selectTresorieLoading);
    this.error$ = this.store.select(selectTresorieError);
    this.peutAugmenterSolde$ = this.store.select(selectPeutAugmenterSolde);
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Dashboard', path: '/' },
      { label: 'Trésorie', active: true }
    ];
    this.store.dispatch(loadTresorie({ societeId: this.societeId }));


  }

  openModal(template: TemplateRef<any>, action: string) {
    this.modalAction = action;
    this.montantAjout = 0; // Réinitialiser le montant
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }


  closeModal() {
    if (this.modalRef) {
      this.modalRef.hide();
      this.modalRef = undefined;
    }
  }


  // ✅ Exécuter l'action correcte selon l'état du modal
  validerAction() {
    if (this.montantAjout <= 0) {
      alert("Veuillez entrer un montant valide !");
      return;
    }

    if (this.modalAction === 'initialiser') {
      this.initialiserSolde();
    } else {
      this.augmenterSolde();
    }
    this.closeModal(); 
  }


  initialiserSolde() {
    if (this.montantAjout <= 0) {  // ✅ Vérifie la bonne variable
      alert("Le montant doit être supérieur à 0 !");
      return;
    }
    this.store.dispatch(setSoldeInitial({ societeId: this.societeId, montant: this.montantAjout }));
    this.closeModal();  // ✅ Fermer le modal après action
  }
  

  augmenterSolde() {
    if (this.montantAjout <= 0) {
      alert("Veuillez entrer un montant valide !");
      return;
    }

    // 🛠 Déclencher l'action pour augmenter le solde
    this.store.dispatch(augmenterSoldeActuel({ societeId: this.societeId, montant: this.montantAjout }));

    // ✅ Attendre la mise à jour et rafraîchir la trésorerie après augmentation
    this.store.select(selectTresorie).subscribe({
      next: (tresorie) => {
        if (tresorie) {
          this.store.dispatch(loadTresorie({ societeId: this.societeId })); // Rafraîchir les données
        }
      }
    });

    // ✅ Réinitialiser le champ après mise à jour
    this.montantAjout = 0;


  }

}
