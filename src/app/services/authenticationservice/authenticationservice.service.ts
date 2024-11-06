import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth';
  
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

 
  getToken(): string | null {
    console.log("Key",this.tokenKey);
    console.log("Key",localStorage.getItem(this.tokenKey));
    return localStorage.getItem(this.tokenKey);
  }

  
  removeToken(): void {
    localStorage.removeItem("familyid");
    localStorage.removeItem(this.tokenKey);
  }

 
  isAuthenticated(): boolean {
    const token = this.getToken();
    console.log(token);
    if (token) {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 > Date.now(); 
    }
    return false;
  }
}