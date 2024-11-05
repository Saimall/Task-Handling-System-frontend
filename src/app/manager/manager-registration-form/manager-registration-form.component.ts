import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';  
import { ManagerService } from '../../services/manager.service';

@Component({
  selector: 'app-manager-registration-form',
  templateUrl: './manager-registration-form.component.html',

})
export class ManagerRegistrationFormComponent {
  registrationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private snackBar: MatSnackBar,
    private managerService: ManagerService
  ) {
    // Using FormGroup to create form controls
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      contact: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }



  handleSubmit(): void {
    if (this.registrationForm.invalid) {
      return;
    }

    const formData = this.registrationForm.value;

    console.log(formData)

    this.managerService.registerManager(formData)
      .subscribe({
        next: (response) => {
          this.snackBar.open('Registration successful', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
          this.router.navigate(['/login']);
        },
        error: (error) => {
          if (error.status === 409) {
            this.snackBar.open('User already exists.', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          } else {
            this.snackBar.open('Some error occurred.', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          }
        }
      });
  }
}
