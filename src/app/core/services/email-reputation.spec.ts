import { TestBed } from '@angular/core/testing';

import { EmailReputationService } from './email-reputation.service';

describe('EmailReputation', () => {
  let service: EmailReputationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailReputationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
