import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './dashboards/default/default.component';




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



];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }