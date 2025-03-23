import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
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
    private router: Router,
    private route: ActivatedRoute // Inject ActivatedRoute
 
  ) { }
  ngOnInit() {
    if (sessionStorage.getItem('currentUser')) {
      this.router.navigate(['/dashboard']);
    }

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    const tokenSub = this.store.pipe(select(selectAccessToken)).subscribe(token => {
      console.log("Token:", token);
      sessionStorage.setItem('currentUserToken', token);
      if (token) {
        this.store.dispatch(getUser());
      }
    });
    this.subscriptions.push(tokenSub);

    const userSub = this.store.pipe(select(selectUser)).subscribe(user => {
      if (user) {
        console.log("Utilisateur récupéré:", user);
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        console.log("Redirecting to:", returnUrl);
        this.router.navigateByUrl(returnUrl); // Now properly redirects
      }
    });
    this.subscriptions.push(userSub);
}
  

  get f() { return this.loginForm.controls; }

  onSubmit() {
    console.log("Formulaire soumis");
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    const email = this.f['email'].value;
    const password = this.f['password'].value;
    console.log("Email:", email, "Mot de passe:", password);
    this.store.dispatch(login({ credentials: { email, password } }));
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
