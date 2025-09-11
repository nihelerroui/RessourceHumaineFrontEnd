import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import * as AuthSelectors from "src/app/store/Authentication/authentication-selector";
import * as AuthActions from "src/app/store/Authentication/authentication.actions";

@Component({
  selector: "app-password-confirm",
  templateUrl: "./password-confirm.component.html",
  styleUrls: ["./password-confirm.component.css"],
})
export class PasswordConfirmComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  token: string = "";
  year: number = new Date().getFullYear();


  loading$: Observable<boolean>;
  success$: Observable<boolean>;
  error$: Observable<string | null>;
  private successSub!: Subscription;
  passwordStrength = 0;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loading$ = this.store.select(AuthSelectors.selectConfirmResetLoading);
    this.success$ = this.store.select(AuthSelectors.selectConfirmResetSuccess);
    this.error$ = this.store.select(AuthSelectors.selectConfirmResetError);
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get("token") || "";

    this.form = this.fb.group(
      {
        password: ["", Validators.required],
        confirmPassword: ["", Validators.required],
      },
      { validators: this.matchPasswords }
    );

    this.successSub = this.success$.subscribe((success) => {
      if (success) {
        setTimeout(() => {
          this.router.navigate(["/auth/login"]);
        }, 2000);
      }
    });

    this.form.get("password")?.valueChanges.subscribe((password: string) => {
      this.calculatePasswordStrength(password);
    });
  }

  calculatePasswordStrength(password: string): void {
    if (!password) {
      this.passwordStrength = 0;
      return;
    }

    let strength = 0;

    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;

    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;

    this.passwordStrength = Math.min(100, strength);
  }

  getPasswordStrengthColor(): string {
    if (this.passwordStrength < 40) return "danger";
    if (this.passwordStrength < 70) return "warning";
    return "success";
  }

  getPasswordStrengthText(): string {
    if (this.passwordStrength < 40) return "Faible";
    if (this.passwordStrength < 70) return "Moyen";
    return "Fort";
  }

  get f() {
    return this.form.controls;
  }

  ngOnDestroy(): void {
    if (this.successSub) {
      this.successSub.unsubscribe();
    }
  }

  matchPasswords(group: FormGroup) {
    const pass = group.get("password")?.value;
    const confirm = group.get("confirmPassword")?.value;
    return pass === confirm
      ? null
      : group.get("confirmPassword")?.setErrors({ mustMatch: true });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid || !this.token) return;

    const password = this.form.value.password;
    this.store.dispatch(
      AuthActions.resetPassword({ token: this.token, newPassword: password })
    );
  }
}
