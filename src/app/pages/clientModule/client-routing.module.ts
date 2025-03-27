import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmptyLayoutComponent } from 'src/app/layouts/empty-layout/empty-layout.component';
import { ImportContratComponent } from '../contrat/import-contrat/import-contrat.component';
import { ContratsClientListComponent } from '../contrat/contrats-client-list/contrats-client-list.component';


const routes: Routes = [
  {
    path: '',
    component: EmptyLayoutComponent,
    children: [
      { path: 'import-contrat/:token', component: ImportContratComponent },
      { path: 'contrats-client/:token', component: ContratsClientListComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule {}
