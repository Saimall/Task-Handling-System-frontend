import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureTasksComponent } from './configure-tasks.component';

describe('ConfigureTasksComponent', () => {
  let component: ConfigureTasksComponent;
  let fixture: ComponentFixture<ConfigureTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigureTasksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigureTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
