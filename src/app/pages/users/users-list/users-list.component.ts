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
import * as adminsocieteActions from "src/app/store/AdminSociete/AdminSociete.actions";
import { UtilisateurregisterviewComponent } from "../utilisateurregisterview/utilisateurregisterview.component";
import { UtilisateurdetailviewComponent } from "../utilisateurdetailview/utilisateurdetailview.component";
import { UserRole } from "src/app/models/userRole.enum";
import { loadConsultantsBySociete } from "src/app/store/consultant/consultant.actions";
import {
  selectAllConsultants,
  selectAllSocietes,
  selectConsultantsError,
  selectConsultantsLoading,
} from "src/app/store/Authentication/authentication-selector";
import { Consultant } from "src/app/models/consultant.models";
import { Actions, ofType } from "@ngrx/effects";
import * as consultantActions from "src/app/store/consultant/consultant.actions";
import * as fromConsultant from "src/app/store/consultant/consultant-selector";
// import * as userActions from "src/app/store/users/users.actions";
import { AuthenticationService } from "src/app/core/services/auth.service";
@Component({
  selector: "app-users-list",
  templateUrl: "./users-list.component.html",
  styleUrls: ["./users-list.component.css"],
})
export class UsersListComponent implements OnInit {
  breadCrumbItems!: Array<{ label: string; path?: string; active?: boolean }>;
  // userList$: Observable<Consultant[]>;
  // loading$: Observable<boolean> = of(false);
  // error$: Observable<string | null>;
  consultants: Consultant[] = [];
  listconsultantfiltred: Consultant[];
  returnedArray: any[];
  consultants$: Observable<Consultant[]>;
  error$: Observable<any>;
  loading$: Observable<any>;

  //filteredUserList: Consultant[] = [];
  paginatedUserList: Consultant[] = [];
  searchTerm: string = "";
  currentPage: number = 1;
  itemsPerPage: number = 8;

  modalRef?: BsModalRef;
  selectedUser!: User | null;

  selectedRole: string = "";

  selectedStatus: string = "";

  // roles: string[] = Object.values(UserRole);
  statuses: string[] = ["Activé", "Désactivé"];

  selectedSocieteId: number | null = null;
  adminSocietes: any[] = [];
  consultantSocieteId: number | null = null;
  consultantId: number | null = null;
  currentUser: Consultant; 
  term: any;

  constructor(
    private store: Store,
    private modalService: BsModalService,
    private actions$: Actions,
    private authenticationService: AuthenticationService
  ) {this.consultants$ = this.store.select(fromConsultant.selectAllConsultants);
    this.loading$ = this.store.select(fromConsultant.selectLoading);
    this.error$ = this.store.select(fromConsultant.selectError);
    this.currentUser = this.authenticationService.getConnectedConsultant();}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Consultants", path: "/" },
      { label: "Liste des Consultants", active: true },
    ];
    this.store.dispatch(
      consultantActions.loadConsultantsBySociete({
        adminId: this.currentUser.consultantId,
      })
    );
    this.consultants$.subscribe((cons) => {
      console.log('consultants geted', cons);
      this.consultants = cons;
      this.listconsultantfiltred = this.consultants;
      this.returnedArray = this.listconsultantfiltred;
      console.log('listconsultantfiltred', this.listconsultantfiltred)
    });
    this.store.dispatch(adminsocieteActions.loadSocietesByAdmin({ adminId: this.consultantId }));
    this.store.select(selectAllSocietes).subscribe((societes) => {
      this.adminSocietes = societes;
    });

    this.store.select(selectAllConsultants).subscribe((consultants) => {
      this.applyUserFilters(consultants);
    });

    // this.loading$ = this.store.select(selectConsultantsLoading);
    // this.error$ = this.store.select(selectConsultantsError);

    // this.actions$.pipe(ofType(toggleUserStatusSuccess)).subscribe(() => {
    //   this.store.dispatch(loadConsultants());
    // });
  }

  filterUsers() {
      this.applyUserFilters(this.returnedArray);
  
  }

applyUserFilters(consultants: Consultant[]) {
  console.log('dans filtre ', consultants)
  this.listconsultantfiltred = consultants.filter((consultant) => {

    const statusMatch =
      !this.selectedStatus ||
      (this.selectedStatus === "Activé" && consultant.users?.enabled) ||
      (this.selectedStatus === "Désactivé" && !consultant.users?.enabled);
    const nameMatch =
      !this.searchTerm ||
      consultant.fullName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      consultant.nom?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      consultant.prenom?.toLowerCase().includes(this.searchTerm.toLowerCase());
    const emailMatch =
      !this.searchTerm ||
      consultant.users?.mail.toLowerCase().includes(this.searchTerm.toLowerCase());
console.log('statusMatch && nameMatch && emailMatch',statusMatch || nameMatch || emailMatch)
    return statusMatch && nameMatch && emailMatch;
  });

  this.pageChanged({ page: 1 });
}


  pageChanged(event: any) {
    this.currentPage = event?.page || 1;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedUserList = this.listconsultantfiltred.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }
  trackByUserId(index: number, consultant: Consultant): number {
    return consultant.consultantId;
  }

 refreshList() {
  this.selectedRole = "";
  this.selectedStatus = "";
  this.selectedSocieteId = this.consultantSocieteId;
  this.searchTerm = '';

  // this.store.dispatch(loadConsultants());

  this.pageChanged({ page: 1 });
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
