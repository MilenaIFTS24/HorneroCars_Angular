import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeDashboardUserComponent } from './home-dashboard-user.component';

describe('HomeDashboardUserComponent', () => {
  let component: HomeDashboardUserComponent;
  let fixture: ComponentFixture<HomeDashboardUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeDashboardUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeDashboardUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
