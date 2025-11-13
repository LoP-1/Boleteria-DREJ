import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialUsuario } from './historial-usuario';

describe('HistorialUsuario', () => {
  let component: HistorialUsuario;
  let fixture: ComponentFixture<HistorialUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialUsuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialUsuario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
