# Puzzle Time Rotation Bouquet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Puzzle Time level one with an accessible 3x3 birthday-bouquet puzzle whose tiles rotate 90 degrees counterclockwise and whose highlighted completed frame advances to level two.

**Architecture:** Keep the quarter-turn rules in a pure `puzzleRotation.js` module, render them through a focused `BouquetRotationPuzzle` component, and let the existing `GamePage` continue to own level selection and solved progress. Use one approved square illustration as a CSS background cropped into nine fixed, overflow-clipped buttons.

**Tech Stack:** React 19, Vite 7, Tailwind CSS plus project CSS, pnpm 11, Node test runner, Vitest, Testing Library, jsdom

**Codex Desktop Runtime:** Before running the shell commands below, expose the bundled Node and pnpm executables in the active shell:

```bash
export PATH="/Users/cimcowboy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/cimcowboy/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH"
```

---

## File Structure

- Create `src/puzzleRotation.js`: pure rotation, solved-state, and randomized-start helpers.
- Create `src/puzzleRotation.test.js`: Node unit tests for all puzzle rules.
- Create `src/components/BouquetRotationPuzzle.jsx`: accessible 3x3 interaction and completion UI.
- Create `src/components/BouquetRotationPuzzle.component.test.jsx`: isolated pointer, keyboard, and completion tests.
- Create `src/components/GamePage.component.test.jsx`: first-level integration and level-two transition test.
- Create `vitest.config.js`: jsdom test configuration limited to component tests.
- Create `public/puzzle/birthday-bouquet.png`: approved 1254x1254 hand-drawn bouquet.
- Modify `package.json` and `pnpm-lock.yaml`: add component-test dependencies and test scripts.
- Modify `src/data/siteData.js`: describe level one as the rotation puzzle.
- Modify `src/components/GamePage.jsx`: render the bouquet puzzle for level one and preserve text forms for later levels.
- Modify `src/index.css`: stable grid, rotation, completion highlight, focus, and responsive styles.

### Task 1: Implement The Pure Rotation Model

**Files:**
- Create: `src/puzzleRotation.test.js`
- Create: `src/puzzleRotation.js`

- [ ] **Step 1: Write the failing model tests**

Create `src/puzzleRotation.test.js`:

```js
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  createStartingRotations,
  isPuzzleSolved,
  rotateTileLeft,
  TILE_COUNT,
} from './puzzleRotation.js';

describe('bouquet puzzle rotation model', () => {
  it('rotates only the requested tile counterclockwise', () => {
    const start = [0, 1, 2, 3, 0, 1, 2, 3, 0];

    assert.deepEqual(rotateTileLeft(start, 0), [-1, 1, 2, 3, 0, 1, 2, 3, 0]);
    assert.deepEqual(rotateTileLeft(start, 3), [0, 1, 2, 2, 0, 1, 2, 3, 0]);
    assert.deepEqual(start, [0, 1, 2, 3, 0, 1, 2, 3, 0]);
  });

  it('returns the existing board for an invalid tile index', () => {
    const start = Array(TILE_COUNT).fill(0);

    assert.equal(rotateTileLeft(start, -1), start);
    assert.equal(rotateTileLeft(start, TILE_COUNT), start);
    assert.equal(rotateTileLeft(start, 1.5), start);
  });

  it('requires exactly nine correctly oriented tiles', () => {
    assert.equal(isPuzzleSolved(Array(TILE_COUNT).fill(0)), true);
    assert.equal(isPuzzleSolved([-4, 0, 0, 0, 0, 0, 0, 0, 0]), true);
    assert.equal(isPuzzleSolved([0, 0, 0]), false);
    assert.equal(isPuzzleSolved([0, 0, 0, 0, 0, 0, 0, 0, 1]), false);
  });

  it('creates nine valid rotations and never starts solved', () => {
    const start = createStartingRotations(() => 0);

    assert.equal(start.length, TILE_COUNT);
    assert.equal(start.every((rotation) => Number.isInteger(rotation) && rotation >= 0 && rotation <= 3), true);
    assert.equal(isPuzzleSolved(start), false);
  });
});
```

