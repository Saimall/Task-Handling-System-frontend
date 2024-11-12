import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeserviceService } from '../../services/employeeservice/employeeservice.service';
import { TaskserviceService } from '../../services/taskservice/taskservice.service';
import { Chart, ChartData, ChartOptions, ChartType, registerables } from 'chart.js';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/authenticationservice/authenticationservice.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Task } from '../../models/Task';

Chart.register(...registerables);

@Component({
  selector: 'app-employeedashboard',
  templateUrl: './employeedashboard.component.html',
  styleUrls: ['./employeedashboard.component.css']
})
export class EmployeedashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();

  @ViewChild('barChartCanvas', { static: true }) barChartCanvas!: ElementRef;
  @ViewChild('doughnutChartCanvas', { static: true }) doughnutChartCanvas!: ElementRef;

  public empId: string | undefined;
  employeeDetails: any = {};
  isEditing: boolean = false;
  tasks!: Task[];


  taskData: ChartData<'doughnut'> = {
    labels: ['Completed', 'ToDo', 'In Progress', 'In Review', 'Overdue'],
    datasets: [{
      data: [0, 0, 0, 0, 0],
      backgroundColor: ['#10B981', '#6366F1', '#F59E0B', '#FFD700', '#EF4444'],
      borderColor: '#4BC0C0',
      borderWidth: 3
    }]
  };

  passwordForm: FormGroup;  // Moved this out of constructor and initialized here
  isPasswordModalOpen: boolean = false;
  showTasks: boolean=false;

  toggleEditProfile(): void {
    this.isEditing = !this.isEditing;
    console.log("closeing the dialog" + this.isEditing);
  }

  closeeditprofile(): void {
    this.isEditing = false;
  }

  priorityData: ChartData<'bar'> = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#10B981', '#F59E0B', '#EF4444']
    }]
  };

  doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      }
    }
  };

  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      }
    }
  };

  doughnutChart: Chart<'doughnut'> | null = null;
  barChart: Chart<'bar'> | null = null;

  constructor(
    private employeeService: EmployeeserviceService,
    private taskService: TaskserviceService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {
    // Initialize the form group here directly
    this.passwordForm = new FormGroup({
      currentPassword: new FormControl('', Validators.required),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required])
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    const employeeId = this.route.snapshot.paramMap.get('employeeid');
    if (employeeId) {
      this.empId = employeeId;
      this.fetchEmployeeDetails(employeeId);
      this.fetchTasks(employeeId);
    }
  }

  ngAfterViewInit(): void {
    this.createCharts();
  }

  ngOnDestroy(): void {
    this.destroyCharts();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private fetchEmployeeDetails(employeeId: string): void {
    this.employeeService.getEmployeeDetails(employeeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.employeeDetails = data;
          console.log("Employeedeatials" + JSON.stringify(this.employeeDetails));
        },
        error: (error) => {
          console.error('Error fetching employee details:', error);
        }
      });
  }

  private passwordMatchValidator(form: AbstractControl): { [key: string]: boolean } | null {
    const formGroup = form as FormGroup;
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }

  private fetchTasks(employeeId: string): void {
    this.taskService.getTasksByEmployeeId(employeeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tasks) => {
          this.tasks=tasks;
          this.processTaskData(tasks);
          this.updateCharts();
        },
        error: (error) => {
          console.error('Error fetching tasks:', error);
        }
      });
  }

  private processTaskData(tasks: any[]): void {
    const taskCounts = tasks.reduce((acc, task) => {
      acc.status[task.status] = (acc.status[task.status] || 0) + 1;
      acc.priority[task.priority] = (acc.priority[task.priority] || 0) + 1;
      return acc;
    }, {
      status: { 'COMPLETED': 0, 'TODO': 0, 'IN_PROGRESS': 0, 'IN_REVIEW': 0, 'OVERDUE': 0 },
      priority: { 'LOW': 0, 'MEDIUM': 0, 'HIGH': 0 }
    });

    this.taskData.datasets[0].data = [
      taskCounts.status['COMPLETED'],
      taskCounts.status['TODO'],
      taskCounts.status['IN_PROGRESS'],
      taskCounts.status['IN_REVIEW'],
      taskCounts.status['OVERDUE']
    ];

    this.priorityData.datasets[0].data = [
      taskCounts.priority['LOW'],
      taskCounts.priority['MEDIUM'],
      taskCounts.priority['HIGH']
    ];
  }

  private createCharts(): void {
    if (this.doughnutChartCanvas?.nativeElement) {
      this.doughnutChart = new Chart(this.doughnutChartCanvas.nativeElement, {
        type: 'doughnut',
        data: this.taskData,
        options: this.doughnutChartOptions
      });
    }

    if (this.barChartCanvas?.nativeElement) {
      this.barChart = new Chart(this.barChartCanvas.nativeElement, {
        type: 'bar',
        data: this.priorityData,
        options: this.chartOptions
      });
    }
  }

  private updateCharts(): void {
    if (this.doughnutChart) {
      this.doughnutChart.update();
    }
    if (this.barChart) {
      this.barChart.update();
    }
  }

  private destroyCharts(): void {
    if (this.doughnutChart) {
      this.doughnutChart.destroy();
      this.doughnutChart = null;
    }
    if (this.barChart) {
      this.barChart.destroy();
      this.barChart = null;
    }
  }

  openChangePasswordModal() {
    this.isPasswordModalOpen = true;
  }

  closePasswordModal() {
    this.isPasswordModalOpen = false;
  }

  submitChangePassword() {
    if (this.passwordForm.invalid) {
      return;
    }

    const { currentPassword, newPassword } = this.passwordForm.value;
    if (!currentPassword || !newPassword) {
      this.snackbar.open('Both password fields are required.', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      return;
    }

    const requestPayload = {
      oldPassword: currentPassword,
      newPassword: newPassword
    };
    console.log('Changing password with:', currentPassword, newPassword);

    this.employeeService.updatePassword(this.employeeDetails.email, requestPayload)
      .subscribe({
        next: () => {
       
          this.snackbar.open('Password changed successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });

     
          this.closePasswordModal();

          
          this.authService.removeToken();
          this.router.navigate(['/login']);
        },
        error: (error) => {
         
          if (error.status === 400) {
            this.snackbar.open('Incorrect current password. Please try again.', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          } else if (error.status === 500) {
            this.snackbar.open('Server error, please try again later.', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          }
        }
      });
  }

  updateEmployeeDetails(updatedData: { name: string, contact: string }): void {
    console.log("updated Data"+updatedData);
    const designation= this.employeeDetails.designation;
    const updatedEmployeeData = { ...updatedData, designation };
   
    this.employeeService.updateEmployee(updatedEmployeeData,this.empId)
      .subscribe({
        next: () => {
          this.employeeDetails = { ...this.employeeDetails, ...updatedData };
          this.isEditing = false;
          this.snackbar.open('Profile updated successfully!', 'Close', { duration: 3000 ,  horizontalPosition: 'right',
          verticalPosition: 'top'});
        },
        error: (err) => {
          console.error('Error updating employee details:', err);
          this.snackbar.open('Failed to update profile', 'Close', { duration: 3000,  horizontalPosition: 'right',
          verticalPosition: 'top' });
        }
      });
  }

  handleLogout() {
    this.authService.removeToken();
    this.router.navigate(['']);
    this.snackbar.open('Logged out successfully', 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }


  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'HIGH':
        return 'text-red-500 font-semibold';
      case 'MEDIUM':
        return 'text-yellow-500 font-semibold';
      case 'LOW':
        return 'text-green-500 font-semibold';
      default:
        return 'text-gray-600';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600';
      case 'ToDo':
        return 'text-blue-600';
      case 'IN_PROGRESS':
        return 'text-yellow-600';
      case 'IN_REVIEW':
        return 'text-purple-600';
      case 'OVERDUE':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  }

  viewTasks(): void {
    this.showTasks = true; 
    this.fetchTasks(this.empId!);
  }

  acceptTask(task: Task): void {
    task.status = 'IN_PROGRESS';
    this.updateTaskStatus(task);
  }

  markInReview(task: Task): void {
    task.status = 'IN_REVIEW';
    this.markTaskInReview(task);
  }

  private markTaskInReview(task: Task): void {
    let taskid:number =parseInt(task.taskId);
    this.taskService.submitTaskForReview(taskid)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.snackbar.open(`Task Marked for Review and mail sent to manager`, 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        },
        error: (error) => {
          console.error('Error updating task status:', error);
          this.snackbar.open('Failed to Mark the task as Review', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        }
      });
  }





  private updateTaskStatus(task: Task): void {
    let taskid:number =parseInt(task.taskId);
    this.taskService.updateTaskStatus(taskid, task.status)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.snackbar.open(`Task status updated to ${task.status}`, 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        },
        error: (error) => {
          console.error('Error updating task status:', error);
          this.snackbar.open('Failed to update task status', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        }
      });
  }

}

