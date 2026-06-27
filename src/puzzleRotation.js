export const TILE_COUNT = 9;

export function rotateTileLeft(rotations, index) {
  if (!Number.isInteger(index) || index < 0 || index >= TILE_COUNT) {
    return rotations;
  }

  const nextRotations = rotations.slice();
  nextRotations[index] -= 1;
  return nextRotations;
}

export function isPuzzleSolved(rotations) {
  if (!Array.isArray(rotations) || rotations.length !== TILE_COUNT) {
    return false;
  }

  return rotations.every((rotation) => Number.isInteger(rotation) && rotation % 4 === 0);
}

export function createStartingRotations(random = Math.random) {
  const rotations = Array.from({ length: TILE_COUNT }, () => Math.floor(random() * 4));

  if (isPuzzleSolved(rotations)) {
    const index = Math.floor(random() * TILE_COUNT);
    rotations[index] = 1;
  }

  return rotations;
}