- [ ] **Step 2: Run the model test to verify it fails**

Run:

```bash
node --test src/puzzleRotation.test.js
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/puzzleRotation.js`.

- [ ] **Step 3: Implement the minimal pure model**

Create `src/puzzleRotation.js`:

```js
export const TILE_COUNT = 9;
const QUARTER_TURNS = 4;

const normalizeRotation = (rotation) =>
  ((rotation % QUARTER_TURNS) + QUARTER_TURNS) % QUARTER_TURNS;

export const rotateTileLeft = (rotations, index) => {
  if (!Number.isInteger(index) || index < 0 || index >= rotations.length) {
    return rotations;
  }

  return rotations.map((rotation, tileIndex) => (tileIndex === index ? rotation - 1 : rotation));
};

export const isPuzzleSolved = (rotations) =>
  rotations.length === TILE_COUNT && rotations.every((rotation) => normalizeRotation(rotation) === 0);

export const createStartingRotations = (random = Math.random) => {
  const rotations = Array.from({ length: TILE_COUNT }, () => Math.floor(random() * QUARTER_TURNS));

  if (isPuzzleSolved(rotations)) {
    rotations[Math.floor(random() * TILE_COUNT)] = 1;
  }

  return rotations;
};
```

- [ ] **Step 4: Run the model test to verify it passes**

Run:

```bash
node --test src/puzzleRotation.test.js
```

Expected: 4 tests pass and 0 fail.

- [ ] **Step 5: Commit the model**

```bash
git add src/puzzleRotation.js src/puzzleRotation.test.js
git commit -m "Add bouquet puzzle rotation model"
```

### Task 2: Add The Tested Puzzle Component

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Create: `vitest.config.js`
- Create: `src/components/BouquetRotationPuzzle.component.test.jsx`
- Create: `src/components/BouquetRotationPuzzle.jsx`

- [ ] **Step 1: Install the component-test dependencies**

Run:

```bash
pnpm add --save-dev vitest jsdom @testing-library/react @testing-library/user-event
```

Expected: `package.json` and `pnpm-lock.yaml` add the four development dependencies without changing runtime dependencies.

- [ ] **Step 2: Add explicit test scripts and jsdom configuration**

Change the `scripts` object in `package.json` to:

```json
"scripts": {
  "dev": "vite --host 0.0.0.0",
  "build": "vite build",
  "preview": "vite preview --host 0.0.0.0",
  "deploy": "npm run build && gh-pages -d dist",
  "test": "pnpm test:unit && pnpm test:component",
  "test:unit": "node --test src/*.test.js",
  "test:component": "vitest run"
}
```

Create `vitest.config.js`:

```js
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.component.test.jsx'],
  },
});
```

- [ ] **Step 3: Write the failing component tests**

