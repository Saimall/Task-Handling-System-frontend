import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef, ChangeDetectionStrategy, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/authenticationservice/authenticationservice.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeserviceService } from '../../services/employeeservice/employeeservice.service';
import { TaskserviceService } from '../../services/taskservice/taskservice.service';
import { Chart, ChartData, ChartOptions, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-employeedashboard',
  templateUrl: './employeedashboard.component.html',
  styleUrls: ['./employeedashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeedashboardComponent implements OnInit, AfterViewInit, AfterViewChecked {
  radarChartType: ChartType = 'radar';
  barChartType: ChartType = 'bar';

  taskData: ChartData = {
    labels: ['Completed', 'To Do', 'In Progress', 'In Review', 'Over Due'], 
    datasets: [{
      data: [0, 0, 0, 0, 0], 
      backgroundColor: 'rgba(75, 192, 192, 0.2)', 
      borderColor: '#4BC0C0',
      borderWidth: 3, 
      pointBackgroundColor: ['#10B981', '#6366F1', '#F59E0B', '#FFD700', '#EF4444'], 
      pointBorderColor: '#FFFFFF', 
      pointBorderWidth: 3, 
      pointRadius: 6, 
      hoverBackgroundColor: ['#10B981', '#6366F1', '#F59E0B', '#FFD700', '#EF4444'], 
      hoverBorderColor: '#FFFFFF', 
      hoverBorderWidth: 4,
    }]
  };
  
  priorityData: ChartData = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#10B981', '#F59E0B', '#EF4444']
    }]
  };

  barChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' }
    }
  };

  radarChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      r: {
        beginAtZero: true,
        angleLines: {
          display: true,
          color: '#ddd', 
          lineWidth: 1
        },
        grid: {
          circular: true, 
          color: '#E0E0E0', 
          lineWidth: 1
        },
        ticks: {
          backdropColor: 'rgba(255, 255, 255, 0.6)', 
          color: '#333', 
          font: {
            size: 14, 
            weight: 'bold' 
          },
          stepSize: 1 
        },
        max: 5
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#333',
          font: {
            size: 16,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#333',
        titleColor: '#FFF',
        bodyColor: '#FFF',
        borderColor: '#4BC0C0',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 5,
      }
    }
  };

  @ViewChild('barChartCanvas') barChartCanvas: ElementRef | undefined;
  @ViewChild('raderChartCanvas') raderChartCanvas: ElementRef | undefined;

  employeeDetails: any = {};
  public empId: string | undefined;

  constructor(
    private employeeService: EmployeeserviceService,
    private taskservice: TaskserviceService,
    private route: ActivatedRoute,
    private router: Router,
    private authservice: AuthService,
    private snackbar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const employeeid = this.route.snapshot.paramMap.get('employeeid');
    if (employeeid) {
      this.empId = employeeid;
      this.fetchEmployeeDetails(employeeid);
      this.fetchTasks(employeeid);
    }
  }

  ngAfterViewInit(): void {
    if (this.barChartCanvas && this.raderChartCanvas && !this.taskData.datasets[0].data.every(item => item === 0)) {
      this.initializeCharts();
    }
  }

  ngAfterViewChecked(): void {
    // Resize chart manually after view updates
    if (this.barChartCanvas && this.raderChartCanvas) {
      this.barChartCanvas.nativeElement.style.width = '100%';
      this.raderChartCanvas.nativeElement.style.width = '100%';
      if (this.barChartCanvas.nativeElement.chart) {
        this.barChartCanvas.nativeElement.chart.update();
      }
      if (this.raderChartCanvas.nativeElement.chart) {
        this.raderChartCanvas.nativeElement.chart.update();
      }
    }
  }

  private fetchEmployeeDetails(employeeid: string): void {
    this.employeeService.getEmployeeDetails(employeeid).subscribe({
      next: (data) => {
        console.log("Employees Data", JSON.stringify(data));
        this.employeeDetails = data;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching employee details:', error);
      }
    });
  }

  private fetchTasks(employeeid: string): void {
    this.taskservice.getTasksByEmployeeId(employeeid).subscribe({
      next: (tasks) => {
        console.log("Employee tasks", tasks);
        this.processTaskData(tasks);
        this.cdr.markForCheck();
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

  private initializeCharts(): void {
    if (this.barChartCanvas && this.raderChartCanvas) {
      new Chart(this.barChartCanvas.nativeElement, {
        type: this.barChartType,
        data: this.priorityData,
        options: this.barChartOptions
      });

      new Chart(this.raderChartCanvas.nativeElement, {
        type: this.radarChartType,
        data: this.taskData,
        options: this.radarChartOptions
      });
    }
  }

  handleLogout() {
    this.authservice.removeToken();
    this.router.navigate(['']);
    this.snackbar.open('Logout Successfully', 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
