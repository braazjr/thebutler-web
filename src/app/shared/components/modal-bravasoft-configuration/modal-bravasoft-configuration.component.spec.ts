import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBravasoftConfigurationComponent } from './modal-bravasoft-configuration.component';

describe('ModalBravasoftConfigurationComponent', () => {
  let component: ModalBravasoftConfigurationComponent;
  let fixture: ComponentFixture<ModalBravasoftConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBravasoftConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBravasoftConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
