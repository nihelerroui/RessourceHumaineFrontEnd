import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';

@Component({
  selector: 'app-profileview',
  templateUrl: './profileview.component.html',
  styleUrls: ['./profileview.component.scss']
})
export class ProfileViewComponent implements OnInit {
  user: any;
  roleColors = {
    'ADMINISTRATEUR': {
      primary: '#4f46e5', // Indigo
      secondary: '#818cf8',
      icon: 'shield'
    },
    'RESPONSABLE_FINANCIER': {
      primary: '#0891b2', // Cyan
      secondary: '#22d3ee',
      icon: 'landmark'
    },
    'SOUS_TRAITANT': {
      primary: '#059669', // Emerald
      secondary: '#34d399',
      icon: 'briefcase'
    }
  };

  constructor(private router: Router,
    private authService: AuthenticationService) { }

    ngOnInit(): void {
        // Get user data from sessionStorage
        const userData = sessionStorage.getItem('currentUser');
        if (userData) {
          this.user = JSON.parse(userData);
          console.log('User data loaded:', this.user);
          
          // Ensure the consultant and personalDetails properties exist
          if (!this.user.consultant) {
            this.user.consultant = {};
          }
          
          if (!this.user.consultant.personalDetails) {
            this.user.consultant.personalDetails = {};
          }
        } else {
          // Fallback to dummy data if no user in sessionStorage
          this.user = {
            email: 'example@email.com',
            role: 'ADMINISTRATEUR',
            consultant: {
              fullName: 'Example User',
              name: 'Example',
              prenom: 'User',
              telephone: '12345678',
              fonction: 'Manager',
              dateRecrutement: '2023-01-01',
              dateSortie: '2025-01-01',
              matricule: 'EMP001',
              typeLibelle: 'Senior',
              personalDetails: {
                codePostal: '10000',
                ville: 'Paris',
                nomRue: 'Example Street',
                numRue: '123',
                complementAdr: 'Apt 4B',
                iban: 'FR123456789',
                bic: 'EXAMPLEBIC'
              }
            }
          };
        }
    
        // Subscribe to user updated events
        this.authService.userUpdated$.subscribe(updated => {
          if (updated) {
            // Refresh user data
            const updatedUserData = sessionStorage.getItem('currentUser');
            if (updatedUserData) {
              this.user = JSON.parse(updatedUserData);
            }
          }
        });
      }

  getRoleStyle() {
    const role = this.user.role || 'ADMINISTRATEUR';
    return this.roleColors[role] || this.roleColors['ADMINISTRATEUR'];
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    
    return date.toLocaleDateString();
  }
  editProfile(): void {
    this.router.navigate(['/profile/edit']);
  }
}