Create `src/components/BouquetRotationPuzzle.component.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import BouquetRotationPuzzle from './BouquetRotationPuzzle.jsx';

const oneMoveFromSolved = () => [1, 0, 0, 0, 0, 0, 0, 0, 0];

const renderPuzzle = (overrides = {}) => {
  const onSolved = vi.fn();
  const onAdvance = vi.fn();

  render(
    <BouquetRotationPuzzle
      imageSrc="/puzzle/birthday-bouquet.png"
      createInitialRotations={oneMoveFromSolved}
      onSolved={onSolved}
      onAdvance={onAdvance}
      {...overrides}
    />,
  );

  return { onSolved, onAdvance };
};

describe('BouquetRotationPuzzle', () => {
  it('renders nine visible, independently cropped tile buttons', () => {
    renderPuzzle();

    const tiles = screen.getAllByRole('button', { name: /拼图块，向左旋转 90 度/ });
    expect(tiles).toHaveLength(9);
    expect(tiles[0].querySelector('.bouquet-puzzle-image').style.transform).toBe('rotate(90deg)');
    expect(tiles[8].querySelector('.bouquet-puzzle-image').style.backgroundPosition).toBe('100% 100%');
  });

  it('completes by pointer, locks tiles, and advances only once', async () => {
    const user = userEvent.setup();
    const { onSolved, onAdvance } = renderPuzzle();
    const firstTile = screen.getAllByRole('button', { name: /拼图块，向左旋转 90 度/ })[0];

    await user.click(firstTile);

    expect(await screen.findByText('拼好了！')).toBeTruthy();
    expect(onSolved).toHaveBeenCalledTimes(1);
    expect(firstTile.disabled).toBe(true);

    const advance = screen.getByRole('button', { name: '拼好了，进入下一关' });
    await user.click(advance);
    await user.click(advance);
    expect(onAdvance).toHaveBeenCalledTimes(1);
  });

  it('uses native button keyboard activation', async () => {
    const user = userEvent.setup();
    const { onSolved } = renderPuzzle();
    const firstTile = screen.getAllByRole('button', { name: /拼图块，向左旋转 90 度/ })[0];

    firstTile.focus();
    await user.keyboard('{Enter}');

    expect(await screen.findByText('拼好了！')).toBeTruthy();
    expect(onSolved).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 4: Run the component test to verify it fails**

Run:

```bash
pnpm test:component -- src/components/BouquetRotationPuzzle.component.test.jsx
```

Expected: FAIL because `BouquetRotationPuzzle.jsx` does not exist.

- [ ] **Step 5: Implement the puzzle component**

Create `src/components/BouquetRotationPuzzle.jsx`:

```jsx
import { useEffect, useRef, useState } from 'react';
import {
  createStartingRotations,
  isPuzzleSolved,
  rotateTileLeft,
} from '../puzzleRotation.js';

const getBackgroundPosition = (index) => {
  const column = index % 3;
  const row = Math.floor(index / 3);
  return `${column * 50}% ${row * 50}%`;
};

