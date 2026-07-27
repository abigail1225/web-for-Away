import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CrosswordPuzzle from './CrosswordPuzzle.jsx';

const testData = {
  title: 'Crossword Puzzle · Hidden Message',
  intro: 'Fill the words, and discover the hidden message.',
  grid: [
    ['L', 'O', 'V', 'E'],
    ['#', '#', '#', '#'],
    ['N', 'O', 'T', 'E'],
  ],
  words: [
    {
      number: 1,
      direction: 'across',
      answer: 'LOVE',
      clue: 'What grows here.',
      start: { row: 0, column: 0 },
    },
    {
      number: 2,
      direction: 'across',
      answer: 'NOTE',
      clue: 'A little letter.',
      start: { row: 2, column: 0 },
    },
  ],
  hiddenAnswerCells: [
    { row: 0, column: 0 },
    { row: 0, column: 3 },
    { row: 2, column: 0 },
  ],
};

afterEach(() => cleanup());

describe('CrosswordPuzzle', () => {
  it('fills cells from the keyboard and reports incorrect cells only after checking', async () => {
    const user = userEvent.setup();
    render(<CrosswordPuzzle data={testData} onSolved={vi.fn()} onAdvance={vi.fn()} />);

    await user.click(screen.getByLabelText('Row 1 column 1'));
    await user.keyboard('LOVX');

    expect(screen.queryByText('Almost there! Keep looking.')).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Check Answer' }));

    expect(screen.getByText('Almost there! Keep looking.')).not.toBeNull();
    expect(screen.getByLabelText('Row 1 column 4').className).toContain('is-incorrect');
  });

  it('reveals the hidden message and advances after every answer is correct', async () => {
    const user = userEvent.setup();
    const onSolved = vi.fn();
    const onAdvance = vi.fn();

    render(<CrosswordPuzzle data={testData} onSolved={onSolved} onAdvance={onAdvance} />);

    await user.click(screen.getByLabelText('Row 1 column 1'));
    await user.keyboard('LOVE');
    await user.click(screen.getByLabelText('Row 3 column 1'));
    await user.keyboard('NOTE');
    await user.click(screen.getByRole('button', { name: 'Check Answer' }));

    expect(await screen.findByText('You found the hidden message.')).not.toBeNull();
    expect(screen.getByText('Hidden Answer:')).not.toBeNull();
    expect(screen.getByText('LEN')).not.toBeNull();
    expect(onSolved).toHaveBeenCalledTimes(1);

    const grid = screen.getByRole('grid', { name: 'Crossword grid' });
    expect(within(grid).getByLabelText('Row 1 column 1').className).toContain('is-hidden-answer');

    await user.click(screen.getByRole('button', { name: 'Continue Puzzle Time' }));

    await waitFor(() => expect(onAdvance).toHaveBeenCalledTimes(1));
  });
});
