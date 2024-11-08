import { Component } from '@angular/core';
import { ManagerService } from '../../services/managerservice/manager.service';

import { TaskserviceService } from '../../services/taskservice/taskservice.service';
import {EmployeeserviceService} from '../../services/employeeservice/employeeservice.service'
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from '../../models/Task';

@Component({
  selector: 'app-configure-tasks',
  templateUrl: './configure-tasks.component.html'
})
export class ConfigureTasksComponent {


  taskForm: FormGroup;

 
  
  newTask: any = {taskTitle:'',taskDescription:'' ,dueDateTime:'',priority:'',status:'' };
  isAddTaskModalOpen = false;
  projectID: any=null 
  managerID: any=null 
  tasks: Task[] = [];
 
  employees: any[] = [];

  openAddTaskModal() {

    this.isAddTaskModalOpen = true;
    this.taskForm.reset({
      priority: 'LOW' 
    });
  }

  closeAddTaskModal() {
    this.isAddTaskModalOpen = false;
    this.taskForm.reset(); 
  }


  constructor(
    private route: ActivatedRoute,
    private managerService: ManagerService,
    private taskservice:TaskserviceService,
    private employeeservice:EmployeeserviceService,
    private fb: FormBuilder
  ) {
    this.taskForm = this.fb.group({
      taskTitle: ['', Validators.required],
      dueDate: ['', Validators.required], 
      dueTime: ['', Validators.required], 
      taskDescription: ['', Validators.required],
      priority: ['LOW', Validators.required],
      employeeId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
   
    this.route.paramMap.subscribe((params) => {
      this.managerID = params.get('managerId');
      this.projectID = params.get('projectId');

      console.log("managerid"+this.managerID);
      console.log("projectID"+this.projectID)

      if (this.managerID && this.projectID) {
        this.loadEmployees();
       
        
      }
    });
  }

  loadTasks() {
    this.taskservice.getTasksByProjectId(this.projectID).subscribe((data) => {
      this.tasks = data;
      console.log('Tasks (JSON string):', JSON.stringify(this.tasks, null, 2));

      console.log("EMployees"+ JSON.stringify(this.employees))
      this.tasks.forEach(task => {
        const assignedEmployee = this.employees.find(employee => employee.empId === task.employeeId);
        if (assignedEmployee) {
          console.log("employee name"+ JSON.stringify(assignedEmployee));
          console.log("task deatils",)
          task.assignedTo = assignedEmployee.name; 
        }
      });
    });
  }

  loadEmployees() {
    this.employeeservice.getEmployee(this.managerID).subscribe((data) => {
    
      this.employees = data;
      this.loadTasks();
      console.log("Employees in task"+ JSON.stringify(this.employees))
    });
  }


  saveNewTask() {

    console.log(this.taskForm);
    if (this.taskForm.valid) {
      let taskData: any = this.taskForm.value; 

      const selectedDate = this.taskForm.get('dueDate')?.value;
      const selectedTime = this.taskForm.get('dueTime')?.value;
      
      if (selectedDate && selectedTime) {
        const dateTimeString = `${selectedDate}T${selectedTime}`;
         
    
         console.log(dateTimeString);
    
        
        this.taskForm.get('dueDateTime')?.setValue(dateTimeString);
         taskData = {
          taskTitle: this.taskForm.get('taskTitle')?.value,
          taskDescription: this.taskForm.get('taskDescription')?.value,
          priority: this.taskForm.get('priority')?.value,
          employeeId: this.taskForm.get('employeeId')?.value,
          dueDateTime: dateTimeString, 
        };
      }
     

  
      console.log("TaskData"+ JSON.stringify(taskData))
      this.taskservice.addTaskToProject(this.projectID, taskData).subscribe({
        next: (data) => {
          console.log("task data",data);
          this.loadEmployees();
          this.tasks.push(data);
          this.closeAddTaskModal();
        },
        error: (error) => {
          console.error('Failed to save task', error);
        }
      });
    } else {
      this.taskForm.markAllAsTouched(); 
    }
  }



  updateTask(task: any) {
    
    console.log('Updating task:', task);
  }

  deleteTask(taskId: string) {
    // this.taskservice.deleteTask(taskId).subscribe(() => {
    //   this.tasks = this.tasks.filter(task => task.id !== taskId);
    // });
  }

}
