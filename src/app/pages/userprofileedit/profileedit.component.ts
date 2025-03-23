import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService, ProfileUpdateRequest } from '../../core/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profileedit.component.html',
  styleUrls: ['./profileedit.component.scss']
})
export class ProfileEditComponent implements OnInit {
  profileForm: FormGroup;
  user: any;
  loading = false;
  submitted = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Get user data from sessionStorage
    const userData = sessionStorage.getItem('currentUser');
    if (userData) {
      this.user = JSON.parse(userData);
      
      // Initialize the form with user data
      this.initializeForm();
    } else {
      // Redirect to login if no user data
      this.router.navigate(['/login']);
    }
  }

  initializeForm(): void {
    const consultant = this.user.consultant || {};
    const personalDetails = consultant.personalDetails || {};
    
    this.profileForm = this.formBuilder.group({
      // User fields
      email: [this.user.email, [Validators.required, Validators.email]],
      
      // Consultant fields (required)
      fullName: [consultant.fullName, Validators.required],
      name: [consultant.name, Validators.required],
      prenom: [consultant.prenom, Validators.required],
      telephone: [consultant.telephone, [Validators.required, Validators.pattern(/^\d{10}$/)]],
      typeLibelle: [consultant.typeLibelle, Validators.required],
      dateRecrutement: [consultant.dateRecrutement ? new Date(consultant.dateRecrutement).toISOString().split('T')[0] : null, Validators.required],
      dateSortie: [consultant.dateSortie ? new Date(consultant.dateSortie).toISOString().split('T')[0] : null],
      fonction: [consultant.fonction, Validators.required],
      matricule: [consultant.matricule, Validators.required],
      commercial: [consultant.commercial || false],
      
      // Personal details (optional)
      attestations: [personalDetails.attestations],
      bic: [personalDetails.bic, [Validators.pattern(/^[A-Z0-9]{8,11}$/)]],
      bisTer: [personalDetails.bisTer],
      carteGrise: [personalDetails.carteGrise],
      cni: [personalDetails.cni],
      codePostal: [personalDetails.codePostal, [Validators.pattern(/^\d{5}$/)]],
      complementAdr: [personalDetails.complementAdr],
      contart: [personalDetails.contart],
      dateDebCni: [personalDetails.dateDebCni ? new Date(personalDetails.dateDebCni).toISOString().split('T')[0] : null],
      dateFinCni: [personalDetails.dateFinCni ? new Date(personalDetails.dateFinCni).toISOString().split('T')[0] : null],
      iban: [personalDetails.iban, [Validators.pattern(/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/)]],
      kbis: [personalDetails.kbis],
      navigo: [personalDetails.navigo],
      nomRue: [personalDetails.nomRue],
      numRue: [personalDetails.numRue, [Validators.pattern(/^\d+$/)]],
      nummss: [personalDetails.nummss, [Validators.pattern(/^\d{15}$/)]],
      photo: [personalDetails.photo],
      rib: [personalDetails.rib],
      urssaf: [personalDetails.urssaf],
      ville: [personalDetails.ville]
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.profileForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Stop here if form is invalid
    if (this.profileForm.invalid) {
      return;
    }

    this.loading = true;
    
    const formValues = this.profileForm.value;
    const updateData: ProfileUpdateRequest = {
      // User fields
      email: formValues.email,
      
      // Consultant fields
      fullName: formValues.fullName,
      name: formValues.name,
      prenom: formValues.prenom,
      telephone: formValues.telephone,
      typeLibelle: formValues.typeLibelle,
      dateRecrutement: formValues.dateRecrutement,
      dateSortie: formValues.dateSortie,
      fonction: formValues.fonction,
      matricule: formValues.matricule,
      commercial: formValues.commercial,
      
      // Personal details
      attestations: formValues.attestations,
      bic: formValues.bic,
      bisTer: formValues.bisTer,
      carteGrise: formValues.carteGrise,
      cni: formValues.cni,
      codePostal: formValues.codePostal,
      complementAdr: formValues.complementAdr,
      contart: formValues.contart,
      dateDebCni: formValues.dateDebCni,
      dateFinCni: formValues.dateFinCni,
      iban: formValues.iban,
      kbis: formValues.kbis,
      navigo: formValues.navigo,
      nomRue: formValues.nomRue,
      numRue: formValues.numRue,
      nummss: formValues.nummss,
      photo: formValues.photo,
      rib: formValues.rib,
      urssaf: formValues.urssaf,
      ville: formValues.ville
    };

    this.authService.updateUserProfile(this.user.id, updateData)
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.successMessage = 'Profil mis à jour avec succès';
            
            // Update the user data in session storage
            this.authService.getUser().subscribe(userData => {
              sessionStorage.setItem('currentUser', JSON.stringify(userData));
              this.authService.notifyUserUpdated();
              
              // Redirect back to profile view after a short delay
              setTimeout(() => {
                this.router.navigate(['/profile']);
              }, 2000);
            });
          } else {
            this.errorMessage = response.message || 'Une erreur est survenue';
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Une erreur est survenue lors de la mise à jour du profil';
        }
      });
  }

  cancel(): void {
    this.router.navigate(['/profile']);
  }
}