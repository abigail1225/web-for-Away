import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { blowBirthdayCandle, createBirthdayConfettiPieces } from './birthdayMoment.js';

describe('birthday cake moment', () => {
  it('blows out the candle while starting a new confetti burst', () => {
    const nextMoment = blowBirthdayCandle({
      candleBlownOut: false,
      confettiBurst: 0,
    });

    assert.deepEqual(nextMoment, {
      candleBlownOut: true,
      confettiBurst: 1,
    });
  });

  it('uses a denser confetti burst than the first pass', () => {
    const confetti = createBirthdayConfettiPieces();

    assert.equal(confetti.length, 42);
    assert.ok(confetti.every((piece) => piece.delay.endsWith('ms')));
    assert.ok(confetti.every((piece) => piece.x.endsWith('px')));
    assert.ok(confetti.every((piece) => piece.y.endsWith('px')));
  });
});
