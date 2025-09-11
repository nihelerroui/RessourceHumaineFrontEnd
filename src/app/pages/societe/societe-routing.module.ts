import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SocieteListComponent } from './societe-list/societe-list.component';

const routes: Routes = [
  { path: 'list', component: SocieteListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SocieteRoutingModule { }
