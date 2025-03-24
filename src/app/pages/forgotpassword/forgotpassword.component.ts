// forgot-password.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../core/services/authentication.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgotpassword.component.html'
})
export class ForgotPasswordComponent implements OnInit {
  resetForm: FormGroup;
  submitted = false;
  error = '';
  emailSent = false;
  year = new Date().getFullYear();
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
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
    this.authService.forgotPassword(this.f.email.value)
      .subscribe({
        next: () => {
          this.loading = false;
          this.emailSent = true;
        },
        error: error => {
          this.error = error.error?.message || 'Une erreur est survenue. Veuillez réessayer.';
          this.loading = false;
        }
      });
  }
}