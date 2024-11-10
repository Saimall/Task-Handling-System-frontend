import { Component, Input, Output, EventEmitter,SimpleChanges, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  @Input() name: string =''
  @Input() contact: string = '';
  @Output() saveProfile = new EventEmitter<{ name: string, contact: string }>();
  @Output() closeDialog = new EventEmitter<void>(); // Event emitter to close the modal

  editProfileForm: FormGroup;

  constructor() {
    this.editProfileForm = new FormGroup({

      name: new FormControl(this.name, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]),
      contact: new FormControl(this.contact, [
        Validators.required,
        Validators.pattern(/^[0-9]+$/),
        Validators.minLength(10),
        Validators.maxLength(15)
      ])
    });
  }
  ngOnInit(): void {
    this.editProfileForm.patchValue({
      name: this.name,
      contact: this.contact
    });
  }


  onSave(): void {
    if (this.editProfileForm.valid) {
      this.saveProfile.emit({
        name: this.editProfileForm.value.name,
        contact: this.editProfileForm.value.contact
      });
      this.closeDialog.emit(); // Close modal after saving
    }
  }

  onCancel(): void {
    this.closeDialog.emit(); // Close modal if canceled
  }
}
