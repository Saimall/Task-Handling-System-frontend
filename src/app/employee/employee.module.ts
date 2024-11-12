import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeedashboardComponent } from './employeedashboard/employeedashboard.component';
import { AppRoutingModule } from '../app-routing.module';
import { BaseChartDirective } from 'ng2-charts';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    EmployeedashboardComponent,
    EditProfileComponent,

  ],
  imports: [
    CommonModule,
    BaseChartDirective,
    AppRoutingModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    FormsModule
   
  ]
})
export class EmployeeModule { }
