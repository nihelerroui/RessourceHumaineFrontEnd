import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaysListComponent } from './pays-list/pays-list.component';

const routes: Routes = [
  { path: 'list', component: PaysListComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaysRoutingModule { }
