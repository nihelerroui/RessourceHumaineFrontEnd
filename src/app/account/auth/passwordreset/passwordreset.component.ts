import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as AuthSelectors from 'src/app/store/Authentication/authentication-selector'
import * as AuthActions from "src/app/store/Authentication/authentication.actions";


@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.scss']
})

/**
 * Reset-password component
 */
export class PasswordresetComponent implements OnInit, AfterViewInit {

   resetForm: UntypedFormGroup;
  submitted = false;

  loading$: Observable<boolean>;
  success$: Observable<boolean>;
  error$: Observable<string | null>;

  year: number = new Date().getFullYear();

  successMessage$: Observable<string | null>;

  constructor(
    private fb: UntypedFormBuilder,
    private store: Store
  ) {
    this.loading$ = this.store.select(AuthSelectors.selectConfirmResetLoading);
    this.success$ = this.store.select(AuthSelectors.selectConfirmResetSuccess);
    this.error$ = this.store.select(AuthSelectors.selectConfirmResetError);
  }

  ngOnInit(): void {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.successMessage$ = this.store.select(AuthSelectors.selectResetPasswordSuccessMessage);
  }

  ngAfterViewInit(): void {}

  get f() {
    return this.resetForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.resetForm.invalid) return;

    const email = this.resetForm.value.email;

    this.store.dispatch(AuthActions.forgotPassword({ email }));
  }
}