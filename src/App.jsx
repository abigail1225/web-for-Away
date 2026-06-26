import { useState } from 'react';
import GamePage from './components/GamePage.jsx';
import HugButton from './components/HugButton.jsx';
import MailboxPage from './components/MailboxPage.jsx';
import MemoryMapPage from './components/MemoryMapPage.jsx';
import Modal from './components/Modal.jsx';
import OpeningPage from './components/OpeningPage.jsx';
import PhotoWallPage from './components/PhotoWallPage.jsx';
import PreviewJumpPanel from './components/PreviewJumpPanel.jsx';
import QuizGamePage from './components/QuizGamePage.jsx';
import TarotPage from './components/TarotPage.jsx';
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
  const [stage, setStage] = useState('opening');
  const [exploredRooms, setExploredRooms] = useState([]);
  const [mailboxLocked, setMailboxLocked] = useState(false);
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

  const previewPanel = <PreviewJumpPanel onStageChange={enterStage} />;
  const hugSurprise = stage !== 'opening' ? <HugButton showCount={stage === 'home'} /> : null;
  const goHome = () => {
    window.location.hash = '';
    setStage('home');
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
        这封信要留到最后。先把塔罗桌、猜人物、礼物柜和照片墙都看过，再回来打开信箱。
      </p>
    </Modal>
  );

  if (stage === 'opening') {
    return (
      <>
        <OpeningPage onEnter={() => enterStage('home')} />
        {previewPanel}
        {lockedMailboxModal}
      </>
    );
  }

  if (stage === 'home') {
    return (
      <>
        <MemoryMapPage
          activeCueId={activeCueId}
          onEnterRoom={enterStage}
          onBackToOpening={() => enterStage('opening')}
        />
        {hugSurprise}
        {previewPanel}
        {lockedMailboxModal}
      </>
    );
  }

  if (stage === 'tarot') {
    return (
      <>
        <RoomShell onBackHome={goHome}>
          <TarotPage onComplete={goHome} completeLabel="回到生日小屋" />
        </RoomShell>
        {hugSurprise}
        {previewPanel}
        {lockedMailboxModal}
      </>
    );
  }

  if (stage === 'quiz') {
    return (
      <>
        <RoomShell onBackHome={goHome}>
          <QuizGamePage onComplete={goHome} completeLabel="回到生日小屋" />
        </RoomShell>
        {hugSurprise}
        {previewPanel}
        {lockedMailboxModal}
      </>
    );
  }

  if (stage === 'puzzle') {
    return (
      <>
        <RoomShell onBackHome={goHome}>
          <GamePage onFinish={goHome} finishLabel="回到生日小屋" />
        </RoomShell>
        {hugSurprise}
        {previewPanel}
        {lockedMailboxModal}
      </>
    );
  }

  if (stage === 'photos') {
    return (
      <>
        <RoomShell onBackHome={goHome}>
          <PhotoWallPage />
        </RoomShell>
        {hugSurprise}
        {previewPanel}
        {lockedMailboxModal}
      </>
    );
  }

  if (stage === 'letters') {
    return (
      <>
        <RoomShell onBackHome={goHome}>
          <MailboxPage />
        </RoomShell>
        {hugSurprise}
        {previewPanel}
        {lockedMailboxModal}
      </>
    );
  }

  return (
    <>
      <MemoryMapPage
        activeCueId={activeCueId}
        onEnterRoom={enterStage}
        onBackToOpening={() => enterStage('opening')}
      />
      {hugSurprise}
      {previewPanel}
      {lockedMailboxModal}
    </>
  );
}
