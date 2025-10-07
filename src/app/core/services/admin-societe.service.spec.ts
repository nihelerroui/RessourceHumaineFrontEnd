import { TestBed } from '@angular/core/testing';

import { AdminSocieteService } from './admin-societe.service';

describe('AdminSocieteService', () => {
  let service: AdminSocieteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminSocieteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
