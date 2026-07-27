import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import JourneyAheadGame from './JourneyAheadGame.jsx';

afterEach(() => cleanup());

beforeEach(() => {
  localStorage.clear();
});

async function completeMemory(user) {
  await user.click(screen.getByRole('button', { name: /Memory Album/ }));
  await user.click(screen.getByRole('button', { name: /2024.06/ }));
  await user.click(screen.getByRole('button', { name: /2025.01/ }));
  await user.click(screen.getByRole('button', { name: /2025.10/ }));
  expect(await screen.findByText('Some moments become places we can always return to.')).not.toBeNull();
  await user.click(screen.getByRole('button', { name: 'Close clue' }));
}

async function completeRoad(user) {
  await user.click(screen.getByRole('button', { name: /Route Map/ }));
  expect(screen.getByText('点击旋转路线碎片，让小路从 START 连到 GOAL。')).not.toBeNull();
  expect(screen.getByLabelText('Faint route guide from start to goal')).not.toBeNull();
  const route = screen.getByRole('group', { name: 'Rotate route tiles' });
  const tiles = within(route).getAllByRole('button');
  await user.click(tiles[0]);
  await user.click(tiles[1]);
  await user.click(tiles[2]);
  expect(await screen.findByText('There are still so many places waiting for you.')).not.toBeNull();
  await user.click(screen.getByRole('button', { name: 'Close clue' }));
}

async function completeStep(user) {
  await user.click(screen.getByRole('button', { name: /Folded Letter/ }));
  await user.click(screen.getByRole('button', { name: /^S$/ }));
  await user.click(screen.getByRole('button', { name: /^T$/ }));
  await user.click(screen.getByRole('button', { name: /^E$/ }));
  await user.click(screen.getByRole('button', { name: /^P$/ }));
  expect(await screen.findByText("You don't have to reach everything at once. One step at a time is enough.")).not.toBeNull();
  await user.click(screen.getByRole('button', { name: 'Close clue' }));
}

async function completeShoe(user) {
  await user.click(screen.getByRole('button', { name: /Footprints/ }));
  await user.click(screen.getByRole('button', { name: 'Left footprint' }));
  await user.click(screen.getByRole('button', { name: 'Right footprint' }));
  await user.click(screen.getByRole('button', { name: 'Left footprint' }));
  await user.click(screen.getByRole('button', { name: 'Right footprint' }));
  expect(await screen.findByText('Something to carry you through every road ahead.')).not.toBeNull();
  await user.click(screen.getByRole('button', { name: 'Close clue' }));
}

describe('JourneyAheadGame', () => {
  it('unlocks clues in sequence and finishes after the gift is claimed', async () => {
    const user = userEvent.setup();
    const onSolved = vi.fn();
    const onAdvance = vi.fn();

    render(<JourneyAheadGame onSolved={onSolved} onAdvance={onAdvance} />);

    expect(screen.getByText('Clues Found')).not.toBeNull();
    expect(screen.getByText('0 / 4')).not.toBeNull();
    expect(screen.getByRole('button', { name: /Memory Album/ })).not.toBeNull();
    expect(screen.getByRole('button', { name: /Route Map/ }).disabled).toBe(true);

    await completeMemory(user);
    expect(screen.getByRole('button', { name: /Route Map/ }).disabled).toBe(false);

    await completeRoad(user);
    expect(screen.getByRole('button', { name: /Folded Letter/ }).disabled).toBe(false);

    await completeStep(user);
    expect(screen.getByRole('button', { name: /Footprints/ }).disabled).toBe(false);

    await completeShoe(user);

    expect(await screen.findByText("For all the roads you haven't walked yet.")).not.toBeNull();
    expect(onSolved).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: '领取现实礼物' }));
    expect(screen.getByRole('dialog')).not.toBeNull();
    await user.click(screen.getByRole('button', { name: '我已经收到礼物' }));

    expect(await screen.findByText('Puzzle Time Completed')).not.toBeNull();
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    await waitFor(() => expect(onAdvance).toHaveBeenCalledTimes(1));
  });

  it('restores completed clues and can reset the chapter', async () => {
    const user = userEvent.setup();

    localStorage.setItem(
      'birthday-puzzle-chapter-3',
      JSON.stringify({ completedClues: ['memory', 'road'], giftOpened: false, realityGiftClaimed: false }),
    );

    render(<JourneyAheadGame onSolved={vi.fn()} onAdvance={vi.fn()} />);

    expect(screen.getByText('2 / 4')).not.toBeNull();
    expect(screen.getByRole('button', { name: /Folded Letter/ }).disabled).toBe(false);

    await user.click(screen.getByRole('button', { name: '重新开始本关' }));

    expect(screen.getByText('0 / 4')).not.toBeNull();
    expect(screen.getByRole('button', { name: /Route Map/ }).disabled).toBe(true);
  });
});
