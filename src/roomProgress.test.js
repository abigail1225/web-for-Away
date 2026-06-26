import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  COMPLETION_CUE_ID,
  FLOW_ROOM_IDS,
  getNextCueId,
  isMailboxUnlocked,
  markRoomExplored,
  REQUIRED_ROOM_IDS,
} from './roomProgress.js';

describe('room progress gating', () => {
  it('keeps the mailbox locked until all other room entries have been explored', () => {
    assert.equal(isMailboxUnlocked([]), false);
    assert.equal(isMailboxUnlocked(['tarot', 'quiz', 'puzzle']), false);
    assert.equal(isMailboxUnlocked(REQUIRED_ROOM_IDS), true);
  });

  it('tracks flow rooms as explored', () => {
    assert.deepEqual(markRoomExplored([], 'letters'), ['letters']);
    assert.deepEqual(markRoomExplored(['tarot'], 'tarot'), ['tarot']);
    assert.deepEqual(markRoomExplored(['tarot'], 'photos'), ['tarot', 'photos']);
    assert.deepEqual(markRoomExplored(['tarot'], 'home'), ['tarot']);
  });

  it('cues the next room in the intended flow, then the decorative gift box', () => {
    assert.equal(getNextCueId([]), 'tarot');
    assert.equal(getNextCueId(['tarot']), 'quiz');
    assert.equal(getNextCueId(['tarot', 'quiz']), 'puzzle');
    assert.equal(getNextCueId(REQUIRED_ROOM_IDS), 'letters');
    assert.equal(getNextCueId(FLOW_ROOM_IDS), COMPLETION_CUE_ID);
  });
});
