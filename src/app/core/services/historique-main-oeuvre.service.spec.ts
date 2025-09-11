import { TestBed } from '@angular/core/testing';

import { HistoriqueMainOeuvreService } from './historique-main-oeuvre.service';

describe('HistoriqueMainOeuvreService', () => {
  let service: HistoriqueMainOeuvreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoriqueMainOeuvreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
