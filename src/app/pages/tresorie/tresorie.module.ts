import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TresorieRoutingModule } from './tresorie-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { tresorieReducer } from 'src/app/store/tresorie/tresorie.reducer';
import { TresorieEffects } from 'src/app/store/tresorie/tresorie.effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { TresorieComponent } from './tresorie/tresorie.component';



@NgModule({
  declarations: [
    TresorieComponent

  ],
  imports: [
    CommonModule,
    TresorieRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('tresorie', tresorieReducer),
    EffectsModule.forFeature([TresorieEffects]),
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    UIModule,


  ]
})
export class TresorieModule { }
