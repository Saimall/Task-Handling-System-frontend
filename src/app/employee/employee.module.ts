import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeedashboardComponent } from './employeedashboard/employeedashboard.component';
import { AppRoutingModule } from '../app-routing.module';
import { BaseChartDirective } from 'ng2-charts';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    EmployeedashboardComponent,

  ],
  imports: [
    CommonModule,
    BaseChartDirective,
    AppRoutingModule,
    MatSnackBarModule
   
  ]
})
export class EmployeeModule { }
