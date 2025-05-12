import { Component, OnInit, TemplateRef } from "@angular/core";
import { Store } from "@ngrx/store";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Observable, of } from "rxjs";
import { User } from "src/app/models/auth.models";
import { loadUsers, toggleUserStatus } from "src/app/store/user/user.actions";
import {
  selectAllUsers,
  selectUserError,
  selectUserLoading,
} from "src/app/store/user/user.selectors";
import Swal from "sweetalert2";
import { UtilisateurregisterviewComponent } from "../utilisateurregisterview/utilisateurregisterview.component";
import { UtilisateurdetailviewComponent } from "../utilisateurdetailview/utilisateurdetailview.component";
import { UserRole } from "src/app/models/userRole.enum";

@Component({
  selector: "app-users-list",
  templateUrl: "./users-list.component.html",
  styleUrls: ["./users-list.component.css"],
})
export class UsersListComponent implements OnInit {
  breadCrumbItems!: Array<{ label: string; path?: string; active?: boolean }>;
  userList$: Observable<User[]>;
  loading$: Observable<boolean> = of(false);
  error$: Observable<string | null>;

  filteredUserList: User[] = [];
  paginatedUserList: User[] = [];
  searchTerm: string = "";
  currentPage: number = 1;
  itemsPerPage: number = 8;

  modalRef?: BsModalRef;
  selectedUser!: User | null;

  selectedRole: string = "";

  selectedStatus: string = "";

  roles: string[] = Object.values(UserRole);
  statuses: string[] = ["Activé", "Désactivé"];

  constructor(private store: Store, private modalService: BsModalService) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Dashboard", path: "/" },
      { label: "Liste des Utilisateurs", active: true },
    ];
    this.store.dispatch(loadUsers());

    this.store.select(selectAllUsers).subscribe((users) => {
      this.filteredUserList = [...users];
      if (this.filteredUserList.length > 0) {
        this.pageChanged({ page: 1 });
      }
    });

    this.loading$ = this.store.select(selectUserLoading);
    this.error$ = this.store.select(selectUserError);
  }

  filterUsers() {
    this.store.select(selectAllUsers).subscribe((users) => {
      this.filteredUserList = users.filter(
        (user) =>
          (user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            user.consultant?.fullName
              ?.toLowerCase()
              .includes(this.searchTerm.toLowerCase())) &&
          (this.selectedRole === "" || user.role === this.selectedRole) &&
          (this.selectedStatus === "" ||
            (this.selectedStatus === "Activé" && user.enabled) ||
            (this.selectedStatus === "Désactivé" && !user.enabled))
      );
      this.pageChanged({ page: 1 });
    });
  }

  pageChanged(event: any) {
    this.currentPage = event?.page || 1;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedUserList = this.filteredUserList.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  trackByUserId(index: number, user: User): number {
    return user.userId;
  }

  refreshList() {
    this.store.dispatch(loadUsers());
  }

  openModalAdd() {
    this.modalRef = this.modalService.show(UtilisateurregisterviewComponent, {
      initialState: {
        mode: "add",
      },
      class: "modal-lg modal-dialog-centered",
    });
  }

  openModalEdit(user: User) {
    this.modalRef = this.modalService.show(UtilisateurregisterviewComponent, {
      initialState: {
        mode: "edit",
        user: user,
      },
      class: "modal-lg modal-dialog-centered",
    });
  }

  openDetailsModal(user: any): void {
    const initialState = {
      user: user,
    };
    this.modalRef = this.modalService.show(UtilisateurdetailviewComponent, {
      initialState,
      class: "modal-lg modal-dialog-centered",
    });
  }

  toggleStatus(user: User): void {
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
