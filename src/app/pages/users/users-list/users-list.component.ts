import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Observable } from "rxjs";
import { Consultant } from "src/app/models/consultant.models";
import { AuthenticationService } from "src/app/core/services/auth.service";
import Swal from "sweetalert2";
import { Actions } from "@ngrx/effects";
import * as fromConsultant from "src/app/store/consultant/consultant-selector";
import * as consultantActions from "src/app/store/consultant/consultant.actions";
import * as adminsocieteActions from "src/app/store/AdminSociete/AdminSociete.actions";
import { selectAllSocietes } from "src/app/store/Authentication/authentication-selector";
import { UtilisateurregisterviewComponent } from "../utilisateurregisterview/utilisateurregisterview.component";
import { UtilisateurdetailviewComponent } from "../utilisateurdetailview/utilisateurdetailview.component";
import { toggleUserStatus } from "src/app/store/user/user.actions";

@Component({
  selector: "app-users-list",
  templateUrl: "./users-list.component.html",
  styleUrls: ["./users-list.component.css"],
})
export class UsersListComponent implements OnInit {
  breadCrumbItems!: Array<{ label: string; path?: string; active?: boolean }>;

  consultants: Consultant[] = [];
  filteredConsultants: Consultant[] = [];
  paginatedConsultants: Consultant[] = [];

  consultants$: Observable<Consultant[]>;
  loading$: Observable<any>;
  error$: Observable<any>;

  searchTerm: string = "";
  selectedStatus: string = "";
  statuses: string[] = ["Activé", "Désactivé"];

  itemsPerPage = 10;
  currentPage = 1;

  modalRef?: BsModalRef;
  currentUser: Consultant;
  adminSocietes: any[] = [];

  constructor(
    private store: Store,
    private modalService: BsModalService,
    private actions$: Actions,
    private authenticationService: AuthenticationService
  ) {
    this.consultants$ = this.store.select(fromConsultant.selectAllConsultants);
    this.loading$ = this.store.select(fromConsultant.selectLoading);
    this.error$ = this.store.select(fromConsultant.selectError);
    this.currentUser = this.authenticationService.getConnectedConsultant();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Consultants", path: "/" },
      { label: "Liste des Consultants", active: true },
    ];

    console.log("Current user:", this.currentUser);

    // Charger les consultants de la société
    this.store.dispatch(
      consultantActions.loadConsultantsBySociete({
        adminId: this.currentUser.consultantId,
      })
    );

    // Charger les sociétés
    this.store.dispatch(
      adminsocieteActions.loadSocietesByAdmin({
        adminId: this.currentUser.consultantId,
      })
    );

    this.store.select(selectAllSocietes).subscribe((societes) => {
      this.adminSocietes = societes;
    });

    // Charger la liste des consultants
    this.consultants$.subscribe((consultants) => {
      this.consultants = consultants || [];
      this.applyFilters();
    });
  }

  /** Appliquer le filtre global **/
  applyFilters(): void {
    const term = this.searchTerm.toLowerCase().trim();

    this.filteredConsultants = this.consultants.filter((c) => {
      const statusMatch =
        !this.selectedStatus ||
        (this.selectedStatus === "Activé" && c.users?.enabled) ||
        (this.selectedStatus === "Désactivé" && !c.users?.enabled);

      const termMatch =
        !term ||
        c.fullName?.toLowerCase().includes(term) ||
        c.nom?.toLowerCase().includes(term) ||
        c.prenom?.toLowerCase().includes(term) ||
        c.users?.mail?.toLowerCase().includes(term);

      return statusMatch && termMatch;
    });

    this.pageChanged({ page: 1 });
  }

  filterUsers(): void {
    this.applyFilters();
  }

  /** Pagination **/
  pageChanged(event: any): void {
    this.currentPage = event?.page || 1;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedConsultants = this.filteredConsultants.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  /** Réinitialiser les filtres **/
  refreshList(): void {
    this.searchTerm = "";
    this.selectedStatus = "";
    this.applyFilters();
  }

  /** Actions **/
  openModalAdd(): void {
    this.modalRef = this.modalService.show(UtilisateurregisterviewComponent, {
      initialState: { mode: "add" },
      class: "modal-lg modal-dialog-centered",
    });
  }

  openModalEdit(consultant: Consultant): void {
    this.modalRef = this.modalService.show(UtilisateurregisterviewComponent, {
      initialState: { mode: "edit", consultant },
      class: "modal-lg modal-dialog-centered",
    });
  }

  openDetailsModal(consultant: Consultant): void {
    this.modalRef = this.modalService.show(UtilisateurdetailviewComponent, {
      initialState: { consultant },
      class: "modal-lg modal-dialog-centered",
    });
  }

  toggleStatus(consultant: Consultant): void {
    const user = consultant.users;
    const action = user.enabled ? "désactiver" : "activer";

    Swal.fire({
      title: `Voulez-vous ${action} cet utilisateur ?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Oui",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.store.dispatch(toggleUserStatus({ userId: user.usersId }));
        Swal.fire({
          icon: "success",
          title: "Succès",
          text: `Utilisateur ${action} avec succès`,
        });
      }
    });
  }
}
