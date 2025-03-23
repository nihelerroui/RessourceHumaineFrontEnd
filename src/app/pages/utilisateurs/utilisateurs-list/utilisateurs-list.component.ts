import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UtilisateurdetailviewComponent } from '../../utilisateursdetail/utilisateurdetailview/utilisateurdetailview.component';
import { UtilisateurregisterviewComponent } from '../../utilisateurregister/utilisateurregisterview/utilisateurregisterview.component';  // Import the modal
//UtilisateurAdminUpdateViewComponent
import { UtilisateurAdminUpdateViewComponent } from '../../utilisateuradminupdate/utilisateuradminupdateview/utilisateuradminupdateview.component';  // Import the modal

@Component({
  selector: 'app-utilisateurs-list',
  templateUrl: './utilisateurs-list.component.html',
  styleUrls: ['./utilisateurs-list.component.scss']
})
export class UtilisateursListComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  totalUsers: number = 0;
  itemsPerPage: number = 10;
  searchTerm: string = '';
  roleFilter: string = '';
  enabledFilter: string = '';

  loading$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<string | null>(null);

  modalRef?: BsModalRef;

  constructor(
    private authService: AuthenticationService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.authService.userCreated$.subscribe(() => {
        this.loadUsers();  // Reload the user list
      });
  }

  loadUsers(): void {
    this.loading$.next(true);
    this.authService.getAllUser().subscribe({
      next: (response) => {
        this.users = response.map(user => ({
          ...user,
          fullName: user.consultant?.fullName || 'N/A',
          telephone: user.consultant?.telephone || 'Non spécifié',
          fonction: user.consultant?.fonction || 'Non spécifié',
          matricule: user.consultant?.matricule || 'Non spécifié',
          dateRecrutement: this.formatDate(user.consultant?.dateRecrutement),
          dateSortie: this.formatDate(user.consultant?.dateSortie)
        }));
        this.filteredUsers = [...this.users];
        this.totalUsers = response.length;
        this.loading$.next(false);
      },
      error: () => {
        this.error$.next('Erreur lors du chargement des utilisateurs.');
        this.loading$.next(false);
      }
    });
  }

  formatDate(date: string | null): string {
    if (!date) return 'Non spécifié';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  searchUser(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filteredUsers = [...this.users];

    if (this.searchTerm) {
      filteredUsers = filteredUsers.filter(user =>
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.fullName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.roleFilter) {
      filteredUsers = filteredUsers.filter(user => user.role === this.roleFilter);
    }

    if (this.enabledFilter) {
      const isEnabled = this.enabledFilter === 'true';
      filteredUsers = filteredUsers.filter(user => user.enabled === isEnabled);
    }

    this.filteredUsers = filteredUsers;
  }

  formatUserRole(role: string): string {
    const roleMap: { [key: string]: string } = {
      ADMINISTRATEUR: 'Administrateur',
      RESPONSABLE_FINANCIER: 'Responsable Financier',
      SOUS_TRAITANT: 'Sous Traitant'
    };
    return roleMap[role] || role;
  }

  getRoleBadgeClass(role: string): string {
    const roleClassMap: { [key: string]: string } = {
      ADMINISTRATEUR: 'bg-primary',
      RESPONSABLE_FINANCIER: 'bg-success',
      SOUS_TRAITANT: 'bg-warning text-dark'
    };
    return roleClassMap[role] || 'bg-secondary';
  }

  pageChanged(event: any): void {
    console.log('Pagination change event:', event);
  }

  openCreateUserModal(): void {
    // Open the modal to create a new user
    this.modalRef = this.modalService.show(UtilisateurregisterviewComponent, {
      class: 'modal-lg' // Optional: You can adjust the size of the modal here
    });
  }

  viewUserDetails(userId: number): void {
    const selectedUser = this.users.find(u => u.userId === userId);
    if (selectedUser) {
      this.modalRef = this.modalService.show(UtilisateurdetailviewComponent, { 
        initialState: { user: selectedUser }, 
        class: 'modal-lg' 
      });
  
      // Ensure the modal is detecting changes
      setTimeout(() => {
        this.modalRef?.content?.cdr?.detectChanges?.();
      }, 100);
    } else {
      console.error('User not found');
    }
  }

  openEditUserModal(user: any): void {
    this.modalRef = this.modalService.show(UtilisateurAdminUpdateViewComponent, {
      initialState: { user: user },
      class: 'modal-lg'
    });
  
    // When the modal closes, reload users
    this.modalRef.onHidden?.subscribe(() => {
      this.loadUsers();
    });
  }
  toggleUserStatus(user: any): void {
    this.authService.toggleUserStatus(user.userId).subscribe({
      next: (response) => {
        if (response && response.success) {  // Check for a success flag in response
          const updatedUser = { ...user, enabled: !user.enabled };
          this.users = this.users.map(u => u.userId === user.userId ? updatedUser : u);
          setTimeout(() => {}, 0);
        } else {
          console.error('Réponse inattendue du serveur:', response);
        }
      },
      error: (error) => {
        console.error('Erreur lors du changement du statut de l’utilisateur:', error);
      }
    });
  }
  

  deleteUser(userId: number): void {
    console.log('Deleting user:', userId);
  }

  reloadUsers(): void {
    this.loadUsers();
  }
}
