import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Conceptos } from './conceptos';

describe('Conceptos', () => {
  let component: Conceptos;
  let fixture: ComponentFixture<Conceptos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Conceptos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Conceptos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
