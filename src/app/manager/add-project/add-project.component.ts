import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',

})
export class AddProjectComponent implements OnInit {



  @Output() close = new EventEmitter<void>();
  @Output() addProject = new EventEmitter<any>();

  projectData: any[] = [];
  
  projectForm: FormGroup;
  managerId: any="";

  constructor(private fb: FormBuilder,private route:ActivatedRoute,private projectservice:ProjectService) {
    this.projectForm = this.fb.group({
      projectName: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      projectDescription: ['', Validators.required],
    });
  };
  ngOnInit(): void {
 
  }
  

  onSubmit() {

    this.addProject.emit(this.projectForm.value);
    this.projectForm.reset();
    this.close.emit();
  }

  onClose() {
    
    this.close.emit();
  }



}


  



