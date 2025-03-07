import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContratSousTraitantComponent } from './contrat-sous-traitant/contrat-sous-traitant.component';

const routes: Routes = [
  {
    path: 'contratsoustraitant',
    component: ContratSousTraitantComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContratRoutingModule { }
