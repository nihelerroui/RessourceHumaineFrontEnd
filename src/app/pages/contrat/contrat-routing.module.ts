import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContratSousTraitantComponent } from './contrat-sous-traitant/contrat-sous-traitant.component';
import { ImportContratComponent } from './import-contrat/import-contrat.component';

const routes: Routes = [
  {
    path: 'contratsoustraitant',
    component: ContratSousTraitantComponent
},
{
  path: 'import-contrat/:token',
  component: ImportContratComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContratRoutingModule { }
