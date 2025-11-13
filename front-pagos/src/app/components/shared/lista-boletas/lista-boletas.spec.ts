import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaBoletas } from './lista-boletas';

describe('ListaBoletas', () => {
  let component: ListaBoletas;
  let fixture: ComponentFixture<ListaBoletas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaBoletas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaBoletas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
