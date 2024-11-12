import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigureTasksComponent } from './configure-tasks/configure-tasks.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
<<<<<<< HEAD
import { MatTooltipModule } from '@angular/material/tooltip';
=======
import { RouterModule } from '@angular/router';
>>>>>>> 02de43a9edb06eac02f8035a97b3c764f738187d
@NgModule({
  declarations: [
    ConfigureTasksComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
<<<<<<< HEAD
    MatTooltipModule,
=======
    RouterModule
>>>>>>> 02de43a9edb06eac02f8035a97b3c764f738187d
  ]
})
export class TasksModule { }
