import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Observable } from "rxjs";
import * as FactureActions from "src/app/store/factureAchat/factureAchat.actions";
import { FactureAchat } from "src/app/models/factureAchat.model";
import {
  selectFactureError,
  selectFactureList,
  selectFactureLoading,
} from "src/app/store/factureAchat/factureAchat.selectors";
import { TypePaiement } from "src/app/models/type-paiement.enum";
import * as CaisseActions from "src/app/store/caisse/caisse.actions";
import Swal from "sweetalert2";
import * as AuthActions from "src/app/store/Authentication/authentication.actions";
import { StatutPaiement } from "src/app/models/statut-paiement.enum";
import { environment } from "src/environments/environment";
import { Actions, ofType } from "@ngrx/effects";
import { selectCaisseError } from "src/app/store/caisse/caisse.selectors";
import { selectAllSocietes } from "src/app/store/Authentication/authentication-selector";
import { UserRole } from "src/app/models/userRole.enum";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: "app-facture-list",
  templateUrl: "./facture-list.component.html",
  styleUrls: ["./facture-list.component.css"],
})
export class FactureListComponent implements OnInit {
  breadCrumbItems!: Array<{ label: string; path?: string; active?: boolean }>;
  factureList$: Observable<FactureAchat[]>;
  loading$: Observable<boolean>;

  error$: Observable<string | null>;
  modalRef?: BsModalRef;
  factureForm!: FormGroup;

  submitted: boolean = false;
  typePaiementOptions = Object.values(TypePaiement);
  statutPaiementOptions = Object.values(StatutPaiement);

  filteredFactureList: FactureAchat[] = [];
  paginatedFactureList: FactureAchat[] = [];
  searchTerm: string = "";
  selectedStatutPaiement: string = "";
  currentPage: number = 1;
  itemsPerPage: number = 8;

  selectedFacture!: FactureAchat | null;

  factures: FactureAchat[] = [];

  selectedFile: File | null = null;

  societeOptions: any[] = [];

