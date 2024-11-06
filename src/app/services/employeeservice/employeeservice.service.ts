import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../../models/employee';
import { AuthService } from '../authenticationservice/authenticationservice.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeserviceService {

  private apiUrl3 = 'http://localhost:9093/api/v1/manager';

  constructor(private http:HttpClient,private authservice:AuthService) { }

  getEmployee(managerId: string):Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl3}/${managerId}/viewEmployees`, {headers:this.authservice.getHeaders()});
  }




  
  addEmployee(employeeData: Employee,managerId:string): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl3}/registerEmployee/${managerId}`, employeeData,{headers:this.authservice.getHeaders()});
  }

 
}