export default function BouquetRotationPuzzle({
  imageSrc,
  onSolved,
  onAdvance,
  createInitialRotations = createStartingRotations,
}) {
  const [rotations, setRotations] = useState(createInitialRotations);
  const [advanced, setAdvanced] = useState(false);
  const reportedSolved = useRef(false);
  const solved = isPuzzleSolved(rotations);

  useEffect(() => {
    if (solved && !reportedSolved.current) {
      reportedSolved.current = true;
      onSolved?.();
    }
  }, [onSolved, solved]);

  const rotateTile = (index) => {
    if (solved) return;
    setRotations((current) => rotateTileLeft(current, index));
  };

  const advance = () => {
    if (!solved || advanced) return;
    setAdvanced(true);
    onAdvance?.();
  };

  return (
    <div className={`bouquet-puzzle ${solved ? 'is-solved' : ''}`}>
      <p className="bouquet-puzzle-status" aria-live="polite">
        {solved ? '拼好了！' : '点击每一块，让花束回到正确方向'}
      </p>

      <div className="bouquet-puzzle-frame">
        <div className="bouquet-puzzle-grid" role="group" aria-label="3乘3生日花束旋转拼图">
          {rotations.map((rotation, index) => {
            const row = Math.floor(index / 3) + 1;
            const column = (index % 3) + 1;

            return (
              <button
                type="button"
                className="bouquet-puzzle-tile"
                key={index}
                onClick={() => rotateTile(index)}
                disabled={solved}
                aria-label={`第 ${row} 行第 ${column} 列拼图块，向左旋转 90 度`}
              >
                <span
                  className="bouquet-puzzle-image"
                  aria-hidden="true"
                  style={{
                    backgroundImage: `url("${imageSrc}")`,
                    backgroundPosition: getBackgroundPosition(index),
                    transform: `rotate(${rotation * 90}deg)`,
                  }}
                />
              </button>
            );
          })}
        </div>

        {solved ? (
          <button
            type="button"
            className="bouquet-puzzle-advance"
            onClick={advance}
            disabled={advanced}
            aria-label="拼好了，进入下一关"
          >
            <span>进入下一关</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Run the component and unit tests**

Run:

```bash
pnpm test:unit && pnpm test:component -- src/components/BouquetRotationPuzzle.component.test.jsx
```

Expected: all existing unit tests, 4 rotation-model tests, and 3 component tests pass.

- [ ] **Step 7: Commit the component and test setup**

```bash
git add package.json pnpm-lock.yaml vitest.config.js src/components/BouquetRotationPuzzle.jsx src/components/BouquetRotationPuzzle.component.test.jsx
git commit -m "Add tested bouquet rotation component"
```

### Task 3: Add The Approved Bouquet Asset And Puzzle Styling

**Files:**
- Create: `public/puzzle/birthday-bouquet.png`
- Modify: `src/index.css`

- [ ] **Step 1: Copy the approved generated illustration into the project**

Run:

```bash
mkdir -p public/puzzle
cp /Users/cimcowboy/.codex/generated_images/019f0473-d7b3-70c3-8b6e-d3b9f9bf262b/exec-8d4e041b-d320-465d-8776-e3fc2463f6ed.png public/puzzle/birthday-bouquet.png
```

Expected: `public/puzzle/birthday-bouquet.png` exists and the source image remains untouched.

- [ ] **Step 2: Verify the selected asset is square**

Run:

```bash
sips -g pixelWidth -g pixelHeight public/puzzle/birthday-bouquet.png
```

Expected: `pixelWidth: 1254` and `pixelHeight: 1254`.

- [ ] **Step 3: Add stable grid and completion styles**

Add these component rules after `.puzzle-level-button:hover::after` in `src/index.css`:

```css
  .bouquet-puzzle {
    margin-top: 24px;
  }

  .bouquet-puzzle-status {
    min-height: 28px;
    margin: 0 0 12px;
    color: #7a4324;
    font-weight: 900;
    text-align: center;
  }

  .bouquet-puzzle.is-solved .bouquet-puzzle-status {
    color: #d94f67;
    font-family: Georgia, "Times New Roman", "Songti SC", serif;
    font-size: 24px;
  }

  .bouquet-puzzle-frame {
    position: relative;
    width: min(100%, 560px);
    aspect-ratio: 1;
    margin: 0 auto;
    overflow: hidden;
    border: 5px solid rgba(255, 255, 255, .9);
    border-radius: 8px;
    background: #f9eadf;
    box-shadow: 0 18px 40px rgba(128, 82, 35, .16);
    transition: border-color .25s ease, box-shadow .25s ease, transform .25s ease;
  }

  .bouquet-puzzle-grid {
    display: grid;
    width: 100%;
    height: 100%;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-template-rows: repeat(3, minmax(0, 1fr));
    gap: 3px;
    overflow: hidden;
    background: rgba(122, 67, 36, .16);
  }

  .bouquet-puzzle-tile {
    position: relative;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
    border: 0;
    background: #fff7ed;
    padding: 0;
    cursor: pointer;
  }

  .bouquet-puzzle-tile:focus-visible,
  .bouquet-puzzle-advance:focus-visible {
    z-index: 3;
    outline: 4px solid #75b9f2;
    outline-offset: -4px;
  }

  .bouquet-puzzle-tile:disabled {
    cursor: default;
  }

  .bouquet-puzzle-image {
    position: absolute;
    inset: 0;
    display: block;
    background-color: #fff7ed;
    background-repeat: no-repeat;
    background-size: 300% 300%;
    transition: transform .26s cubic-bezier(.2, .75, .3, 1);
    will-change: transform;
  }

  .bouquet-puzzle.is-solved .bouquet-puzzle-frame {
    border-color: #f26d7d;
    box-shadow:
      0 0 0 7px rgba(255, 159, 159, .28),
      0 22px 52px rgba(217, 79, 103, .24);
    animation: bouquetPuzzleGlow 1.5s ease-in-out infinite alternate;
  }

  .bouquet-puzzle-advance {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    border: 0;
    background: transparent;
    padding: 18px;
    cursor: pointer;
  }

  .bouquet-puzzle-advance span {
    border: 1px solid rgba(255, 255, 255, .88);
    border-radius: 999px;
    background: rgba(255, 250, 240, .92);
    box-shadow: 0 10px 28px rgba(122, 67, 36, .2);
    padding: 10px 18px;
    color: #b63f58;
    font-size: 14px;
    font-weight: 900;
  }

  @keyframes bouquetPuzzleGlow {
    from {
      transform: translateY(0);
      box-shadow:
        0 0 0 7px rgba(255, 159, 159, .22),
        0 18px 44px rgba(217, 79, 103, .2);
    }
    to {
      transform: translateY(-2px);
      box-shadow:
        0 0 0 10px rgba(255, 159, 159, .34),
        0 26px 58px rgba(217, 79, 103, .28);
    }
  }
```

The existing global `@media (prefers-reduced-motion: reduce)` rule already reduces the new transition and animation durations, so no duplicate media query is needed.

- [ ] **Step 4: Build to verify asset and CSS processing**

Run:

```bash
pnpm build
```

Expected: Vite exits with code 0 and emits the production bundle to `dist/`.

- [ ] **Step 5: Commit the asset and styling**

```bash
git add public/puzzle/birthday-bouquet.png src/index.css
git commit -m "Style the birthday bouquet puzzle"
```

### Task 4: Integrate The Puzzle Into Level One

**Files:**
- Create: `src/components/GamePage.component.test.jsx`
- Modify: `src/data/siteData.js:15-24`
- Modify: `src/components/GamePage.jsx:1-157`

- [ ] **Step 1: Write the failing GamePage integration test**

Create `src/components/GamePage.component.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
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

describe('GamePage bouquet level', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with the bouquet puzzle and advances through its completed frame', async () => {
    const user = userEvent.setup();
    render(<GamePage />);

    expect(screen.getByRole('heading', { name: 'Level 01：生日花束' })).toBeTruthy();
    expect(screen.getByRole('group', { name: '3乘3生日花束旋转拼图' })).toBeTruthy();

    const firstTile = screen.getAllByRole('button', { name: /拼图块，向左旋转 90 度/ })[0];
    await user.click(firstTile);
    await user.click(await screen.findByRole('button', { name: '拼好了，进入下一关' }));

    expect(screen.getByRole('heading', { name: 'Level 02：下一站填词' })).toBeTruthy();
    expect(screen.getByLabelText('输入你的答案')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run the integration test to verify it fails**

Run:

```bash
pnpm test:component -- src/components/GamePage.component.test.jsx
```

Expected: FAIL because level one still renders `Level 01：生日暗号` and has no bouquet puzzle group.

- [ ] **Step 3: Describe level one as a rotation puzzle**

Replace the first object in `gameLevels` in `src/data/siteData.js` with:

```js
  {
    id: 'level-01',
    kind: 'rotation-puzzle',
    type: '旋转拼图',
    title: 'Level 01：生日花束',
    description: '把每一块花束转回正确方向，拼好今天的第一份生日惊喜。',
    hint: '每次点击都会向左旋转 90 度。',
    answers: [],
    gift: '礼物 1 已解锁：请领取第一份小惊喜。',
  },
```

- [ ] **Step 4: Render the puzzle only for the rotation level**

Update the imports at the top of `src/components/GamePage.jsx`:

```jsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import { assetPath, gameLevels } from '../data/siteData.js';
import BouquetRotationPuzzle from './BouquetRotationPuzzle.jsx';
import Modal from './Modal.jsx';
import SectionTitle from './SectionTitle.jsx';
```

Add this callback after `goNext` and before the `return` statement:

```jsx
  const markCurrentLevelSolved = useCallback(() => {
    setSolved((current) =>
      current[level.id] ? current : { ...current, [level.id]: true },
    );
  }, [level.id]);
```

Replace the form at `src/components/GamePage.jsx:95-112` with:

```jsx
            {level.kind === 'rotation-puzzle' ? (
              <BouquetRotationPuzzle
                imageSrc={assetPath('puzzle/birthday-bouquet.png')}
                onSolved={markCurrentLevelSolved}
                onAdvance={goNext}
              />
            ) : (
              <form onSubmit={submitAnswer} className="mt-6 space-y-4">
                <label className="block text-sm font-black text-birthday-ink" htmlFor="puzzle-answer">
                  输入你的答案
                </label>
                <input
                  id="puzzle-answer"
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  className="w-full rounded-2xl border-2 border-[#f3c985] bg-white/90 px-4 py-3 text-birthday-ink outline-none transition focus:border-birthday-roseDeep focus:ring-4 focus:ring-birthday-rose/20"
                  placeholder="答案不会区分大小写和空格"
                />
                <div className="flex flex-wrap items-center gap-3">
                  <button type="submit" className="btn btn-rose">
                    提交答案
                  </button>
                  {message ? <span className="text-sm font-bold text-birthday-muted">{message}</span> : null}
                </div>
              </form>
            )}
```

Leave the existing modal flow unchanged; only text-answer levels use it. The completed bouquet frame calls `goNext` directly.

- [ ] **Step 5: Run all automated tests**

Run:

```bash
pnpm test
```

Expected: all Node unit tests and all four component tests pass.

- [ ] **Step 6: Commit the level integration**

```bash
git add src/data/siteData.js src/components/GamePage.jsx src/components/GamePage.component.test.jsx
git commit -m "Use bouquet puzzle for Puzzle Time level one"
```

### Task 5: Verify The Complete User Flow

**Files:**
- Verify: `src/components/BouquetRotationPuzzle.jsx`
- Verify: `src/components/GamePage.jsx`
- Verify: `src/index.css`
- Verify: `public/puzzle/birthday-bouquet.png`

- [ ] **Step 1: Run the full automated verification**

Run:

```bash
pnpm test && pnpm build
```

Expected: every test passes and Vite completes a production build with exit code 0.

- [ ] **Step 2: Start the development server**

Run:

```bash
pnpm dev --host 0.0.0.0
```

Expected: Vite prints a local URL without port conflicts. Keep the process running for browser verification.

- [ ] **Step 3: Verify desktop interaction in the in-app browser**

Open the Vite URL with the Browser plugin, use the preview jump control to enter Puzzle Time, and verify at a desktop viewport:

- level one contains exactly nine square tiles;
- every tile shows its portion of the hand-drawn bouquet;
- each pointer click turns only the selected tile 90 degrees counterclockwise;
- the solved image reconnects without seams or overlapping tiles;
- `拼好了！` appears without moving or resizing the board;
- the frame highlights and its full area advances to level two;
- level two still renders its text answer form.

Temporarily block `**/puzzle/birthday-bouquet.png` with the Browser plugin and reload level one. Confirm the square board retains its dimensions and all nine labeled tile buttons remain operable, then remove the route and reload before continuing.

Expected: all checks pass and the browser console has no errors.

- [ ] **Step 4: Verify mobile layout and keyboard behavior**

At a 390x844 viewport, verify the board remains square, no text overlaps, and no horizontal scrolling appears. Return to level one, tab to a tile, press Enter, and verify it rotates. Solve the final required tile with the keyboard, tab to the highlighted completed frame, and press Enter to enter level two.

Expected: mobile layout and keyboard flow complete without clipped controls or focus loss.

- [ ] **Step 5: Inspect the final diff and working tree**

Run:

```bash
git diff --check
git status --short
```

Expected: `git diff --check` prints nothing. `git status --short` contains no uncommitted implementation files; the pre-existing untracked `.superpowers/` visual-companion cache may remain untracked.
