import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigureTasksComponent } from './configure-tasks/configure-tasks.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [
    ConfigureTasksComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    RouterModule
  ]
})
export class TasksModule { }
