import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Boleta } from './boleta';

describe('Boleta', () => {
  let component: Boleta;
  let fixture: ComponentFixture<Boleta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Boleta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Boleta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
