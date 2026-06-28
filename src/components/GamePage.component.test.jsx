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
        screen.getByRole('heading', { level: 3, name: 'Level 02：下一站填词' }),
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

  it('keeps the level two and level three modal flow after the bouquet puzzle', async () => {
    const user = userEvent.setup();

    render(<GamePage />);

    const completedFrame = await solveLevelOne(user);
    await user.click(completedFrame);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 3, name: 'Level 02：下一站填词' }),
      ).not.toBeNull();
    });

    await user.type(screen.getByLabelText('输入你的答案'), '海边');
    await user.click(screen.getByRole('button', { name: '提交答案' }));

    expect(screen.getByRole('dialog')).not.toBeNull();
    expect(screen.getByRole('heading', { level: 3, name: '聪明如你' })).not.toBeNull();

    await user.click(screen.getByRole('button', { name: '进入下一关' }));

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
