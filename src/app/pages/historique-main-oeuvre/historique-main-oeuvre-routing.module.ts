import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoriqueMainOeuvreListComponent } from './historique-main-oeuvre-list/historique-main-oeuvre-list.component';

const routes: Routes = [
   { path: 'list', component: HistoriqueMainOeuvreListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoriqueMainOeuvreRoutingModule { }
