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
  { path: "contratsoustraitant", loadChildren: () => import("./contratSousTraitant/contrat-sous-traitant.module").then((m) => m.ContratSousTraitantModule) },
  { path: 'list', component: PaysListComponent },
  { path: 'pays', loadChildren: () => import('./pays/pays.module').then(m => m.PaysModule) },
  //{ path: 'list', component: SocieteComponent },
  { path: 'societe', loadChildren: () => import('./societe/societe.module').then(m => m.SocieteModule) },
  { path: 'client', loadChildren: () => import('./client/client.module').then(m => m.ClientModule) },
  { path: 'facture', loadChildren: () => import('./facture/facture.module').then(m => m.FactureModule) },
  { path: 'tresorie', loadChildren: () => import('./tresorie/tresorie.module').then(m => m.TresorieModule) },
  { path: 'factureclientadmin', loadChildren: () => import('./factureclient-admin/factureclient-admin.module').then(m => m.FactureclientAdminModule) },
  { path: 'facture/client/create', loadChildren: () => import('../pages/factureclientcreate/factureclientcreate.module').then(m => m.FactureClientCreateModule) },
  { path: 'facture/client/view',
    loadChildren: () => import('./factureclient_client/clientfacture.module').then(m => m.ClientFactureModule)
  },
  { path: 'depenses', loadChildren: () => import('./depenses/depenses.module').then(m => m.DepensesModule) },
  { path: 'mainOeuvre', loadChildren: () => import('./mainOeuvre/main-oeuvre.module').then(m => m.MainOeuvreModule) },
  { path: 'historique-mainoeuvre', loadChildren: () => import('./historique-main-oeuvre/historique-main-oeuvre.module').then(m => m.HistoriqueMainOeuvreModule) },
  //{ path: 'historique-chiffreAffaire', loadChildren: () => import('./historiqueChiffreAffaire/historiqueChiffreAffaire.module').then(m => m.HistoriqueChiffreAffaireModule) },
  { path: 'contratclientadmin', loadChildren: () => import('./contratClient/contrat-client.module').then(m => m.ContratClientModule) },
  { path: 'import-contrat/:token', loadChildren: () => import('./ImportationContrat/importerContrat.module').then(m => m.ImporterContratModule) },
  { path: 'contrats-client/:clientId', loadChildren: () => import('./contratClient_Client/contrat-client_Client.module').then(m => m.ContratClient_ClientModule) },
  { path: 'users', loadChildren: () => import('./users/user.module').then(m => m.UserModule) },
  { path: 'recettes', loadChildren: () => import('./recettes/recettes.module').then(m => m.RecettesModule) },
  { path: 'factureSousTraitant', loadChildren: () => import('./factureSousTraitant/facture-sous-traitant.module').then(m => m.FactureSousTraitantModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
