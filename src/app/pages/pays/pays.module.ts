import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaysRoutingModule } from './pays-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { PaysListComponent } from './pays-list/pays-list.component';
import { PaysEffects } from 'src/app/store/pays/pays.effects';
import { paysReducer } from 'src/app/store/pays/pays.reducer';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';


@NgModule({
  declarations: [
    PaysListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('pays', paysReducer),
    EffectsModule.forFeature([PaysEffects]),
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    UIModule,
    PaysRoutingModule,
  ]
})
export class PaysModule { }
