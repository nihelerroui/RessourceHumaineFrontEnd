import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecettesListComponent } from './recettes-list/recettes-list.component';

const routes: Routes = [
  { path: 'list', component: RecettesListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecettesRoutingModule { }
