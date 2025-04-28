import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainOeuvreRoutingModule } from './main-oeuvre-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { mainOeuvreReducer } from 'src/app/store/mainOeuvre/mainOeuvre.reducer';
import { MainOeuvreEffects } from 'src/app/store/mainOeuvre/mainOeuvre.effects';
import { EffectsModule } from '@ngrx/effects';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { MainOeuvreListComponent } from './main-oeuvre-list/main-oeuvre-list.component';


@NgModule({
  declarations: [
    MainOeuvreListComponent
  ],
  imports: [
    CommonModule,
    MainOeuvreRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('mainOeuvre', mainOeuvreReducer),
    EffectsModule.forFeature([MainOeuvreEffects]),
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    UIModule
  ]
})
export class MainOeuvreModule { }
