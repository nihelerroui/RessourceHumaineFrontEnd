import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '../../../core/services/auth.service';
import { UserProfileService } from '../../../core/services/user.service';
import { Store } from '@ngrx/store';
import { register } from 'src/app/store/Authentication/authentication.actions';

@Component({
  selector: 'app-register2',
  templateUrl: './register2.component.html',
  styleUrls: ['./register2.component.scss']
})
export class Register2Component implements OnInit {
  signupForm: UntypedFormGroup;
  submitted = false;
  error: any = '';
  successmsg: any = false;
  year: number = new Date().getFullYear();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserProfileService,
    public store: Store
  ) { }

  ngOnInit(): void {
    document.body.classList.add("auth-body-bg");

    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  // Swiper config (if needed)
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true
  };

  /**
   * On submit form
   */
  onSubmit() {
    this.submitted = true;
    if (this.signupForm.invalid) {
      return;
    }
    const email = this.f['email'].value;
    const password = this.f['password'].value;
    // Dispatch Action with the correct payload shape.
    this.store.dispatch(register({ credentials: { email, password } }));
  }
}
