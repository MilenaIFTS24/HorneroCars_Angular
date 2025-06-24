import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGestionSucursalesComponent } from './admin-gestion-sucursales.component';

describe('AdminGestionSucursalesComponent', () => {
  let component: AdminGestionSucursalesComponent;
  let fixture: ComponentFixture<AdminGestionSucursalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminGestionSucursalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminGestionSucursalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
