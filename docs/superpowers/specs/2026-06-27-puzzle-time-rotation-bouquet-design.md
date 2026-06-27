# Puzzle Time Rotation Bouquet Design

## Goal

Replace the first Puzzle Time text challenge with a 3x3 rotation puzzle. Every tile always shows its portion of a birthday bouquet. Clicking a tile rotates it 90 degrees counterclockwise. The level is complete when all nine tiles face their original orientation.

## Approved Visual Direction

- Use the approved hand-drawn birthday bouquet: pink and coral flowers, green leaves, pale pink wrapping paper, and a prominent ribbon bow.
- Keep the illustration polished and recognizable, with clean outlines and lightly textured flat color rather than photorealism.
- Use one square source image so all tile edges line up exactly when solved.
- Preserve the surrounding Puzzle Time page styling and responsive behavior.

## Interaction

1. The first level opens with all nine bouquet pieces visible in a 3x3 grid.
2. Each tile starts at a randomly selected quarter-turn orientation.
3. The generated starting state must contain at least one incorrectly oriented tile, so the puzzle never begins solved.
4. Clicking or keyboard-activating a tile rotates only that tile 90 degrees counterclockwise with a short transition.
5. A tile is correct only when its accumulated rotation is equivalent to 0 degrees.
6. When all nine tiles are correct, further tile rotation is disabled and the interface displays `拼好了！`.
7. The puzzle's outer frame gains a clear celebratory highlight and becomes the level-advance control.
8. Clicking or keyboard-activating the completed frame advances to the existing second Puzzle Time level.

## Architecture

### Puzzle Model

Represent the board as an array of nine integer quarter-turn counts. Initial values are `0`, `1`, `2`, or `3`; each click subtracts one without normalizing the stored count, so the CSS transition always travels exactly 90 degrees counterclockwise. Correctness is evaluated modulo four. A pure helper will:

- rotate one indexed tile counterclockwise by one quarter-turn;
- determine whether every value is equivalent to `0` modulo four;
- create a randomized, guaranteed-unsolved starting board.

Keeping these rules independent from rendering makes the completion logic easy to test.

### Puzzle Component

Add a focused bouquet puzzle component for the first level. It owns the nine rotation values and renders nine equal buttons. Each fixed button clips overflow and contains an inner square image layer. The inner layer uses the shared source image with a tile-specific background position and receives the rotation transform. This keeps the grid geometry stable and prevents a rotating corner from covering a neighboring tile.

The component reports completion and requests level advancement through callbacks. The existing Puzzle Time page remains responsible for selecting the current level and preserving the established gift-unlock flow.

### Asset Handling

Store the approved square bouquet illustration as a project asset. The browser loads one image; CSS uses a background size of 300% by 300% and one of nine background positions to expose each tile's portion. Rotating the tile container rotates both the crop and its contents without requiring nine separate files.

## State And Data Flow

- Entering or restarting level one creates a new guaranteed-unsolved board.
- A tile activation subtracts one from a single array element; solved-state checks normalize the value modulo four.
- Completion is derived from the board after every move rather than maintained as separate mutable state.
- Once complete, the board exposes a single advance action and ignores tile rotations.
- Advancing uses the page's existing level transition mechanism, so level two and later progress behavior remain unchanged.

## Accessibility And Responsive Behavior

- Tiles are semantic buttons with labels that identify their grid position.
- Focus indicators remain visible, and Enter/Space perform the same rotation as a pointer click.
- The completed frame is keyboard reachable and announces that it advances to the next level.
- The board stays square and scales to the available width; each tile remains exactly one third of the board.
- Completion text and highlighting must not resize or shift the grid.
- Respect reduced-motion preferences by removing or shortening rotation and highlight animation.

## Error Handling

- If the bouquet image fails to load, retain the board dimensions and expose accessible tile labels so the page remains operable.
- Ignore invalid tile indexes in the pure rotation helper.
- Prevent repeated level advancement by disabling the completed-frame action after it has been activated.

## Testing

### Unit Tests

- Rotating a tile moves `0 -> -1 -> -2 -> -3 -> -4`, producing one 90-degree counterclockwise transition per click; both `0` and `-4` are correct orientations.
- Only the requested tile changes.
- Completion is true only when all nine rotations are equivalent to `0` modulo four.
- Random initialization always returns nine valid quarter-turn values and never returns an already solved board.

### Component Tests

- The first level renders nine interactive tiles with clipped, independently rotating image layers.
- Pointer and keyboard activation rotate the selected tile.
- Completing the board shows `拼好了！`, disables tile changes, and enables the highlighted frame.
- Activating the completed frame advances exactly once to level two.

### Browser Verification

- Verify the image crops reconnect into one bouquet at completion.
- Verify the grid remains square and free of overlap on desktop and mobile viewports.
- Verify visible focus, completion highlighting, and reduced-motion behavior.

## Out Of Scope

- Changing the content or mechanics of Puzzle Time levels two and three.
- Adding timers, move counters, hints, scoring, drag-and-drop, or persistence for an unfinished board.
- Splitting the bouquet into nine physical image files or introducing a canvas rendering engine.
