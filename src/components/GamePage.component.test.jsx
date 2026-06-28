import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../puzzleRotation.js', async () => {
  const actual = await vi.importActual('../puzzleRotation.js');

  return {
    ...actual,
    createStartingRotations: () => [1, 0, 0, 0, 0, 0, 0, 0, 0],
  };
});

import GamePage from './GamePage.jsx';

beforeEach(() => {
  localStorage.clear();
});

describe('GamePage', () => {
  it('integrates the bouquet puzzle into level one and advances to level two after completion', async () => {
    const user = userEvent.setup();

    render(<GamePage />);

    expect(
      screen.getByRole('heading', { level: 3, name: 'Level 01：生日花束' }),
    ).not.toBeNull();

    const puzzleGroup = screen.getByRole('group', { name: '3乘3生日花束旋转拼图' });
    const [firstTile] = within(puzzleGroup).getAllByRole('button', {
      name: /向左旋转 90 度/,
    });

    await user.click(firstTile);

    const completedFrame = await screen.findByRole('button', {
      name: '拼好了，进入下一关',
    });

    await user.click(completedFrame);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 3, name: 'Level 02：下一站填词' }),
      ).not.toBeNull();
    });

    expect(screen.getByLabelText('输入你的答案')).not.toBeNull();
  });
});
