import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { crosswordData } from './data/crosswordData.js';
import { checkCrosswordAnswers, getHiddenAnswer, normalizeCrosswordInput } from './crosswordPuzzle.js';

const testData = {
  grid: [
    ['L', 'O', 'V', 'E'],
    ['N', 'O', 'T', 'E'],
  ],
  hiddenAnswerCells: [
    { row: 0, column: 0 },
    { row: 0, column: 3 },
    { row: 1, column: 0 },
  ],
};

describe('crossword puzzle model', () => {
  it('normalizes player input to a single uppercase English letter', () => {
    assert.equal(normalizeCrosswordInput('a'), 'A');
    assert.equal(normalizeCrosswordInput('lens'), 'L');
    assert.equal(normalizeCrosswordInput('7'), '');
    assert.equal(normalizeCrosswordInput('好'), '');
  });

  it('extracts the hidden answer from configured cells', () => {
    assert.equal(getHiddenAnswer(testData), 'LEN');
  });

  it('keeps the level two hidden answer as four connected cells that spell LENS', () => {
    assert.equal(crosswordData.grid.length, 9);
    assert.equal(crosswordData.grid[0].length, 9);
    assert.ok(crosswordData.words.length >= 9);
    assert.equal(crosswordData.words.some((word) => word.answer === 'LENS'), false);
    assert.deepEqual(crosswordData.hiddenAnswerCells, [
      { row: 4, column: 2 },
      { row: 4, column: 3 },
      { row: 4, column: 4 },
      { row: 4, column: 5 },
    ]);
    assert.equal(getHiddenAnswer(crosswordData), 'LENS');
  });

  it('builds each hidden answer letter from another clued word', () => {
    const coveringWords = crosswordData.hiddenAnswerCells.map((cell) => {
      return crosswordData.words.find((word) => {
        const rowDelta = word.direction === 'down' ? 1 : 0;
        const columnDelta = word.direction === 'across' ? 1 : 0;

        return Array.from({ length: word.answer.length }).some((_, index) => {
          return (
            word.start.row + rowDelta * index === cell.row &&
            word.start.column + columnDelta * index === cell.column
          );
        });
      });
    });

    assert.deepEqual(
      coveringWords.map((word) => word.answer),
      ['LAMP', 'EAST', 'NOTE', 'STAR'],
    );
  });

  it('uses short direct clues for the fixed crossword words', () => {
    assert.ok(crosswordData.words.every((word) => word.clue.length <= 46));
    assert.ok(crosswordData.words.some((word) => word.answer === 'DESK'));
    assert.ok(crosswordData.words.some((word) => word.answer === 'LAMP'));
    assert.ok(crosswordData.words.some((word) => word.answer === 'STAR'));
  });

  it('checks filled letters and reports incorrect cells', () => {
    const correctLetters = {
      '0-0': 'l',
      '0-1': 'o',
      '0-2': 'v',
      '0-3': 'e',
      '1-0': 'n',
      '1-1': 'o',
      '1-2': 't',
      '1-3': 'e',
    };

    assert.deepEqual(checkCrosswordAnswers(testData, correctLetters), {
      solved: true,
      incorrectCells: [],
    });

    assert.deepEqual(checkCrosswordAnswers(testData, { ...correctLetters, '1-3': 'x' }), {
      solved: false,
      incorrectCells: ['1-3'],
    });
  });
});
