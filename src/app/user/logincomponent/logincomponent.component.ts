import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { UserserviceService } from '../../services/userservice/userservice.service';

@Component({
  selector: 'app-logincomponent',
  templateUrl: './logincomponent.component.html'
})
export class LogincomponentComponent {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder,private userservice:UserserviceService,private router:Router,private snackbar:MatSnackBar) {
    // Initialize the form group with form controls
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  // Handle form submission
  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.userservice.validateUser(email, password).subscribe({
        next: (response) => {
          console.log("Login response",response);
          if (response.token) {
            localStorage.setItem('token', response.token);
            this.snackbar.open('User validated successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass:"success-snackbar"
            });
            this.router.navigate([response.role === 'MANAGER' ? `/dashboard/${response.id}` : `/employee/${response.id}`]);
          } else {
            this.snackbar.open('Authentication failed', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',  
            });
          }
        },
        error: () => {
          this.snackbar.open('Error while login', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            
          });

        }
      });   
    } else {
      console.log('Form is invalid');
    }
  }

}
