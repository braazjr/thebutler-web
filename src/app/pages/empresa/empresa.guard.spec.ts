import { TestBed, async, inject } from '@angular/core/testing';

import { EmpresaGuard } from './empresa.guard';

describe('EmpresaGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmpresaGuard]
    });
  });

  it('should ...', inject([EmpresaGuard], (guard: EmpresaGuard) => {
    expect(guard).toBeTruthy();
  }));
});
