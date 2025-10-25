import { TestBed } from '@angular/core/testing';

import { RoupaService } from './roupa.service';

describe('RoupaService', () => {
  let service: RoupaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoupaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
