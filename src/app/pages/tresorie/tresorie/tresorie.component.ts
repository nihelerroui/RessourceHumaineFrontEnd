import { Component, OnInit, TemplateRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { Tresorie } from 'src/app/models/tresorie.model';
import { selectAllSocietes } from 'src/app/store/Authentication/authentication-selector';
import * as AuthActions from "src/app/store/Authentication/authentication.actions";
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
  peutAugmenterSolde$: Observable<boolean>; 
  montantInitial: number = 0;
  montantAjout: number = 0; 
  societeId!: number;
  modalAction: string = '';
  modalRef?: BsModalRef;
  submitted: boolean = false;

  adminSocietes: any[] = [];
selectedSocieteId!: number;



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

  const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
  const societe = currentUser?.societe;

  if (!societe || !societe.societeId) {
    alert("Impossible de récupérer la société.");
    return;
  }

  this.societeId = societe.societeId;
  

  this.store.dispatch(AuthActions.loadAdminSocietes());

  this.store.select(selectAllSocietes).subscribe(societes => {
    this.adminSocietes = societes;
    if (!this.selectedSocieteId) {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    const societe = currentUser?.societe;
    if (societe?.societeId) {
      this.selectedSocieteId = societe.societeId;
      this.onSocieteChange(); 
    }
  }
  });

  
}

onSocieteChange() {
  this.societeId = this.selectedSocieteId;
  this.store.dispatch(loadTresorie({ societeId: this.societeId }));
}



  

  openModal(template: TemplateRef<any>, action: string) {
    this.modalAction = action;
    this.montantAjout = 0;
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }


  closeModal() {
    if (this.modalRef) {
      this.modalRef.hide();
      this.modalRef = undefined;
    }
  }

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
    if (this.montantAjout <= 0) { 
      alert("Le montant doit être supérieur à 0 !");
      return;
    }
    this.store.dispatch(setSoldeInitial({ societeId: this.societeId, montant: this.montantAjout }));
    this.closeModal();  
  }
  

  augmenterSolde() {
    if (this.montantAjout <= 0) {
      alert("Veuillez entrer un montant valide !");
      return;
    }

    this.store.dispatch(augmenterSoldeActuel({ societeId: this.societeId, montant: this.montantAjout }));

    this.store.select(selectTresorie).subscribe({
      next: (tresorie) => {
        if (tresorie) {
          this.store.dispatch(loadTresorie({ societeId: this.societeId })); 
        }
      }
    });


    this.montantAjout = 0;


  }

}
