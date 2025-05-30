import { Component, OnInit, TemplateRef } from "@angular/core";
import { Store } from "@ngrx/store";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Observable, of } from "rxjs";
import { User } from "src/app/models/auth.models";
import {
  toggleUserStatus,
  toggleUserStatusSuccess,
} from "src/app/store/user/user.actions";
import Swal from "sweetalert2";
import * as AuthActions from "src/app/store/Authentication/authentication.actions";
import { UtilisateurregisterviewComponent } from "../utilisateurregisterview/utilisateurregisterview.component";
import { UtilisateurdetailviewComponent } from "../utilisateurdetailview/utilisateurdetailview.component";
import { UserRole } from "src/app/models/userRole.enum";
import { loadConsultants } from "src/app/store/Authentication/authentication.actions";
import {
  selectAllConsultants,
  selectAllSocietes,
  selectConsultantsError,
  selectConsultantsLoading,
} from "src/app/store/Authentication/authentication-selector";
import { Consultant } from "src/app/models/consultant.models";
import { Actions, ofType } from "@ngrx/effects";

@Component({
  selector: "app-users-list",
  templateUrl: "./users-list.component.html",
  styleUrls: ["./users-list.component.css"],
})
export class UsersListComponent implements OnInit {
  breadCrumbItems!: Array<{ label: string; path?: string; active?: boolean }>;
  userList$: Observable<Consultant[]>;
  loading$: Observable<boolean> = of(false);
  error$: Observable<string | null>;

  filteredUserList: Consultant[] = [];
  paginatedUserList: Consultant[] = [];
  searchTerm: string = "";
  currentPage: number = 1;
  itemsPerPage: number = 8;

  modalRef?: BsModalRef;
  selectedUser!: User | null;

  selectedRole: string = "";

  selectedStatus: string = "";

  roles: string[] = Object.values(UserRole);
  statuses: string[] = ["Activé", "Désactivé"];

  selectedSocieteId: number | null = null;
  adminSocietes: any[] = [];
  consultantSocieteId: number | null = null;

  constructor(
    private store: Store,
    private modalService: BsModalService,
    private actions$: Actions
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Dashboard", path: "/" },
      { label: "Liste des Utilisateurs", active: true },
    ];

    const currentUser = JSON.parse(
      sessionStorage.getItem("currentUser") || "{}"
    );
    this.consultantSocieteId = currentUser?.societe?.societeId || null;
    this.selectedSocieteId = this.consultantSocieteId;

    this.store.dispatch(loadConsultants());

    this.store.dispatch(AuthActions.loadAdminSocietes());
    this.store.select(selectAllSocietes).subscribe((societes) => {
      this.adminSocietes = societes;
    });

    this.store.select(selectAllConsultants).subscribe((consultants) => {
      this.applyUserFilters(consultants);
    });

    this.loading$ = this.store.select(selectConsultantsLoading);
    this.error$ = this.store.select(selectConsultantsError);

    this.actions$.pipe(ofType(toggleUserStatusSuccess)).subscribe(() => {
      this.store.dispatch(loadConsultants());
    });
  }

  filterUsers() {
    this.store.select(selectAllConsultants).subscribe((consultants) => {
      this.applyUserFilters(consultants);
    });
  }

  applyUserFilters(consultants: Consultant[]) {
    this.filteredUserList = consultants.filter((consultant) => {
      const roleMatch =
        !this.selectedRole || consultant.user?.role === this.selectedRole;
      const statusMatch =
        !this.selectedStatus ||
        (this.selectedStatus === "Activé" && consultant.user?.enabled) ||
        (this.selectedStatus === "Désactivé" && !consultant.user?.enabled);
      const societeMatch =
        !this.selectedSocieteId ||
        consultant.societe?.societeId === this.selectedSocieteId;

      return roleMatch && statusMatch && societeMatch;
    });

    this.pageChanged({ page: 1 });
  }

  pageChanged(event: any) {
    this.currentPage = event?.page || 1;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedUserList = this.filteredUserList.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  trackByUserId(index: number, consultant: Consultant): number {
    return consultant.consultantId;
  }

  refreshList() {
    this.store.dispatch(loadConsultants());
  }

  openModalAdd() {
    this.modalRef = this.modalService.show(UtilisateurregisterviewComponent, {
      initialState: {
        mode: "add",
      },
      class: "modal-lg modal-dialog-centered",
    });
  }

  openModalEdit(consultant: Consultant) {
    this.modalRef = this.modalService.show(UtilisateurregisterviewComponent, {
      initialState: {
        mode: "edit",
        consultant: consultant,
      },
      class: "modal-lg modal-dialog-centered",
    });
  }

  openDetailsModal(consultant: Consultant): void {
    const initialState = {
      consultant: consultant,
    };

    this.modalRef = this.modalService.show(UtilisateurdetailviewComponent, {
      initialState,
      class: "modal-lg modal-dialog-centered",
    });
  }

  toggleStatus(consultant: Consultant): void {
    const user = consultant.user;
    const action = user.enabled ? "désactiver" : "activer";

    Swal.fire({
      title: `Voulez-vous ${action} cet utilisateur ?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Oui",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.store.dispatch(toggleUserStatus({ userId: user.userId }));
        Swal.fire({
          icon: "success",
          title: "Succès",
          text: `Utilisateur ${action} avec succès`,
        });
      }
    });
  }
}
