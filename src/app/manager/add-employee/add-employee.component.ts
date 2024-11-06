import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html'
})
export class AddEmployeeComponent implements OnInit {

  @Input() showPopup: boolean = false;
  @Output() closePopup = new EventEmitter<void>();
  @Output() addEmployee = new EventEmitter<any>();

  employeeForm: FormGroup 

  constructor(private fb: FormBuilder) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', Validators.required],
      designation: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
   }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      console.log("form is invalid")
      return;  
    }
    this.addEmployee.emit(this.employeeForm.value);
    this.onCancel();  

    
  }

  onCancel(): void {
    this.closePopup.emit();
    this.employeeForm.reset();  // Reset form to its initial state
  }
}
