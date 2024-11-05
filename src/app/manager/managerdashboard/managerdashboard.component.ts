import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { ManagerService } from '../../services/manager.service';
import {ProjectService} from '../../services/project.service'
import { MatSnackBar } from '@angular/material/snack-bar';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


@Component({
  selector: 'app-managerdashboard',
  templateUrl: './managerdashboard.component.html',
})
export class ManagerdashboardComponent implements OnInit {
  projectData: any[] = [];
  selectedProject: any = null;
  managerDetails: any = {};
  barData: any = null;
  barOptions: any = null;
  tasks: any[] = [];
  selectedProjectName = '';
  showPopup: boolean = false;
  scrollToProjects: boolean = false;
  managerId:any=null;

  constructor(
    private router: Router,
    private route:ActivatedRoute,
    private managerService: ManagerService,
    private projectservice:ProjectService,
    private snackbar:MatSnackBar
  ) {}
 

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.managerId = params.get('managerid'); 
    });
    this.loadManagerDetails();
    this.loadProjects();
  }


  handleAddProject(newProject: any) {
    this.projectservice.addProject(newProject,this.managerId).subscribe({

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

  loadManagerDetails() {
    this.managerService.getManagerDetails(this.managerId).subscribe({
      next: (data) => {
        this.managerDetails = data;
      },
      error: (error) => console.error('Error fetching manager details:', error)
    });
  }
  
  loadProjects() {
    this.projectservice.getProjects(this.managerId).subscribe({
      next: (data) => {
        console.log(data);
        this.projectData = data;
        if (this.projectData.length > 0) {
          this.selectedProject = this.projectData[0];
          // this.loadTasks(this.selectedProject.projectId);
        }
      },
      error: (error) => console.error('Error fetching projects:', error)
    });
  }
  
  // loadTasks(projectId: string) {
  //   this.managerService.getTasksByProjectId(projectId).subscribe({
  //     next: (data) => {
  //       this.tasks = data;
  //       this.updateChart();
  //     },
  //     error: (error) => console.error('Error fetching tasks:', error)
  //   });
  // }
  

  updateChart() {
    if (this.tasks.length > 0 && this.selectedProject) {
      const taskCounts = {
        todo: this.tasks.filter(task => task.status === 'TODO').length,
        inProgress: this.tasks.filter(task => task.status === 'IN_PROGRESS').length,
        inReview: this.tasks.filter(task => task.status === 'IN_REVIEW').length,
        completed: this.tasks.filter(task => task.status === 'COMPLETED').length,
        overdue: this.tasks.filter(task => task.status === 'OVERDUE').length,
      };

      this.barData = {
        labels: ['To Do', 'In Progress', 'In Review', 'Completed', 'Overdue'],
        datasets: [{
          label: 'Tasks',
          data: [taskCounts.todo, taskCounts.inProgress, taskCounts.inReview, taskCounts.completed, taskCounts.overdue],
          backgroundColor: ['#1e90ff', '#ffa500', '#ffff00', '#28a745', '#dc3545'],
        }],
      };

      this.barOptions = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          title: {
            display: true,
            text: `Tasks for ${this.selectedProject.projectName}`
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem:any) => `${tooltipItem.label}: ${tooltipItem.raw} tasks`
            }
          }
        }
      };
    }
  }

  onProjectSelect(projectId: string) {
    this.selectedProject = this.projectData.find(p => p.projectId === projectId);
    if (this.selectedProject) {
      // this.loadTasks(this.selectedProject.projectId);
    }
  }

  handleLogout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userId');
    this.router.navigate(['/HomePage']);
  }

  togglePopup() {
    this.showPopup = !this.showPopup;
  }

}
