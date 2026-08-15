import { useRef, useState } from 'react';
import GamePage from './components/GamePage.jsx';
import HugButton from './components/HugButton.jsx';
import MailboxPage from './components/MailboxPage.jsx';
import MemoryMapPage from './components/MemoryMapPage.jsx';
import Modal from './components/Modal.jsx';
import OpeningPage from './components/OpeningPage.jsx';
import PhotoWallPage from './components/PhotoWallPage.jsx';
import QuizGamePage from './components/QuizGamePage.jsx';
import TarotPage from './components/TarotPage.jsx';
import { assetPath, openingLetter } from './data/siteData.js';
import { toggleRoomLights } from './roomLighting.js';
import { getNextCueId, isMailboxUnlocked, markRoomExplored } from './roomProgress.js';

function RoomShell({ children, onBackHome }) {
  return (
    <>
      <button type="button" onClick={onBackHome} className="room-return">
        回到生日小屋
      </button>
      {children}
    </>
  );
}

export default function App() {
  const birthdayAudioRef = useRef(null);
  const [stage, setStage] = useState('opening');
  const [exploredRooms, setExploredRooms] = useState([]);
  const [mailboxLocked, setMailboxLocked] = useState(false);
  const [roomLighting, setRoomLighting] = useState({
    birthdayMomentSeen: false,
    lightsOff: false,
    showBirthdayMoment: false,
  });
  const mailboxUnlocked = isMailboxUnlocked(exploredRooms);
  const activeCueId = getNextCueId(exploredRooms);

  const enterStage = (nextStage) => {
    window.location.hash = '';

    if (nextStage === 'letters' && !mailboxUnlocked) {
      setMailboxLocked(true);
      return;
    }

    setExploredRooms((current) => markRoomExplored(current, nextStage));
    setMailboxLocked(false);
    setStage(nextStage);
  };

  const hugSurprise = stage !== 'opening' ? <HugButton showCount={stage === 'home'} /> : null;
  const goHome = () => {
    window.location.hash = '';
    setStage('home');
  };
  const playBirthdaySong = async () => {
    await birthdayAudioRef.current?.play();
  };
  const toggleLights = () => {
    setRoomLighting((current) => toggleRoomLights(current));
  };

  const lockedMailboxModal = (
    <Modal
      open={mailboxLocked}
      title="信箱还锁着"
      onClose={() => setMailboxLocked(false)}
      actions={
        <button type="button" onClick={() => setMailboxLocked(false)} className="btn btn-rose">
          继续探索小屋
        </button>
      }
    >
      <p className="leading-8 text-birthday-muted">
        这封信要留到最后。先把塔罗桌、猜人物、谜题桌和照片墙都看过，再回来打开信箱。
      </p>
    </Modal>
  );

  let stageContent;

  if (stage === 'opening') {
    stageContent = <OpeningPage onEnter={() => enterStage('home')} onPlayBirthdaySong={playBirthdaySong} />;
  } else if (stage === 'home') {
    stageContent = (
      <MemoryMapPage
        activeCueId={activeCueId}
        roomLighting={roomLighting}
        onToggleLights={toggleLights}
        onEnterRoom={enterStage}
        onBackToOpening={() => enterStage('opening')}
      />
    );
  } else if (stage === 'tarot') {
    stageContent = (
      <RoomShell onBackHome={goHome}>
        <TarotPage onComplete={goHome} completeLabel="回到生日小屋" />
      </RoomShell>
    );
  } else if (stage === 'quiz') {
    stageContent = (
      <RoomShell onBackHome={goHome}>
        <QuizGamePage onComplete={goHome} completeLabel="回到生日小屋" />
      </RoomShell>
    );
  } else if (stage === 'puzzle') {
    stageContent = (
      <RoomShell onBackHome={goHome}>
        <GamePage onFinish={goHome} finishLabel="回到生日小屋" />
      </RoomShell>
    );
  } else if (stage === 'photos') {
    stageContent = (
      <RoomShell onBackHome={goHome}>
        <PhotoWallPage />
      </RoomShell>
    );
  } else if (stage === 'letters') {
    stageContent = (
      <RoomShell onBackHome={goHome}>
        <MailboxPage />
      </RoomShell>
    );
  } else {
    stageContent = (
      <MemoryMapPage
        activeCueId={activeCueId}
        roomLighting={roomLighting}
        onToggleLights={toggleLights}
        onEnterRoom={enterStage}
        onBackToOpening={() => enterStage('opening')}
      />
    );
  }

  return (
    <>
      <audio ref={birthdayAudioRef} src={assetPath(openingLetter.audio)} preload="auto" />
      {stageContent}
      {hugSurprise}
      {lockedMailboxModal}
    </>
  );
}
