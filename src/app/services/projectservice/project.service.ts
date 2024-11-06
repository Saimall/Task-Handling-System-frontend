import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../../models/project';
import { AuthService } from '../authenticationservice/authenticationservice.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient,private authservice:AuthService ){}

  private apiUrl1 = 'http://localhost:9093/api/v2/project';
  
  getProjects(managerId: string):Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl1}/getProjects/${managerId}`, {headers:this.authservice.getHeaders()});
  }



  addProject(projectData: Project,managerId:string): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl1}/addProject/${managerId}`, projectData,{headers:this.authservice.getHeaders()});
  }
}
