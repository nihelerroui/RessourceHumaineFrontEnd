import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "./login/login.component";
import { PasswordresetComponent } from "./passwordreset/passwordreset.component";
import { PasswordConfirmComponent } from "./password-confirm/password-confirm.component";

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "reset-password",
    component: PasswordresetComponent,
  },
  {
    path: "reset-password/confirm",
    component: PasswordConfirmComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
