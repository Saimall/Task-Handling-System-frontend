import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeedashboardComponent } from './employeedashboard/employeedashboard.component';
import { AppRoutingModule } from '../app-routing.module';
import { BaseChartDirective } from 'ng2-charts';


@NgModule({
  declarations: [
    EmployeedashboardComponent,

  ],
  imports: [
    CommonModule,
    BaseChartDirective,
    AppRoutingModule,
 
   
  ]
})
export class EmployeeModule { }
