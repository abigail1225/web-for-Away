import { useState } from 'react';
import GamePage from './components/GamePage.jsx';
import MailboxPage from './components/MailboxPage.jsx';
import MemoryMapPage from './components/MemoryMapPage.jsx';
import OpeningPage from './components/OpeningPage.jsx';
import PhotoWallPage from './components/PhotoWallPage.jsx';
import PreviewJumpPanel from './components/PreviewJumpPanel.jsx';
import QuizGamePage from './components/QuizGamePage.jsx';
import TarotPage from './components/TarotPage.jsx';

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
  const previewPanel = <PreviewJumpPanel onStageChange={setStage} />;
  const goHome = () => {
    window.location.hash = '';
    setStage('home');
  };

  if (stage === 'opening') {
    return (
      <>
        <OpeningPage onEnter={() => setStage('home')} />
        {previewPanel}
      </>
    );
  }

  if (stage === 'home') {
    return (
      <>
        <MemoryMapPage onEnterRoom={setStage} onBackToOpening={() => setStage('opening')} />
        {previewPanel}
      </>
    );
  }

  if (stage === 'tarot') {
    return (
      <>
        <RoomShell onBackHome={goHome}>
          <TarotPage onComplete={goHome} completeLabel="回到生日小屋" />
        </RoomShell>
        {previewPanel}
      </>
    );
  }

  if (stage === 'quiz') {
    return (
      <>
        <RoomShell onBackHome={goHome}>
          <QuizGamePage onComplete={goHome} completeLabel="回到生日小屋" />
        </RoomShell>
        {previewPanel}
      </>
    );
  }

  if (stage === 'puzzle') {
    return (
      <>
        <RoomShell onBackHome={goHome}>
          <GamePage onFinish={goHome} finishLabel="回到生日小屋" />
        </RoomShell>
        {previewPanel}
      </>
    );
  }

  if (stage === 'photos') {
    return (
      <>
        <RoomShell onBackHome={goHome}>
          <PhotoWallPage />
        </RoomShell>
        {previewPanel}
      </>
    );
  }

  if (stage === 'letters') {
    return (
      <>
        <RoomShell onBackHome={goHome}>
          <MailboxPage />
        </RoomShell>
        {previewPanel}
      </>
    );
  }

  return (
    <>
      <MemoryMapPage onEnterRoom={setStage} onBackToOpening={() => setStage('opening')} />
      {previewPanel}
    </>
  );
}
