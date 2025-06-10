import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FactureSousTraitantComponent } from './facture-sous-traitant/facture-sous-traitant.component';

const routes: Routes = [
  { path: 'list', component: FactureSousTraitantComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FactureSousTraitantRoutingModule { }
