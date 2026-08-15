import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  completeJourneyClue,
  createJourneyProgress,
  getCurrentJourneyClue,
  isJourneyGiftUnlocked,
} from './journeyAhead.js';

describe('journey ahead puzzle model', () => {
  it('starts with only the memory clue unlocked', () => {
    const progress = createJourneyProgress();

    assert.deepEqual(progress.completedClues, []);
    assert.equal(getCurrentJourneyClue(progress), 'memory');
    assert.equal(isJourneyGiftUnlocked(progress), false);
  });

  it('unlocks clues in the fixed story order', () => {
    let progress = createJourneyProgress();

    progress = completeJourneyClue(progress, 'memory');
    assert.deepEqual(progress.completedClues, ['memory']);
    assert.equal(getCurrentJourneyClue(progress), 'road');

    progress = completeJourneyClue(progress, 'road');
    assert.deepEqual(progress.completedClues, ['memory', 'road']);
    assert.equal(getCurrentJourneyClue(progress), 'step');

    progress = completeJourneyClue(progress, 'step');
    progress = completeJourneyClue(progress, 'shoe');

    assert.equal(getCurrentJourneyClue(progress), null);
    assert.equal(isJourneyGiftUnlocked(progress), true);
  });

  it('ignores out-of-order clue completion', () => {
    const progress = completeJourneyClue(createJourneyProgress(), 'shoe');

    assert.deepEqual(progress.completedClues, []);
    assert.equal(getCurrentJourneyClue(progress), 'memory');
  });
});
