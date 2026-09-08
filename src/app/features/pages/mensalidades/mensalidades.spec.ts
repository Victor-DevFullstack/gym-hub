import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mensalidades } from './mensalidades';

describe('Mensalidades', () => {
  let component: Mensalidades;
  let fixture: ComponentFixture<Mensalidades>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mensalidades],
    }).compileComponents();

    fixture = TestBed.createComponent(Mensalidades);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
