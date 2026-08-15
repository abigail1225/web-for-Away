import { act, cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import BouquetRotationPuzzle from './BouquetRotationPuzzle.jsx';

const IMAGE_SRC = '/art/bouquet.png';
const STARTING_ROTATIONS = [1, 0, 0, 0, 0, 0, 0, 0, 0];

function renderPuzzle(overrides = {}) {
  const onSolved = vi.fn();
  const onAdvance = vi.fn();

  render(
    <BouquetRotationPuzzle
      imageSrc={IMAGE_SRC}
      onSolved={onSolved}
      onAdvance={onAdvance}
      createInitialRotations={() => STARTING_ROTATIONS.slice()}
      {...overrides}
    />,
  );

  return { onSolved, onAdvance };
}

afterEach(() => {
  cleanup();
});

describe('BouquetRotationPuzzle', () => {
  it('renders nine tile buttons with row-column labels and expected crop styles', () => {
    renderPuzzle();

    const root = document.querySelector('.bouquet-puzzle');
    const status = screen.getByText('继续旋转拼好花束');
    const frame = root?.querySelector('.bouquet-puzzle-frame');
    const board = screen.getByRole('group', { name: '3乘3花束旋转拼图' });
    const tileButtons = within(board).getAllByRole('button');

    expect(status.className).toBe('bouquet-puzzle-status');
    expect(frame).not.toBeNull();
    expect(board.className).toBe('bouquet-puzzle-grid');
    expect(tileButtons).toHaveLength(9);

    tileButtons.forEach((button, index) => {
      const row = Math.floor(index / 3) + 1;
      const column = (index % 3) + 1;
      expect(button.getAttribute('aria-label')).toBe(`第${row}行第${column}列，向左旋转 90 度`);
      expect(button.className).toBe('bouquet-puzzle-tile');
      expect(button.parentElement).toBe(board);
    });

    const firstTileImage = tileButtons[0].querySelector('.bouquet-puzzle-image');
    const lastTileImage = tileButtons[8].querySelector('.bouquet-puzzle-image');

    expect(firstTileImage).not.toBeNull();
    expect(lastTileImage).not.toBeNull();
    expect(firstTileImage.style.transform).toBe('rotate(90deg)');
    expect(lastTileImage.style.backgroundPosition).toBe('100% 100%');
  });

  it('starts from the provided factory rotations and solves by clicking the first tile once', async () => {
    const user = userEvent.setup();
    const { onSolved } = renderPuzzle();

    expect(screen.getByText('继续旋转拼好花束')).not.toBeNull();

    const firstTile = screen.getByRole('button', { name: '第1行第1列，向左旋转 90 度' });

    await user.click(firstTile);

    expect(screen.getByText('拼好了！')).not.toBeNull();
    expect(onSolved).toHaveBeenCalledTimes(1);
    expect(screen.getAllByRole('button').slice(0, 9).every((button) => button.disabled)).toBe(true);
  });

  it('shows the solved frame button and only advances once even if clicked twice', async () => {
    const user = userEvent.setup();
    const { onAdvance } = renderPuzzle();

    await user.click(screen.getByRole('button', { name: '第1行第1列，向左旋转 90 度' }));

    const frame = document.querySelector('.bouquet-puzzle-frame');
    const advanceButton = screen.getByRole('button', { name: '拼好了，进入下一关' });

    expect(frame?.contains(advanceButton)).toBe(true);
    expect(advanceButton.disabled).toBe(false);
    expect(within(advanceButton).getByText('进入下一关')).not.toBeNull();

    await user.click(advanceButton);
    await user.click(advanceButton);

    expect(onAdvance).toHaveBeenCalledTimes(1);
    expect(advanceButton.disabled).toBe(true);
  });

  it('latches repeated synchronous clicks on the solved advance button', async () => {
    const user = userEvent.setup();
    const { onAdvance } = renderPuzzle();

    await user.click(screen.getByRole('button', { name: '第1行第1列，向左旋转 90 度' }));

    const advanceButton = screen.getByRole('button', { name: '拼好了，进入下一关' });

    act(() => {
      advanceButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      advanceButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(onAdvance).toHaveBeenCalledTimes(1);
  });

  it('allows solving from the focused first button with the Enter key and reports solved once', async () => {
    const user = userEvent.setup();
    const { onSolved } = renderPuzzle();

    const firstTile = screen.getByRole('button', { name: '第1行第1列，向左旋转 90 度' });
    firstTile.focus();

    expect(document.activeElement).toBe(firstTile);

    await user.keyboard('{Enter}');

    expect(screen.getByText('拼好了！')).not.toBeNull();
    expect(onSolved).toHaveBeenCalledTimes(1);
  });
});
