import { TestBed } from '@angular/core/testing';

import { GenericServiceExternalAPIService } from './generic-service-external-api.service';

describe('GenericServiceExternalAPIService', () => {
  let service: GenericServiceExternalAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenericServiceExternalAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
