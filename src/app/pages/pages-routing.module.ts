import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from './dashboards/default/default.component';
import { PaysListComponent } from './pays/pays-list/pays-list.component';


const routes: Routes = [
  // { path: '', redirectTo: 'dashboard' },
  {
    path: "",
    component: DefaultComponent
  },
  { path: 'dashboard', component: DefaultComponent },
  { path: 'dashboards', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule) },
  { path: 'prestations', loadChildren: () => import('./prestations/prestations.module').then(m => m.PrestationsModule) },
  { path: "contrat", loadChildren: () => import("./contrat/contrat.module").then((m) => m.ContratModule) },
  { path: 'list', component: PaysListComponent },
  { path: 'pays', loadChildren: () => import('./pays/pays.module').then(m => m.PaysModule) },
  //{ path: 'list', component: SocieteComponent },
  { path: 'societe', loadChildren: () => import('./societe/societe.module').then(m => m.SocieteModule) },
  { path: 'client', loadChildren: () => import('./client/client.module').then(m => m.ClientModule) },
  { path: 'facture', loadChildren: () => import('./facture/facture.module').then(m => m.FactureModule) },
  { path: 'tresorie', loadChildren: () => import('./tresorie/tresorie.module').then(m => m.TresorieModule) },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
