import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContratSousTraitantComponent } from './contrat-sous-traitant/contrat-sous-traitant.component';
import { ContratClientAdminComponent } from './contrat-client/contrat-client.component';
import { ListeContratSousTraitantComponent } from './liste-contrat-sous-traitant/liste-contrat-sous-traitant.component';
import { ImportContratComponent } from './import-contrat/import-contrat.component';
import { ContratsClientListComponent } from './contrats-client-list/contrats-client-list.component';

const routes: Routes = [
  { path: "contratsoustraitant", component: ContratSousTraitantComponent },
  { path: "listcontratsoustraitant", component: ListeContratSousTraitantComponent},
  { path: "contratclientadmin", component: ContratClientAdminComponent },
  { path: 'import-contrat/:token', component: ImportContratComponent },
  { path: 'contrats-client/:token', component: ContratsClientListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContratRoutingModule { }
