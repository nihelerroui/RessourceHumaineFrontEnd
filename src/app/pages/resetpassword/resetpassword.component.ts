// reset-password.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './resetpassword.component.html'
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  submitted = false;
  error = '';
  success = false;
  token: string;
  tokenValid = false;
  tokenValidated = false;
  year = new Date().getFullYear();
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.mustMatch('password', 'confirmPassword')
    });

    // Get token from URL
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (this.token) {
        this.validateToken();
      } else {
        this.error = 'Token manquant. Veuillez utiliser le lien envoyé dans votre email.';
        this.tokenValidated = true;
      }
    });
  }

  // Custom validator to check if passwords match
  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  // Validate token with backend
  validateToken() {
    this.loading = true;
    this.authService.validateResetToken(this.token)
      .subscribe({
        next: () => {
          this.tokenValid = true;
          this.tokenValidated = true;
          this.loading = false;
        },
        error: error => {
          this.error = error.error?.message || 'Token invalide ou expiré.';
          this.tokenValidated = true;
          this.loading = false;
        }
      });
  }

  // convenience getter for easy access to form fields
  get f() { return this.resetForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    // stop here if form is invalid
    if (this.resetForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.resetPassword(this.token, this.f.password.value)
      .subscribe({
        next: () => {
          this.success = true;
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 3000);
        },
        error: error => {
          this.error = error.error?.message || 'Une erreur est survenue. Veuillez réessayer.';
          this.loading = false;
        }
      });
  }
}