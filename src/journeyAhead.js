export const journeyClueOrder = ['memory', 'road', 'step', 'shoe'];

export function createJourneyProgress(overrides = {}) {
  return {
    completedClues: [],
    giftOpened: false,
    realityGiftClaimed: false,
    ...overrides,
  };
}

export function getCurrentJourneyClue(progress) {
  return journeyClueOrder.find((id) => !progress.completedClues.includes(id)) || null;
}

export function isJourneyClueUnlocked(progress, clueId) {
  return progress.completedClues.includes(clueId) || getCurrentJourneyClue(progress) === clueId;
}

export function completeJourneyClue(progress, clueId) {
  if (progress.completedClues.includes(clueId) || getCurrentJourneyClue(progress) !== clueId) {
    return progress;
  }

  return {
    ...progress,
    completedClues: [...progress.completedClues, clueId],
  };
}

export function isJourneyGiftUnlocked(progress) {
  return journeyClueOrder.every((id) => progress.completedClues.includes(id));
}
