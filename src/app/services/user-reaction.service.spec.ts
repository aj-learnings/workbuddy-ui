import { TestBed } from '@angular/core/testing';

import { UserReactionService } from './user-reaction.service';

describe('UserReactionService', () => {
  let service: UserReactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserReactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
