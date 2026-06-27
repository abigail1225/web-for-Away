import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TILE_COUNT,
  createStartingRotations,
  isPuzzleSolved,
  rotateTileLeft,
} from './puzzleRotation.js';

describe('puzzle rotation model', () => {
  it('rotates tiles left without changing the original board', () => {
    const board = [0, 1, 2, 3, 0, 1, 2, 3, 0];

    assert.deepEqual(rotateTileLeft(board, 0), [-1, 1, 2, 3, 0, 1, 2, 3, 0]);
    assert.deepEqual(rotateTileLeft(board, 3), [0, 1, 2, 2, 0, 1, 2, 3, 0]);
    assert.deepEqual(board, [0, 1, 2, 3, 0, 1, 2, 3, 0]);
  });

  it('returns the same board reference for invalid indexes', () => {
    const board = [0, 1, 2, 3, 0, 1, 2, 3, 0];

    assert.strictEqual(rotateTileLeft(board, -1), board);
    assert.strictEqual(rotateTileLeft(board, TILE_COUNT), board);
    assert.strictEqual(rotateTileLeft(board, 1.5), board);
  });

  it('detects solved boards by modulo four rotation counts', () => {
    assert.equal(isPuzzleSolved([0, 0, 0, 0, 0, 0, 0, 0, 0]), true);
    assert.equal(isPuzzleSolved([-4, 0, 0, 0, 0, 0, 0, 0, 0]), true);
    assert.equal(isPuzzleSolved([0, 0, 0]), false);
    assert.equal(isPuzzleSolved([0, 0, 0, 0, 0, 0, 0, 0, 1]), false);
  });

  it('creates unsolved starting rotations in the 0..3 range', () => {
    const start = createStartingRotations(() => 0);

    assert.equal(start.length, TILE_COUNT);
    assert.ok(start.every((value) => Number.isInteger(value)));
    assert.ok(start.every((value) => value >= 0 && value <= 3));
    assert.equal(isPuzzleSolved(start), false);
  });
});
