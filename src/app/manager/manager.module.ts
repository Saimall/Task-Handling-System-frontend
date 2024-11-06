import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormsModule } from '@angular/forms'; 

import { ManagerRegistrationFormComponent } from './manager-registration-form/manager-registration-form.component';
import { ManagerdashboardComponent } from './managerdashboard/managerdashboard.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { AppRoutingModule } from '../app-routing.module';
@NgModule({
  declarations: [ManagerRegistrationFormComponent,ManagerdashboardComponent, AddProjectComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    FormsModule,
    AppRoutingModule
  ],
  exports: [ManagerRegistrationFormComponent], 
})
export class ManagerModule { }
