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

  it('fills the viewport with a dense confetti burst', () => {
    const confetti = createBirthdayConfettiPieces();

    assert.equal(confetti.length, 120);
    assert.ok(confetti.every((piece) => piece.delay.endsWith('ms')));
    assert.ok(confetti.every((piece) => piece.left.endsWith('vw')));
    assert.ok(confetti.every((piece) => piece.top.endsWith('vh')));
    assert.ok(confetti.every((piece) => piece.drift.endsWith('px')));
    assert.ok(confetti.every((piece) => piece.fall.endsWith('vh')));
  });
});
