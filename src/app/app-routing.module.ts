import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './layouts/layout.component';
import { CyptolandingComponent } from './cyptolanding/cyptolanding.component';
import { Page404Component } from './extrapages/page404/page404.component';
import { FactureListComponent } from './pages/facture/facture-list/facture-list.component'; // Import the component
import { FactureClientDetailComponent } from './pages/factureclientdetail/factureclientdetailview/factureclientdetail.component'; // Import the detail component

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
  { path: '', component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate: [AuthGuard] },
  { path: 'pages', loadChildren: () => import('./extrapages/extrapages.module').then(m => m.ExtrapagesModule), canActivate: [AuthGuard] },
  { path: 'crypto-ico-landing', component: CyptolandingComponent },
  { 
    path: 'factures/:id/:name', // Define a separate route for the FactureListComponent
    component: FactureListComponent // Add AuthGuard if needed
  },
  { 
    path: 'facture/client/details/:id', // Define a separate route for the FactureListComponent
    component: FactureClientDetailComponent // Add AuthGuard if needed
  },
  { path: '**', component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }