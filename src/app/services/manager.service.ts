import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Manager } from '../models/manager';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {



  private apiUrl = 'http://localhost:9093/api/v1/manager/register';

  constructor(private http: HttpClient) {}

  registerManager(managerData: Manager): Observable<Manager> {
    console.log(managerData)
    return this.http.post<Manager>(this.apiUrl, managerData);
  }
}
