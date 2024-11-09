import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../../models/Task';
import { AuthService } from '../authenticationservice/authenticationservice.service';

@Injectable({
  providedIn: 'root'
})
export class TaskserviceService {
 

  constructor(private http:HttpClient,private authservice:AuthService) { }


  private apiUrl4= "http://localhost:9093/api/v2/task";
  


  addTaskToProject(projectId: number, taskRequestDto: Task): Observable<Task> {
    console.log("Inside function"+JSON.stringify(taskRequestDto))
    return this.http.post<Task>(`${this.apiUrl4}/addTask/${projectId}`, taskRequestDto,{headers:this.authservice.getHeaders() });
  }

  getTasksByProjectId(projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl4}/getTaskByProjectId/${projectId}`);
  }

  getTasksByCreatedDate(createdDate: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl4}/getTasksByCreatedDate/${createdDate}`);
  }

  getTasksByStatus(status: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl4}/getTasksByStatus/${status}`);
  }

  updateTask(taskId: number, taskRequestDto: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl4}/updateTasks/${taskId}`, taskRequestDto);
  }

  updateTaskStatus(taskId: number, status: string): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl4}/updateTaskStatus/${taskId}/${status}`, {});
  }

  deleteTask(taskId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl4}/deleteTask/${taskId}`);
  }

  getTasksByEmployeeId(employeeId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl4}/getTasksByEmployeeId/${employeeId}`);
  }

  submitTaskForReview(taskId: number): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl4}/submitTaskForReview/${taskId}`, {});
  }
}
