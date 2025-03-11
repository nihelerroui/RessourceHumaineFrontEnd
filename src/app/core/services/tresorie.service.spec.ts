import { TestBed } from '@angular/core/testing';

import { TresorieService } from './tresorie.service';

describe('TresorieService', () => {
  let service: TresorieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TresorieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
