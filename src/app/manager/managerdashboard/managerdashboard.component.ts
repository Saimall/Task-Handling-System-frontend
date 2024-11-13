import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { ManagerService } from '../../services/managerservice/manager.service';
import { ProjectService } from '../../services/projectservice/project.service'
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/authenticationservice/authenticationservice.service';
import { EmployeeserviceService } from '../../services/employeeservice/employeeservice.service';
import { Chart, PieController, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, BarController } from 'chart.js';
import { TaskserviceService } from '../../services/taskservice/taskservice.service';
import { catchError, forkJoin, map, of } from 'rxjs';
Chart.register(PieController, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, BarController);

@Component({
  selector: 'app-managerdashboard',
  templateUrl: './managerdashboard.component.html',
})
export class ManagerdashboardComponent implements OnInit {

  projectData: any[] = [];
  selectedProject: any = null;
  selectedProjectId!: number;
  managerDetails: any = {};
  barData: any = null;
  barOptions: any = null;
  pieData: any = null;
  pieOptions: any = null;
  tasks: any[] = [];
  selectedProjectName = '';
  showPopup: boolean = false;
  scrollToProjects: boolean = false;
  managerId: any = null;
  employeeData: any[] = [];
  editMode = false;
  employeeToUpdate: any;
  showAddEmployeePopup: boolean = false;
  showUpdateEmployeePopup: boolean = false;
  employeeid: any
  noTasksMessage: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private managerService: ManagerService,
    private taskservice: TaskserviceService,
    private projectservice: ProjectService,
    private snackbar: MatSnackBar,
    private authservice: AuthService,
    private employeeService: EmployeeserviceService
  ) { }


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.managerId = params.get('managerid');
    });
    this.loadManagerDetails();
    this.loadProjects();
    this.loadEmployee();
    this.updatePieChart();
  }

  openAddEmployeePopup() {
    this.showAddEmployeePopup = true;
  }

  openUpdateEmployeePopup(employee: any): void {
    console.log("Employee Data", employee);
    this.employeeid = employee.empId;
    this.employeeToUpdate = employee;
    this.showUpdateEmployeePopup = true;
    console.log(this.showUpdateEmployeePopup)
  }

  closeEmployeePopup() {
    this.showAddEmployeePopup = false;
    this.showUpdateEmployeePopup = false;
  }

  onAddEmployee(employee: any) {
    this.employeeService.addEmployee(employee, this.managerId).subscribe({
      next: (response) => {
        this.closeEmployeePopup();
        this.loadEmployee();
        this.snackbar.open('Employee Added Successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        })
      },
      error: (error) => {
        if (error.status === 500) {
          this.snackbar.open('User already exists.', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        } else {
          console.log(error.status);
          
          this.snackbar.open('Some error occurred.', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        }
      }
    });
  }

  onUpdateEmployee(updatedEmployee: any): void {
    console.log("EmployeeID", this.employeeid);
    this.employeeService.updateEmployee(updatedEmployee, this.employeeid).subscribe({
      next: (response) => {
        this.snackbar.open('Employee updated successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.loadEmployee();
        this.closeEmployeePopup();
      },
      error: (error) => {
        this.snackbar.open('Failed to update employee', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      },
      complete: () => {
        console.log('Employee update process completed');
      }
    });
  }

  handleDeleteEmployee(employeeid: any) {
    console.log("ID", employeeid);
    this.employeeService.deleteEmployee(employeeid).subscribe({
      next: () => {
        this.loadEmployee();
        this.snackbar.open('Employee Deleted Successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        })
      },
      error: () => {
        console.error('Error adding employee:');
        this.snackbar.open('Error while deleting the Employee', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        })
      }
    });
  }

  handleAddProject(newProject: any) {
    this.projectservice.addProject(newProject, this.managerId).subscribe({
      next: () => {
        this.snackbar.open('Project Added Successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        this.loadProjects();

      },
      error: (error) => {
        console.error('Error adding project:', error);
      }
    });
  }

  handleDeleteProject(projectid: any) {
    this.projectservice.deleteProject(projectid).subscribe({
      next: () => {
        this.loadProjects();
        this.snackbar.open('Project Deleted Successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
      error: (error) => {
        console.error('Error deleting project:', error);
      }
    });
  }

  loadManagerDetails() {
    this.managerService.getManagerDetails(this.managerId).subscribe({
      next: (data) => {
        console.log("Manager data", data)
        this.managerDetails = data;
      },
      error: (error) => console.error('Error fetching manager details:', error)
    });
  }

  loadEmployee() {
    this.employeeService.getEmployee(this.managerId).subscribe({
      next: (data) => {
        console.log(data);
        this.employeeData = data;
        if (this.employeeData.length > 0) {

        }
      },
      error: (error) => console.error('Error fetching projects:', error)
    });
  }

  loadProjects() {
    this.projectservice.getProjects(this.managerId).subscribe({
      next: (data) => {
        console.log(data);
        this.projectData = data;
        if (this.projectData.length > 0) {
          console.log("in loadproject");
          this.updateChartForOverallProgress();
        }
      },
      error: (error) => console.error('Error fetching projects:', error)
    });
  }

  loadTasks(projectId: number) {
    this.taskservice.getTasksByProjectId(projectId).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.noTasksMessage = '';
          this.tasks = data;
          this.updatePieChart();
          this.updateChart();
        } else {
          this.noTasksMessage = 'No tasks in project';
        }
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
        this.tasks = [];
        this.noTasksMessage = 'No tasks in project';
        this.barData = { datasets: [], labels: [] };
        this.pieData = { datasets: [], labels: [] };

      }
    });
  }

  updateChart() {
    console.log("getting in bar");
    if (this.tasks.length > 0) {
      const taskCounts = {
        todo: this.tasks.filter(task => task.status === 'TODO').length,
        inProgress: this.tasks.filter(task => task.status === 'IN_PROGRESS').length,
        completed: this.tasks.filter(task => task.status === 'COMPLETED').length,
        overdue: this.tasks.filter(task => task.status === 'OVERDUE').length,
      };

      this.barData = {
        labels: ['To Do', 'In Progress', 'Completed', 'Overdue'],
        datasets: [
          {
            label: 'Task Status',
            data: [taskCounts.todo, taskCounts.inProgress, taskCounts.completed, taskCounts.overdue],
            backgroundColor: ['rgba(255, 205, 86)', 'rgba(54, 162, 235)', 'rgba(75, 192, 192)', 'rgba(255, 99, 132)'],
            borderColor: ['#ff6384', '#36a2eb', '#4bc0c0', '#FF7043'],
            borderWidth: 1,
          }
        ],
      };

      this.barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {

          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem: any) => `${tooltipItem.label}: ${tooltipItem.raw} tasks`
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true
          },
          y: {
            title: {
              display: true,
              align: 'center',
              text: 'Task count',
              color: 'black',
              font: {
                family: 'Arial',
                size: 14,
              },
              padding: {
                top: 10,
                bottom: 5,
                left: 0,
                right: 0,
              },
            },
            beginAtZero: true,
          }
        }
      };
    } else {
      this.barData = null;
    }
  }

  updateChartForOverallProgress() {
    const today = new Date();
    let allTasksCompleted: Boolean = false;
    let started = 0;
    let yetToStart = 0;
    let completedProjects = 0;
    let incompleteProjects = 0;

    const projectTasksObservables = this.projectData.map((project: any) => {
      const startDate = new Date(project.startDate);
      const endDate = new Date(project.endDate);
      console.log("projects lenght", this.projectData.length);

      if (startDate <= today && endDate >= today) {
        started++;
      } else if (startDate > today) {
        yetToStart++;
      } if ((endDate < today) || (this.projectData.length == 1)) {

        return this.taskservice.getTasksByProjectId(project.projectId).pipe(
          map((projectTasks: any[] | null) => {
            console.log("Tasks for project ID:", project.projectId, projectTasks);

            if (!projectTasks || projectTasks.length === 0) {
              incompleteProjects++;
              return [];
            }

            allTasksCompleted = projectTasks.every(task => task.status === 'COMPLETED');

            if (!(started > 0 || yetToStart > 0) || this.projectData.length != 1)
              allTasksCompleted ? completedProjects++ : incompleteProjects++;
            return projectTasks;
          }),
          catchError(error => {
            console.error("Error fetching tasks for project ID:", project.projectId, error);
            if (!(started > 0 || yetToStart > 0) || this.projectData.length != 1)
              allTasksCompleted ? completedProjects++ : incompleteProjects++;
            return of([]);
          })
        );
      }
      console.log("before filter");
      return null;
    }).filter(observable => observable !== null);

    forkJoin(projectTasksObservables).subscribe(() => {
      if (this.projectData.length === 1) {
        console.log("im in forkjoin", started, yetToStart, completedProjects, incompleteProjects);
      }
      const chartLabels = ['Started', 'Yet to Start', 'Completed', 'Overdue'];
      const chartData = [started, yetToStart, completedProjects, incompleteProjects];
      const chartColors = ['#ff6384', '#36a2eb', '#4bc0c0', 'red'];

      this.pieData = {
        labels: chartLabels,
        datasets: [{
          label: 'Project Status',
          data: chartData,
          backgroundColor: chartColors,
        }]
      };

      this.pieOptions = {
        responsive: true,
        plugins: {
          legend: { position: 'left' },
          tooltip: {
            callbacks: {
              label: (tooltipItem: any) => `${tooltipItem.label}: ${tooltipItem.raw} projects`
            }
          }
        }
      };

      this.barData = {
        labels: chartLabels,
        datasets: [{
          label: 'All Project Status',
          data: chartData,
          backgroundColor: ['rgba(255, 205, 86)', 'rgba(54, 162, 235)', 'rgba(75, 192, 192)', 'rgba(255, 99, 132)'],
          borderColor: chartColors,
          borderWidth: 1,
        }]
      };

      this.barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: (tooltipItem: any) => `${tooltipItem.label}: ${tooltipItem.raw} Projects`
            }
          }
        },
        scales: {
          x: { beginAtZero: true },
          y: {
            title: {
              display: true,
              align: 'center',
              text: 'Project count',
              color: 'black',
              font: { family: 'Arial', size: 14 },
              padding: { top: 10, bottom: 5 }
            },
            beginAtZero: true
          }
        }
      };
    });
  }

  updatePieChart() {
    console.log("getting in chart");

    if (this.tasks.length > 0) {
      const taskCounts = {
        todo: this.tasks.filter(task => task.status === 'TODO').length,
        inProgress: this.tasks.filter(task => task.status === 'IN_PROGRESS').length,
        completed: this.tasks.filter(task => task.status === 'COMPLETED').length,
        overdue: this.tasks.filter(task => task.status === 'OVERDUE').length,
      };

      this.pieData = {
        labels: ['To Do', 'In Progress', 'Completed', 'Overdue'],
        datasets: [{
          label: 'Task Distribution',
          data: [taskCounts.todo, taskCounts.inProgress, taskCounts.completed, taskCounts.overdue],
          backgroundColor: ['rgba(255, 205, 86)', 'rgba(54, 162, 235)', 'rgba(75, 192, 192)', 'rgba(255, 99, 132)'],
        }]
      };

      this.pieOptions = {
        responsive: true,
        plugins: {
          legend: {
            position: 'left',
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem: any) => `${tooltipItem.label}: ${tooltipItem.raw} tasks`
            }
          }
        }
      };
    } else {
      this.pieData = null;
    }
  }

  onProjectSelect(projectId: number) {
    if (projectId == -1) {
      this.updateChartForOverallProgress();
      this.noTasksMessage = '';
      if (this.projectData.length == 0)
        this.noTasksMessage = 'No Projects Added';
    }
    else {
      console.log(projectId);
      console.log(this.projectData);
      console.log(this.projectData.find(p => p.projectId == projectId));

      this.selectedProject = this.projectData.find(p => p.projectId == projectId);
      console.log(this.selectedProject.projectId);

      if (this.selectedProject) {
        this.loadTasks(this.selectedProject.projectId);
      }
    }
  }

  handleLogout() {
    this.authservice.removeToken()
    this.router.navigate(['']);
    this.snackbar.open('Logout Successfully', 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  togglePopup() {
    this.showPopup = !this.showPopup;
  }
}
