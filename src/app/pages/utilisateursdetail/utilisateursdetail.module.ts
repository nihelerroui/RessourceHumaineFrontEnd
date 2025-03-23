import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // Assuming you need routing, add it if necessary
import { PaginationModule } from 'ngx-bootstrap/pagination'; // For pagination
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'; // For date handling
import { NgxSliderModule } from 'ngx-slider-v2'; // For slider
import { SharedModule } from '../../shared/shared.module'; // If you have any shared components or pipes

import { UtilisateurdetailviewComponent } from './utilisateurdetailview/utilisateurdetailview.component';

@NgModule({
  declarations: [UtilisateurdetailviewComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule, // Add this if your module needs routing
    PaginationModule.forRoot(), // Pagination support
    SharedModule, // Assuming you have shared components/pipes
    BsDatepickerModule.forRoot(), // Date picker support
    NgxSliderModule // Slider support
  ],
  exports: [UtilisateurdetailviewComponent] // Export it to be used elsewhere
})
export class UtilisateursDetailModule { }
