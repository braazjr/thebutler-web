import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaListaComponent } from './ficha-lista.component';

describe('FichaListaComponent', () => {
  let component: FichaListaComponent;
  let fixture: ComponentFixture<FichaListaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaListaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
