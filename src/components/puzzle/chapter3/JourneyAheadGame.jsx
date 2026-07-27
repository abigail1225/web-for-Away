import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { chapterThreeData } from '../../../data/chapterThreeData.js';
import {
  completeJourneyClue,
  createJourneyProgress,
  getCurrentJourneyClue,
  isJourneyGiftUnlocked,
} from '../../../journeyAhead.js';
import ClueProgress from './ClueProgress.jsx';
import FootprintPuzzle from './FootprintPuzzle.jsx';
import GiftBoxReveal from './GiftBoxReveal.jsx';
import MemoryPuzzle from './MemoryPuzzle.jsx';
import PuzzleModal from './PuzzleModal.jsx';
import RoadPuzzle from './RoadPuzzle.jsx';
import RoomScene from './RoomScene.jsx';
import StepLetterPuzzle from './StepLetterPuzzle.jsx';

export default function JourneyAheadGame({ data = chapterThreeData, onSolved, onAdvance }) {
  const [progress, setProgress] = useState(() => {
    try {
      return createJourneyProgress(JSON.parse(localStorage.getItem(data.storageKey)) || {});
    } catch {
      return createJourneyProgress();
    }
  });
  const [activeModalId, setActiveModalId] = useState(null);
  const [claimOpen, setClaimOpen] = useState(false);
  const solvedRef = useRef(false);

  const activeClue = getCurrentJourneyClue(progress);
  const giftUnlocked = isJourneyGiftUnlocked(progress);
  const activeModalClue = useMemo(
    () => data.clues.find((clue) => clue.id === activeModalId),
    [activeModalId, data.clues],
  );

  useEffect(() => {
    localStorage.setItem(data.storageKey, JSON.stringify(progress));
  }, [data.storageKey, progress]);

  useEffect(() => {
    if (giftUnlocked && !solvedRef.current) {
      solvedRef.current = true;
      onSolved?.();
    }
  }, [giftUnlocked, onSolved]);

  const finishClue = useCallback(
    (clueId) => {
      setProgress((current) => {
        const next = completeJourneyClue(current, clueId);
        return isJourneyGiftUnlocked(next) ? { ...next, giftOpened: true } : next;
      });
    },
    [setProgress],
  );

  const openClue = (clueId) => {
    if (progress.completedClues.includes(clueId) || activeClue !== clueId) {
      return;
    }

    setActiveModalId(clueId);
  };

  const resetChapter = () => {
    setProgress(createJourneyProgress());
    setActiveModalId(null);
    setClaimOpen(false);
    solvedRef.current = false;
  };

  const confirmRealityGift = () => {
    setClaimOpen(false);
    setProgress((current) => ({ ...current, realityGiftClaimed: true }));
  };

  return (
    <div className="journey-game">
      <header className="journey-game-header">
        <p>Puzzle Time · Chapter 3</p>
        <h3>{data.title}</h3>
        <span>{data.intro}</span>
        <button type="button" onClick={resetChapter}>
          重新开始本关
        </button>
      </header>

      <ClueProgress clues={data.clues} completedClues={progress.completedClues} />
      <RoomScene
        activeClue={activeClue}
        assets={data.assets}
        clues={data.clues}
        completedClues={progress.completedClues}
        giftOpen={progress.giftOpened}
        onOpenClue={openClue}
      />

      {giftUnlocked ? (
        <GiftBoxReveal
          assets={data.assets}
          claimOpen={claimOpen}
          claimed={progress.realityGiftClaimed}
          finalMessage={data.finalMessage}
          onAdvance={onAdvance}
          onClaim={() => setClaimOpen(true)}
          onConfirmClaim={confirmRealityGift}
        />
      ) : null}

      {activeModalClue ? (
        <PuzzleModal title={activeModalClue.title} onClose={() => setActiveModalId(null)}>
          {renderPuzzle(activeModalClue, data, () => finishClue(activeModalClue.id))}
        </PuzzleModal>
      ) : null}
    </div>
  );
}

function renderPuzzle(clue, data, onComplete) {
  if (clue.type === 'photo-order') {
    return <MemoryPuzzle clue={clue} onComplete={onComplete} photos={data.memoryPhotos} />;
  }

  if (clue.type === 'route-rotate') {
    return <RoadPuzzle clue={clue} onComplete={onComplete} tiles={data.roadTiles} />;
  }

  if (clue.type === 'acrostic-letter') {
    return <StepLetterPuzzle clue={clue} lines={data.letterLines} onComplete={onComplete} />;
  }

  return <FootprintPuzzle clue={clue} onComplete={onComplete} sequence={data.footprintSequence} />;
}
