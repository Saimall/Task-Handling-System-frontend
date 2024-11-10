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

  private apiUrl4 = 'http://localhost:9093/api/v1/employee';

  constructor(private http:HttpClient,private authservice:AuthService) { }

  getEmployee(managerId: string):Observable<Employee[]> {
    console.log("managerID in gtemployee"+managerId);
    return this.http.get<Employee[]>(`${this.apiUrl3}/${managerId}/viewEmployees`, {headers:this.authservice.getHeaders()});
  }

  deleteEmployee(employeeId: any):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl3}/deleteEmployee/${employeeId}`, {headers:this.authservice.getHeaders()});
  }

  updateEmployee(employee: any,employeeId:any): Observable<any> {
    console.log("Update employee ID",employeeId)

    return this.http.put<any>(`${this.apiUrl4}/updateEmployee/${employeeId}`, employee, {headers:this.authservice.getHeaders()}); 
  }


  
  addEmployee(employeeData: Employee,managerId:string): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl3}/registerEmployee/${managerId}`, employeeData,{headers:this.authservice.getHeaders()});
  }

  getEmployeeDetails(employeeId:any):Observable<Employee>{
    return this.http.get<Employee>(`${this.apiUrl4}/viewEmployeeDetails/${employeeId}`,{headers:this.authservice.getHeaders()})
  }


  

 
}
