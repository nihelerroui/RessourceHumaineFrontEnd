import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './layouts/layout.component';
import { CyptolandingComponent } from './cyptolanding/cyptolanding.component';
import { Page404Component } from './extrapages/page404/page404.component';
import { FactureClientDetailComponent } from './pages/factureclientdetail/factureclientdetailview/factureclientdetail.component'; // Import the detail component
import { ClientViewFactureComponent } from './pages/clientsidefacture/clientsidefactureview/clientsidefacture.component'; // Import the detail component
import { ModalModule } from 'ngx-bootstrap/modal';
import { ResetPasswordComponent } from './pages/resetpassword/resetpassword.component';

import { ForgotPasswordComponent } from './pages/forgotpassword/forgotpassword.component';
const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
  { path: '', component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate: [AuthGuard] },
  { path: 'pages', loadChildren: () => import('./extrapages/extrapages.module').then(m => m.ExtrapagesModule), canActivate: [AuthGuard] },

  
  { 
    path: 'facture/client/details/:id', // Define a separate route for the FactureListComponent
    component: FactureClientDetailComponent // Add AuthGuard if needed
  },
  {
    path: 'facture/client/view/:id',
    loadChildren: () => import('./pages/clientsidefacture/clientsidefacture.module').then(m => m.ClientSideFactureModule)
  },
  {
    path: 'facture/client/create',
    loadChildren: () => import('./pages/factureclientcreate/factureclientcreate.module').then(m => m.FactureClientCreateModule)

  },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: '**', component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' }), ModalModule.forRoot()],
  exports: [RouterModule]
})
export class AppRoutingModule { }