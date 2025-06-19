import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from './dashboards/default/default.component';
import { PaysListComponent } from './pays/pays-list/pays-list.component';
import { ProfileEditComponent } from './users/profile/userprofileedit/profileedit.component';
import { AuthGuard } from '../core/guards/auth.guard';



const routes: Routes = [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  { path: 'dashboard', component: DefaultComponent },
  { path: 'dashboards', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule) },
  { path: 'prestations', loadChildren: () => import('./prestations/prestations.module').then(m => m.PrestationsModule), canActivate: [AuthGuard],
  data: { roles: ['ADMINISTRATEUR', 'RESPONSABLE_FINANCIER'] } },
  { path: "contratsoustraitant", loadChildren: () => import("./contratSousTraitant/contrat-sous-traitant.module").then((m) => m.ContratSousTraitantModule),data: { roles: ['ADMINISTRATEUR', 'RESPONSABLE_FINANCIER','SOUS_TRAITANT'] }  },
  { path: 'pays', loadChildren: () => import('./pays/pays.module').then(m => m.PaysModule), canActivate: [AuthGuard],
  data: { roles: ['ADMINISTRATEUR'] }  },
  { path: 'societe', loadChildren: () => import('./societe/societe.module').then(m => m.SocieteModule), canActivate: [AuthGuard],
  data: { roles: ['ADMINISTRATEUR'] }  },
  { path: 'client', loadChildren: () => import('./client/client.module').then(m => m.ClientModule),canActivate: [AuthGuard],
  data: { roles: ['ADMINISTRATEUR', 'RESPONSABLE_FINANCIER'] } },
  { path: 'facture', loadChildren: () => import('./facture/facture.module').then(m => m.FactureModule),canActivate: [AuthGuard],
  data: { roles: ['ADMINISTRATEUR', 'RESPONSABLE_FINANCIER'] } },
  { path: 'tresorie', loadChildren: () => import('./tresorie/tresorie.module').then(m => m.TresorieModule),canActivate: [AuthGuard],
  data: { roles: ['ADMINISTRATEUR', 'RESPONSABLE_FINANCIER'] } },
  { path: 'factureclientadmin', loadChildren: () => import('./factureclient-admin/factureclient-admin.module').then(m => m.FactureclientAdminModule),canActivate: [AuthGuard],
  data: { roles: ['ADMINISTRATEUR', 'RESPONSABLE_FINANCIER'] } },
  { path: 'facture/client/create', loadChildren: () => import('../pages/factureclientcreate/factureclientcreate.module').then(m => m.FactureClientCreateModule),canActivate: [AuthGuard],
  data: { roles: ['ADMINISTRATEUR', 'RESPONSABLE_FINANCIER'] } },
  { path: 'facture/client/view',
    loadChildren: () => import('./factureclient_client/clientfacture.module').then(m => m.ClientFactureModule),canActivate: [AuthGuard],
  data: { roles: ['ADMINISTRATEUR', 'RESPONSABLE_FINANCIER'] }
  },
  { path: 'depenses', loadChildren: () => import('./depenses/depenses.module').then(m => m.DepensesModule),canActivate: [AuthGuard],
  data: { roles: ['ADMINISTRATEUR', 'RESPONSABLE_FINANCIER'] } },
  { path: 'mainOeuvre', loadChildren: () => import('./mainOeuvre/main-oeuvre.module').then(m => m.MainOeuvreModule),canActivate: [AuthGuard],
  data: { roles: ['ADMINISTRATEUR', 'RESPONSABLE_FINANCIER'] } },
  { path: 'historique-mainoeuvre', loadChildren: () => import('./historique-main-oeuvre/historique-main-oeuvre.module').then(m => m.HistoriqueMainOeuvreModule),canActivate: [AuthGuard],
  data: { roles: ['ADMINISTRATEUR', 'RESPONSABLE_FINANCIER'] } },
  { path: 'historique-chiffreAffaire', loadChildren: () => import('./historiqueChiffreAffaire/historiqueChiffreAffaire.module').then(m => m.HistoriqueChiffreAffaireModule),canActivate: [AuthGuard],
  data: { roles: ['ADMINISTRATEUR', 'RESPONSABLE_FINANCIER'] } },
  { path: 'contratclientadmin', loadChildren: () => import('./contratClient/contrat-client.module').then(m => m.ContratClientModule),canActivate: [AuthGuard],
  data: { roles: ['ADMINISTRATEUR', 'RESPONSABLE_FINANCIER'] } },
  { path: 'import-contrat/:token', loadChildren: () => import('./ImportationContrat/importerContrat.module').then(m => m.ImporterContratModule) },
  { path: 'contrats-client/:clientId', loadChildren: () => import('./contratClient_Client/contrat-client_Client.module').then(m => m.ContratClient_ClientModule) },
  { path: 'users', loadChildren: () => import('./users/user.module').then(m => m.UserModule),canActivate: [AuthGuard],
  data: { roles: ['ADMINISTRATEUR'] } },
  { path: 'recettes', loadChildren: () => import('./recettes/recettes.module').then(m => m.RecettesModule),canActivate: [AuthGuard],
  data: { roles: ['ADMINISTRATEUR', 'RESPONSABLE_FINANCIER'] } },
  { path: 'factureSousTraitant', loadChildren: () => import('./factureSousTraitant/facture-sous-traitant.module').then(m => m.FactureSousTraitantModule),canActivate: [AuthGuard],
  data: { roles: ['ADMINISTRATEUR', 'RESPONSABLE_FINANCIER','SOUS_TRAITANT'] } },
  { path: 'profile', loadChildren: () => import('./users/profile/profile.module').then(m => m.ProfileModule),canActivate: [AuthGuard],
  data: { roles: ['ADMINISTRATEUR', 'RESPONSABLE_FINANCIER','SOUS_TRAITANT'] } },
  { path: 'profile/edit', component : ProfileEditComponent , canActivate: [AuthGuard],
  data: { roles: ['ADMINISTRATEUR', 'RESPONSABLE_FINANCIER','SOUS_TRAITANT'] } },
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
