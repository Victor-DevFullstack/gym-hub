import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Proprietario } from './proprietario';

describe('Proprietario', () => {
  let component: Proprietario;
  let fixture: ComponentFixture<Proprietario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Proprietario],
    }).compileComponents();

    fixture = TestBed.createComponent(Proprietario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
