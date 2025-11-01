import { TestBed } from '@angular/core/testing';

import { BotMessageService } from './bot-message.service';

describe('BotMessageService', () => {
  let service: BotMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BotMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
