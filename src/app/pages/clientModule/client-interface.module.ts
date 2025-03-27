import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ModalModule } from 'ngx-bootstrap/modal';
import { ClientRoutingModule } from './client-routing.module';
import { LayoutsModule } from 'src/app/layouts/layouts.module';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ModalModule.forRoot(),
    ClientRoutingModule,
    LayoutsModule,

  ]
})
export class ClientInterfaceModule {}
