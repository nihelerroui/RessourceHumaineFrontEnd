import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { caisseReducer } from 'src/app/store/caisse/caisse.reducer';
import { CaisseEffects } from 'src/app/store/caisse/caisse.effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { TresorieComponent } from './tresorie/tresorie.component';
import { CaisseRoutingModule } from './caisse-routing.module';



@NgModule({
  declarations: [
    TresorieComponent

  ],
  imports: [
    CommonModule,
    CaisseRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('caisse', caisseReducer),
    EffectsModule.forFeature([CaisseEffects]),
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    UIModule,


  ]
})
export class CaisseModule { }
