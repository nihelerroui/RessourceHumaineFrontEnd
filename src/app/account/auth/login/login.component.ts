import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { login, getUser } from '../../../store/Authentication/authentication.actions';
import { selectAccessToken, selectUser, selectError, selectLoading } from '../../../store/Authentication/authentication-selector';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: UntypedFormGroup;
  submitted = false;
  error = '';
  loading = false;
  fieldTextType = false;
  year: number = new Date().getFullYear();

  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private store: Store,
    private router: Router
  ) { }

  ngOnInit() {
    // If user already exists in session, redirect to dashboard
    if (sessionStorage.getItem('currentUser')) {
      this.router.navigate(['/']);
    }
    
    // Initialize form
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    // Subscribe to accessToken; when token is available, dispatch getUser to load user details.
    const tokenSub = this.store.pipe(select(selectAccessToken)).subscribe(token => {
      console.log("Token:", token);
      sessionStorage.setItem('currentUserToken', token);
      if (token) {
        this.store.dispatch(getUser());
      }
    });
    this.subscriptions.push(tokenSub);

    // Subscribe to user details; once received, store in sessionStorage and navigate away.
    const userSub = this.store.pipe(select(selectUser)).subscribe(user => {
      if (user) {
        console.log("Retrieved user information:", user);
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        this.router.navigate(['/']);
      }
    });
    this.subscriptions.push(userSub);

    // Subscribe to error and loading states.
    const errorSub = this.store.pipe(select(selectError)).subscribe(err => {
      this.error = err;
    });
    this.subscriptions.push(errorSub);

    const loadingSub = this.store.pipe(select(selectLoading)).subscribe(load => {
      this.loading = load;
    });
    this.subscriptions.push(loadingSub);
  }

  // Getter for easy access to form controls.
  get f() { return this.loginForm.controls; }

  onSubmit() {
    console.log("Form submitted");
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    const email = this.f['email'].value;
    const password = this.f['password'].value;
    console.log("Email:", email, "Password:", password);
    // Dispatch the login action using the correct object shape.
    this.store.dispatch(login({ credentials: { email, password } }));
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
