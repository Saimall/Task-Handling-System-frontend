import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageComponentComponent } from './homepage-component.component';

describe('HomepageComponentComponent', () => {
  let component: HomepageComponentComponent;
  let fixture: ComponentFixture<HomepageComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomepageComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomepageComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
