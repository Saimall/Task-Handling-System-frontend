import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserserviceService {

  private apiUrl2 = 'http://localhost:9093/api/v1';

  constructor(private http: HttpClient) { }

  validateUser(email: string, password: string): Observable<any> {
    
    return this.http.post(`${this.apiUrl2}/login`, { email, password });
  }
}
