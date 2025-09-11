import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { societeReducer } from 'src/app/store/societe/societe.reducer';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SocieteEffects } from 'src/app/store/societe/societe.effects';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { SocieteRoutingModule } from './societe-routing.module';
import { SocieteListComponent } from './societe-list/societe-list.component';



@NgModule({
  declarations: [
    SocieteListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('societe', societeReducer),
    EffectsModule.forFeature([SocieteEffects]),
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    UIModule,
    SocieteRoutingModule
  ]
})
export class SocieteModule { }
