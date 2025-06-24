import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HacerReservaComponent } from './hacer-reserva.component';

describe('HacerReservaComponent', () => {
  let component: HacerReservaComponent;
  let fixture: ComponentFixture<HacerReservaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HacerReservaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HacerReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
