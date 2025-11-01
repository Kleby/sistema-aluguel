import { TestBed } from '@angular/core/testing';

import { RoupaOptionsService } from './roupa-options.service';

describe('RoupaOptionsService', () => {
  let service: RoupaOptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoupaOptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
