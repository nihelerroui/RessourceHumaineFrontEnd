import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FactureListComponent } from './facture-list/facture-list.component';

const routes: Routes = [
  { path: 'list', component: FactureListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FactureRoutingModule { }
