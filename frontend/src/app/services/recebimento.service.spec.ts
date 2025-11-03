import { TestBed } from '@angular/core/testing';

import { RecebimentoService } from './recebimento.service';

describe('RecebimentoService', () => {
  let service: RecebimentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecebimentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
