import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigureTasksComponent } from './configure-tasks/configure-tasks.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ConfigureTasksComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TasksModule { }
