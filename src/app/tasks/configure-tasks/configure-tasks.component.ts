import { Component } from '@angular/core';
import { ManagerService } from '../../services/managerservice/manager.service';

import { TaskserviceService } from '../../services/taskservice/taskservice.service';
import {EmployeeserviceService} from '../../services/employeeservice/employeeservice.service'
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from '../../models/Task';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectService } from '../../services/projectservice/project.service';
import { Project } from '../../models/project';

@Component({
  selector: 'app-configure-tasks',
  templateUrl: './configure-tasks.component.html'
})
export class ConfigureTasksComponent {


  taskForm: FormGroup;

  selectedTask: Task = {
    taskId: '',
    taskTitle: '',
    taskDescription: '',
    status: 'TODO',
    assignedTo: '',
    priority: 'LOW',
    dueDate: '',
    dueDateTime: '',
    empId: undefined,
    employeeId: '',
    createdAt: '',
    updatedAt: '',
    completedAt: '',
    employeeDetails: ''          
  };
 
  
  newTask: any = {taskTitle:'',taskDescription:'' ,dueDateTime:'',priority:'',status:'' };
  isAddTaskModalOpen = false;
  projectID: any=null 
  managerID: any=null 
  tasks: Task[] = [];
  reviewmodelopen:boolean=false;
  project?:Project
 
