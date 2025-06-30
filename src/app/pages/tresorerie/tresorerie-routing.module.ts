import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TresorerieComponent } from './tresorerie/tresorerie.component';

const routes: Routes = [{ path: '', component: TresorerieComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TresorerieRoutingModule { }
