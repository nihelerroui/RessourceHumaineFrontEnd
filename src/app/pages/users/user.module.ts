import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserEffects } from 'src/app/store/user/user.effects';
import { userReducer } from 'src/app/store/user/user.reducer';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { UsersListComponent } from './users-list/users-list.component';
import { UtilisateurregisterviewComponent } from './utilisateurregisterview/utilisateurregisterview.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';


@NgModule({
  declarations: [
    UsersListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UserRoutingModule,
    PaginationModule.forRoot(),
    StoreModule.forFeature('users', userReducer),
    EffectsModule.forFeature([UserEffects]) ,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    UIModule,
    
  ]
})
export class UserModule { }
