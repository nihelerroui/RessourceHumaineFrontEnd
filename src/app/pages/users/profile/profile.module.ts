import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProfileViewComponent } from './profileview/profileview.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { ProfileEditComponent } from './userprofileedit/profileedit.component';
import { NgStepperModule } from 'angular-ng-stepper';
import { CdkStepperModule } from '@angular/cdk/stepper';

const routes: Routes = [
  {
    path: '',
    component: ProfileViewComponent
  }
];

@NgModule({
  declarations: [ProfileViewComponent , ProfileEditComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    UIModule,
    NgStepperModule,
    CdkStepperModule
  ]
})
export class ProfileModule { }
