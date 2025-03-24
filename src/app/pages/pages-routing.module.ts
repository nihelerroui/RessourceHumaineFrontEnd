import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './dashboards/default/default.component';
import { ProfileEditComponent } from './userprofileedit/profileedit.component';
import { PaysListComponent } from './pays/pays-list/pays-list.component';



const routes: Routes = [
  {
    path: "",
    component: DefaultComponent
  },
  { path: 'dashboard', component: DefaultComponent },
  { path: 'dashboards', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule) },


  { path: 'prestations', loadChildren: () => import('./prestations/prestations.module').then(m => m.PrestationsModule) },
  { path: 'depenses', loadChildren: () => import('./depenses/depenses.module').then(m => m.DepensesModule) },
  { path: 'factureclient', loadChildren: () => import('./factureclient/factureclient.module').then(m => m.FactureClientModule) },
  { path: 'utilisateurs', loadChildren: () => import('./utilisateurs/utilisateurs.module').then(m => m.UtilisateursModule) },
  { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule) },
  { path: 'profile/edit', component: ProfileEditComponent },

  {
    path: "contrat",
    loadChildren: () => import("./contrat/contrat.module").then((m) => m.ContratModule),
  },
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