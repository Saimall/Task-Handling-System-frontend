import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerRegistrationFormComponent } from './manager-registration-form.component';

describe('ManagerRegistrationFormComponent', () => {
  let component: ManagerRegistrationFormComponent;
  let fixture: ComponentFixture<ManagerRegistrationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerRegistrationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerRegistrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