  employees: any[] = [];
  isUpdateTaskModalOpen: boolean = false;

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
    private fb: FormBuilder,
    private snackbar:MatSnackBar,
    private projectservice:ProjectService,
   
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
        this.getprojectdata();
       
        
      }
    });
  }

  updateTaskDetails() {
    if (this.taskForm.valid) {

      const selectedDate = this.taskForm.get('dueDate')?.value;
    const selectedTime = this.taskForm.get('dueTime')?.value;
    const projectStartDate = this.project?.startDate ? new Date(this.project.startDate) : null;
    const projectEndDate = this.project?.endDate ? new Date(this.project.endDate) : null;
    
  
    const selectedDateOnly = new Date(selectedDate);
    const projectStartDateOnly = projectStartDate ? new Date(projectStartDate.toDateString()) : null;
    const projectEndDateOnly = projectEndDate ? new Date(projectEndDate.toDateString()) : null;
    
    if (selectedDate && projectStartDateOnly && projectEndDateOnly && 
        (selectedDateOnly < projectStartDateOnly || selectedDateOnly > projectEndDateOnly)) {
      this.snackbar.open('Selected Date is not in the Project Date Range', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      return;
    }




      const updatedTask: Task = {
        taskTitle: this.taskForm.get('taskTitle')?.value,
        taskDescription: this.taskForm.get('taskDescription')?.value,
        priority: this.taskForm.get('priority')?.value,
        employeeId: this.taskForm.get('employeeId')?.value,
        dueDateTime: `${this.taskForm.get('dueDate')?.value}T${this.taskForm.get('dueTime')?.value}`,
        status: this.selectedTask.status,
        taskId: this.selectedTask.taskId,
        employeeDetails: ''
      };

 
 if(this.selectedTask.taskId!=null){
 
      this.taskservice.updateTask(this.selectedTask.taskId, updatedTask).subscribe({
        next: (updatedTask) => {
          this.snackbar.open('Task updated successfully!', 'Close', { duration: 3000, horizontalPosition: 'right',
            verticalPosition: 'top' });
          this.loadTasks();
          this.closeUpdateTaskModal();
        },
        error: (error) => {
          this.snackbar.open('Failed to update the task.', 'Close', { duration: 3000 });
          console.error('Error updating task:', error);
        }
      });
    } else {
      this.taskForm.markAllAsTouched(); // Mark all fields as touched to show validation errors
    }
  }
}


openUpdateTaskModel(task:Task){
 
  this.selectedTask = task;

  const dueDateTime = task.dueDateTime || '';

  this.taskForm.setValue({
    taskTitle: task.taskTitle,
    taskDescription: task.taskDescription,
    dueDate: dueDateTime.split('T')[0] ,
    dueTime: dueDateTime.split('T')[1],
    priority: task.priority,
    employeeId: task.employeeId
  });
  this.isUpdateTaskModalOpen = true;
}
// openReviewModal(task: any) {
//   this.selectedTask = task;
//   const modal = document.querySelector('#reviewModal') as HTMLElement;
//   modal.style.display = 'flex';
// }
  // closeModal() {
  //   const modal = document.querySelector('#reviewModal') as HTMLElement;
  //   modal.style.display = 'none';
  // }

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
          
          task.employeeDetails = `ID: ${assignedEmployee.empId}\nName: ${assignedEmployee.name}\nRole: ${assignedEmployee.designation}\nEmail: ${assignedEmployee.email}\nContact: ${assignedEmployee.contact}`;
          console.log(task.employeeDetails);
          
        }
      });
    });
  }

  // approveTask(task: any) {
  //   this.updateTaskStatus(task.id, 'COMPLETED');
  //   this.closeModal();
  // }

  closeUpdateTaskModal() {
    this.isUpdateTaskModalOpen = false;
    this.taskForm.reset();
  }

  loadEmployees() {
    this.employeeservice.getEmployee(this.managerID).subscribe((data) => {
    
      this.employees = data;
      this.loadTasks();
      console.log("Employees in task"+ JSON.stringify(this.employees))
    });
  }

  // requestRework(task: any) {
  //   this.updateTaskStatus(task.id, 'TODO');
  //   this.closeModal();
  // }
  // updateTaskStatus(taskId: number, status: string) {
  //   this.taskservice.updateTaskStatus(taskId, status).subscribe({
  //     next: (response) => {
       
  //       this.snackbar.open('FeedBack sent Successfully!!', 'Close', {
  //         duration: 3000,
  //         horizontalPosition: 'right',
  //         verticalPosition: 'top',
  //       });
  //     },
  //     error: (err) => {
       
  //       this.snackbar.open('Failed to sent the FeedBack!!', 'Close', {
  //         duration: 3000,
  //         horizontalPosition: 'right',
  //         verticalPosition: 'top',
  //       });
  //     }
  //   });
  // }


  getprojectdata() {
    console.log('Fetching project data for ID:', this.projectID); // Add this debug log
    
    this.projectservice.getProjectById(this.projectID).subscribe({
      next: (data) => {
        this.project = data;
        console.log("Project data received:", this.project);
      },
      error: (error) => {
        console.error("Error fetching project data:", error);
        this.snackbar.open('Failed to load project data', 'Close', {
          duration: 3000
        });
      }
    });
  }


  saveNewTask() {

    console.log(this.taskForm);
    if (this.taskForm.valid) {
      let taskData: any = this.taskForm.value; 

      const selectedDate = this.taskForm.get('dueDate')?.value;
      const selectedTime = this.taskForm.get('dueTime')?.value;
      const projectStartDate = this.project?.startDate ? new Date(this.project.startDate) : null;
      const projectEndDate = this.project?.endDate ? new Date(this.project.endDate) : null;
      const selectedDateOnly = new Date(selectedDate);
      const projectStartDateOnly = projectStartDate ? new Date(projectStartDate.toDateString()) : null;
      const projectEndDateOnly = projectEndDate ? new Date(projectEndDate.toDateString()) : null;
      
      
      if (selectedDate && projectStartDateOnly && projectEndDateOnly && 
        (selectedDateOnly < projectStartDateOnly || selectedDateOnly > projectEndDateOnly)) {
      this.snackbar.open('Selected Date is not in the Project Date Range', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      return;
    }


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
          this.snackbar.open('Task Added and Mail sent Successfully!!', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        },
        error: (error) => {
          this.snackbar.open('Error in Task Added or Mail ', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
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
    this.taskservice.deleteTask(taskId).subscribe({
      next:()=>{
        if (this.tasks.length > 1) { 
          this.loadTasks();
        } else if (this.tasks.length === 1) { 
          this.tasks = [];
        }
      
      this.snackbar.open('Task Deleted Successfully!!', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      },
      error: (error) => {
        this.snackbar.open('Error in Deleting the task ', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        console.error('Failed to save task', error);
      }
    });
  }

  // getEmployeeTooltip(assignedTo?: string): string {
  //   const employee = this.employees.find(emp => emp.name === assignedTo);
  //   return employee 
  //     ? `ID: ${employee.empId}\nName: ${employee.name}\nEmail: ${employee.email}\nRole: ${employee.designation}`
  //     : 'Employee details not available';
  // }


openReviewModal(task: any) {
  this.reviewmodelopen=true;
  this.selectedTask = task;
 
}

approveTask(task: any) {
  this.updateTaskStatus(task.taskId, 'COMPLETED');
  this.closeModal();
}

requestRework(task: any) {
  this.updateTaskStatus(task.taskId, 'TODO');
  this.closeModal();
}

closeModal() {
  this.reviewmodelopen=false;
}


updateTaskStatus(taskId: number, status: string) {
  this.taskservice.updateTaskStatus(taskId, status).subscribe({
    next: () => {
      
      this.snackbar.open('FeedBack sent Successfully!!', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      this.loadTasks()
    },
    error: (err) => {
      
      this.snackbar.open('Failed to sent the FeedBack!!', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    }
  });
}

}
