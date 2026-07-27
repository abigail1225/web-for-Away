import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../puzzleRotation.js', async () => {
  const actual = await vi.importActual('../puzzleRotation.js');

  return {
    ...actual,
    createStartingRotations: () => [1, 0, 0, 0, 0, 0, 0, 0, 0],
  };
});

import GamePage from './GamePage.jsx';

afterEach(() => cleanup());

beforeEach(() => {
  localStorage.clear();
  window.location.hash = '';
});

async function solveLevelOne(user) {
  const puzzleGroup = screen.getByRole('group', { name: '3乘3生日花束旋转拼图' });
  const [firstTile] = within(puzzleGroup).getAllByRole('button', {
    name: /向左旋转 90 度/,
  });

  await user.click(firstTile);

  await waitFor(() => {
    expect(JSON.parse(localStorage.getItem('birthday-puzzle-solved'))).toEqual({
      'level-01': true,
    });
  });

  return screen.findByRole('button', { name: '拼好了，进入下一关' });
}

describe('GamePage', () => {
  it('persists bouquet completion and restores unlocked progress after a reload', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<GamePage />);

    expect(
      screen.getByRole('heading', { level: 3, name: 'Level 01：生日花束' }),
    ).not.toBeNull();

    const completedFrame = await solveLevelOne(user);
    await user.click(completedFrame);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 3, name: 'Level 02：Crossword Puzzle · Hidden Message' }),
      ).not.toBeNull();
    });

    unmount();
    render(<GamePage />);

    expect(
      screen.getByRole('heading', { level: 3, name: 'Level 01：生日花束' }),
    ).not.toBeNull();
    expect(screen.getByText(/已解锁 1 \/ 3/)).not.toBeNull();
    expect(
      screen.getByRole('button', { name: 'Level 01：生日花束已解锁' }),
    ).not.toBeNull();
  });

  it('keeps the crossword level two and level three modal flow after the bouquet puzzle', async () => {
    const user = userEvent.setup();

    render(<GamePage />);

    const completedFrame = await solveLevelOne(user);
    await user.click(completedFrame);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 3, name: 'Level 02：Crossword Puzzle · Hidden Message' }),
      ).not.toBeNull();
    });

    await user.click(screen.getByLabelText('Row 1 column 1'));
    await user.keyboard('CLASS');
    await user.click(screen.getByLabelText('Row 1 column 7'));
    await user.keyboard('MAP');
    await user.click(screen.getByLabelText('Row 2 column 1'));
    await user.keyboard('A');
    await user.click(screen.getByLabelText('Row 3 column 1'));
    await user.keyboard('TEA');
    await user.click(screen.getByLabelText('Row 3 column 5'));
    await user.keyboard('DESK');
    await user.click(screen.getByLabelText('Row 5 column 3'));
    await user.keyboard('LAMP');
    await user.click(screen.getByLabelText('Row 5 column 4'));
    await user.keyboard('EAST');
    await user.click(screen.getByLabelText('Row 5 column 5'));
    await user.keyboard('NOTE');
    await user.click(screen.getByLabelText('Row 5 column 6'));
    await user.keyboard('STAR');
    await user.click(screen.getByLabelText('Row 9 column 1'));
    await user.keyboard('PLANE');
    await user.click(screen.getByLabelText('Row 9 column 7'));
    await user.keyboard('BUS');
    await user.click(screen.getByRole('button', { name: 'Check Answer' }));

    expect(await screen.findByText('You found the hidden message.')).not.toBeNull();
    expect(screen.getByText('Lens')).not.toBeNull();

    await user.click(screen.getByRole('button', { name: 'Continue Puzzle Time' }));

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 3, name: 'Level 03：最终昵称' }),
      ).not.toBeNull();
    });

    await user.type(screen.getByLabelText('输入你的答案'), '宝宝');
    await user.click(screen.getByRole('button', { name: '提交答案' }));

    expect(screen.getByRole('dialog')).not.toBeNull();
    expect(screen.getByRole('heading', { level: 3, name: '聪明如你' })).not.toBeNull();

    const finishButton = screen.getByRole('button', { name: '去照片墙' });
    expect(finishButton).not.toBeNull();

    await user.click(finishButton);

    expect(window.location.hash).toBe('#photos');
  });
});
