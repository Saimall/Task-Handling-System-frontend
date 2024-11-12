import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigureTasksComponent } from './configure-tasks/configure-tasks.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
@NgModule({
  declarations: [
    ConfigureTasksComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatTooltipModule,
  ]
})
export class TasksModule { }
