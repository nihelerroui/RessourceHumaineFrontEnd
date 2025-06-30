import { Component, OnInit, TemplateRef } from "@angular/core";
import { Store } from "@ngrx/store";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Observable } from "rxjs";
import { Caisse } from "src/app/models/caisse.model";
import { selectAllSocietes } from "src/app/store/Authentication/authentication-selector";
import * as AuthActions from "src/app/store/Authentication/authentication.actions";
import * as CaisseActions from "src/app/store/caisse/caisse.actions";
import { CaisseState } from "src/app/store/caisse/caisse.reducer";
import * as CaisseSelectors from "src/app/store/caisse/caisse.selectors";

@Component({
  selector: "app-tresorie",
  templateUrl: "./tresorie.component.html",
  styleUrls: ["./tresorie.component.css"],
})
export class TresorieComponent implements OnInit {
  breadCrumbItems!: Array<{ label: string; path?: string; active?: boolean }>;
  tresorie$: Observable<Caisse | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  peutAugmenterSolde$: Observable<boolean>;
  montantInitial: number = 0;
  montantAjout: number = 0;
  source: string = "";
  motif: string = "";
  societeId!: number;
  modalAction: string = "";
  modalRef?: BsModalRef;
  submitted: boolean = false;

  adminSocietes: any[] = [];
  selectedSocieteId!: number;
  consultantSocieteId!: number;
  role: string = "";

  constructor(
    private modalService: BsModalService,
    private store: Store<{ tresorie: CaisseState }>
  ) {
    this.tresorie$ = this.store.select(CaisseSelectors.selectCaisse);
    this.loading$ = this.store.select(CaisseSelectors.selectCaisseLoading);
    this.error$ = this.store.select(CaisseSelectors.selectCaisseError);
    this.peutAugmenterSolde$ = this.store.select(CaisseSelectors.selectPeutAugmenterSolde);
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Dashboard", path: "/" },
      { label: "Caisse", active: true },
    ];

    const currentUser = JSON.parse(
      sessionStorage.getItem("currentUser") || "{}"
    );
    this.consultantSocieteId = currentUser.societe?.societeId;
    this.role = currentUser?.user?.role || "";

    if (!this.consultantSocieteId) {
      alert("Société de l'utilisateur introuvable.");
      return;
    }

    this.store.dispatch(AuthActions.loadAdminSocietes());

    this.store.select(selectAllSocietes).subscribe((societes) => {
      if (!societes || societes.length === 0) return;

      this.adminSocietes = societes;

      const match = societes.find(
        (s) => s.societeId === this.consultantSocieteId
      );
      this.selectedSocieteId = match?.societeId ?? societes[0].societeId;

      Promise.resolve().then(() => {
        this.onSelectChange(this.selectedSocieteId);
      });
    });
  }

  onSocieteChange() {
    this.societeId = this.selectedSocieteId;
    this.store.dispatch(CaisseActions.loadCaisse({ societeId: this.societeId }));
  }

  onSelectChange(id: number) {
    this.selectedSocieteId = id;
    this.onSocieteChange();
  }

  openModal(template: TemplateRef<any>, action: string) {
    this.modalAction = action;
    this.montantAjout = 0;
    this.modalRef = this.modalService.show(template, { class: "modal-md" });
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

    if (this.modalAction === "initialiser") {
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
    this.store.dispatch(
      CaisseActions.setSoldeInitial({ societeId: this.societeId, montant: this.montantAjout })
    );
    this.closeModal();
  }

  augmenterSolde() {
    if (this.montantAjout <= 0) {
      alert("Veuillez entrer un montant valide !");
      return;
    }

    if (!this.source || !this.motif) {
      alert("Veuillez renseigner la source et le motif !");
      return;
    }

    this.store.dispatch(
      CaisseActions.augmenterSoldeActuel({
        societeId: this.societeId,
        montant: this.montantAjout,
        source: this.source,
        motif: this.motif,
      })
    );

    this.montantAjout = 0;
    this.source = "";
    this.motif = "";
    this.closeModal();
  }
}