  adminSocietes$: Observable<any[]>;
  consultantSocieteId!: number;
  selectedSocieteId!: number;
  consultantId!: number;
  role!: UserRole;

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    public store: Store,
    private actions$: Actions,
    private http: HttpClient
  ) {
    this.factureList$ = this.store.select(selectFactureList);
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "GESTION FINANCIERE", path: "/" },
      { label: "Liste des Factures Achats", active: true },
    ];

    const currentUser = JSON.parse(
      localStorage.getItem("currentUser") || "{}"
    );
    this.consultantId = currentUser.consultantId;
    
    this.consultantSocieteId = currentUser.societe?.societeId;
    this.selectedSocieteId = this.consultantSocieteId;
    this.role = currentUser.user?.role || "";

    this.store.dispatch(AuthActions.loadAdminSocietes());
    this.adminSocietes$ = this.store.select(selectAllSocietes);

    this.adminSocietes$.subscribe((societes) => {
      this.societeOptions = societes;

      const match = societes.find(
        (s) => s.societeId === this.consultantSocieteId
      );
      if (!match && societes.length > 0) {
        this.selectedSocieteId = societes[0].societeId;
      }

      this.filterFactures();
    });

    this.actions$.pipe(ofType(CaisseActions.validerPaiementSuccess)).subscribe(() => {
      Swal.fire("Succès", "Le paiement a été validé.", "success");
      this.store.dispatch(FactureActions.loadFacturesAchat());
    });

    this.actions$.pipe(ofType(FactureActions.updateFactureAchatSuccess)).subscribe(() => {
      Swal.fire({
        icon: "success",
        title: "Facture mise à jour avec succès !",
        showConfirmButton: false,
        timer: 1500,
      });
      this.modalRef?.hide();
      this.factureForm.reset();
      this.selectedFile = null;
      this.store.dispatch(FactureActions.loadFacturesAchat());
    });

    this.actions$.pipe(ofType(FactureActions.addFactureAchatSuccess)).subscribe(() => {
      Swal.fire({
        icon: "success",
        title: "Nouvelle facture ajoutée avec succès !",
        showConfirmButton: false,
        timer: 1500,
      });
      this.modalRef?.hide();
      this.factureForm.reset();
      this.selectedFile = null;
      this.store.dispatch(FactureActions.loadFacturesAchat());
    });

    this.store.select(selectCaisseError).subscribe((error) => {
      if (error) {
        Swal.fire("Erreur", error, "error");
      }
    });

    this.store.dispatch(FactureActions.loadFacturesAchat());

    this.factureList$ = this.store.select(selectFactureList);
    this.factureList$.subscribe((factures) => {
      this.factures = factures;
      this.filterFactures();
    });

    this.loading$ = this.store.select(selectFactureLoading);
    this.error$ = this.store.select(selectFactureError);

    this.initFactureForm();
  }

  initFactureForm(): void {
    this.factureForm = this.formBuilder.group({
      factureAchatId: [""],
      designation: ["", [Validators.required, Validators.minLength(2)]],
      refFacture: ["", [Validators.required, Validators.minLength(3)]],
      montantTtc: [0, [Validators.required, Validators.min(0)]],
      dateEmmission: [
        "",
        [Validators.required, this.dateEmmissionValidator.bind(this)],
      ],
      typePaiement: ["", Validators.required],
      societeId: [null, Validators.required],
    });
  }

  dateEmmissionValidator(control: any) {
    const dateValue = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return dateValue <= today ? null : { invalidDate: true };
  }

  isRefFactureUnique(ref: string, factureAchatId?: number): boolean {
    return !this.factures.some(
      (facture) => facture.refFacture === ref && facture.factureAchatId !== factureAchatId
    );
  }

  filterFactures(): void {
    const search = this.searchTerm?.toLowerCase() || "";

    this.filteredFactureList = this.factures.filter(
      (f) =>
        f.societe?.societeId === this.selectedSocieteId &&
        (f.designation?.toLowerCase().includes(search) ||
          f.refFacture?.toLowerCase().includes(search)) &&
        (this.selectedStatutPaiement === "" ||
          f.statutPaiement === this.selectedStatutPaiement)
    );

    this.pageChanged({ page: 1 });
  }

  pageChanged(event: any) {
    this.currentPage = event.page;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedFactureList = this.filteredFactureList.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  refreshList() {
     this.selectedStatutPaiement = "";
      this.selectedSocieteId = this.consultantSocieteId;
      this.searchTerm = '';
    
     this.store.dispatch(FactureActions.loadFacturesAchat());
    
      this.pageChanged({ page: 1 });
    
  }

  openModalAdd(template: TemplateRef<any>) {
    this.factureForm.reset();
    this.factureForm.patchValue({ factureAchatId: null });
    this.modalRef = this.modalService.show(template, { class: "modal-md" });
  }

  openModalEdit(facture: FactureAchat, template: TemplateRef<any>) {
   this.factureForm.patchValue({
  ...facture,
  factureAchatId: facture.factureAchatId,
  societeId: facture.societe?.societeId || null
});

    
    this.modalRef = this.modalService.show(template, { class: "modal-md" });
  }

  saveFacture() {
    if (this.factureForm.valid) {
      let factureData = this.factureForm.value;

      if (!this.consultantId) {
        Swal.fire("Erreur", "Consultant connecté non trouvé.", "error");
        return;
      }

      factureData.consultantId = this.consultantId;

      if (!this.selectedFile && !factureData.factureAchatId) {
        Swal.fire("Erreur", "Veuillez importer un fichier (PDF).", "error");
        return;
      }

      if (!factureData.statutPaiement) {
        factureData.statutPaiement = "NON_PAYÉE";
      }

      if (
        !this.isRefFactureUnique(factureData.refFacture, factureData.factureAchatId)
      ) {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "La référence de la facture existe déjà !",
          confirmButtonText: "OK",
        });
        return;
      }

      const formData = new FormData();
      formData.append("facture", JSON.stringify(factureData));

      if (this.selectedFile) {
        formData.append("file", this.selectedFile);
      }

      if (factureData.factureAchatId) {
        this.store.dispatch(FactureActions.updateFactureAchat({ facture: formData }));
      } else {
        this.store.dispatch(FactureActions.addFactureAchat({ facture: formData }));
      }
    }
  }

  onDeleteFacture(factureAchatId: number) {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.store.dispatch(FactureActions.deleteFactureAchat({ factureAchatId }));
        Swal.fire("Succès", "Facture supprimée avec succès.", "success");
      }
    });
  }

  openDetailsModal(facture: FactureAchat, template: TemplateRef<any>) {
    console.log("Détails de la facture :", facture);
    this.selectedFacture = facture;
    this.modalRef = this.modalService.show(template, { class: "modal-md" });
  }

  validerPaiement(factureAchatId: number) {
    Swal.fire({
      title: "Confirmer le paiement ?",
      text: "Cette action est irréversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, valider !",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.store.dispatch(CaisseActions.validerPaiement({ factureAchatId }));
      }
    });
  }


  openFacture(filePath: string): void {
    const fileName = this.getFileName(filePath);
    const token = localStorage.getItem("accessToken"); 
    const fileUrl = `${environment.apiUrl}/facturesAchats/files/${fileName}?disposition=inline`;

    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);

    this.http.get(fileUrl, { headers, responseType: "blob" }).subscribe(
      (blob) => {
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, "_blank");
      },
      (error) => {
        Swal.fire("Erreur", "Impossible d’ouvrir le fichier.", "error");
      }
    );
  }

  onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedFile = input.files[0];
    console.log("Fichier sélectionné :", this.selectedFile.name);
  }
}


  downloadFacture(filePath: string): void {
    if (!filePath) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Aucun fichier disponible pour cette facture.",
        confirmButtonText: "OK",
      });
      return;
    }

    const fileName = this.getFileName(filePath);
    const fileUrl = `${environment.apiUrl}/facturesAchats/files/${fileName}?disposition=attachment`;
    const token = localStorage.getItem("accessToken");

    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);

    this.http.get(fileUrl, { headers, responseType: "blob" }).subscribe(
      (blob) => {
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(downloadUrl);
      },
      () => {
        Swal.fire("Erreur", "Téléchargement échoué.", "error");
      }
    );
  }

  getFileName(filePath: string): string {
    return filePath.split("\\").pop() || "";
  }
}
