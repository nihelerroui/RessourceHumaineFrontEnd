import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FactureRoutingModule } from './facture-routing.module';
import { FactureListComponent } from './facture-list/facture-list.component';
import { factureAchatReducer } from 'src/app/store/factureAchat/factureAchat.reducer';
import { FactureAchatEffects } from 'src/app/store/factureAchat/factureAchat.effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';


@NgModule({
  declarations: [
    FactureListComponent
  ],
  imports: [
    CommonModule,
    FactureRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('factureAchat', factureAchatReducer),
    EffectsModule.forFeature([FactureAchatEffects]),
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    UIModule
  ]
})
export class FactureModule { }
