import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html'
})
export class AddEmployeeComponent implements OnInit {
  
  @Input() employeeData: any;
  @Input() showPopup: boolean = false;
  @Output() updateEmployee = new EventEmitter<any>(); 
  @Output() closePopup = new EventEmitter<void>();
  @Output() addEmployee = new EventEmitter<any>();

  employeeForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      email: [''],
      contact: ['', Validators.required],
      designation: ['', Validators.required],
      password: [''] // Password starts empty for both create and update
    });
  }

  ngOnInit(): void {
    if (this.employeeData) {
     
      this.employeeForm.patchValue(this.employeeData);
      this.employeeForm.get('email')?.clearValidators();
      this.employeeForm.get('password')?.clearValidators();
    } else {
     this.employeeForm.get('email')?.setValidators([Validators.required,Validators.email])
      this.employeeForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    }

    this.employeeForm.get('email')?.updateValueAndValidity();
    this.employeeForm.get('password')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      console.log("form is invalid");
      return;
    }

    const formData = { ...this.employeeForm.value };

    
    if (this.employeeData && !formData.password) {
      formData.password = this.employeeData.password; // Retain the previous password
    }

    
    if (this.employeeData) {
      this.updateEmployee.emit(formData);
    } else {
      this.addEmployee.emit(formData);
    }

    this.onCancel();  // Reset the form and close the popup after submission
  }

  onCancel(): void {
    this.employeeForm.reset();
    this.closePopup.emit();
  }
}
