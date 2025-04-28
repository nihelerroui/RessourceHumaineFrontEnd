import { TestBed } from '@angular/core/testing';

import { MainOeuvreService } from './main-oeuvre.service';

describe('MainOeuvreService', () => {
  let service: MainOeuvreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainOeuvreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
