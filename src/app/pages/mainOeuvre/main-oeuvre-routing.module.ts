import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainOeuvreListComponent } from './main-oeuvre-list/main-oeuvre-list.component';

const routes: Routes = [
  { path: 'list', component: MainOeuvreListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainOeuvreRoutingModule { }
