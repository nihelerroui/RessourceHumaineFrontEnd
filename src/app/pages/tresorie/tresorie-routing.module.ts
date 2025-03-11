import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TresorieComponent } from './tresorie/tresorie.component';


const routes: Routes = [
  { path: '', component: TresorieComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TresorieRoutingModule { }
