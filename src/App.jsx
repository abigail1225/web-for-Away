import { useState } from 'react';
import GamePage from './components/GamePage.jsx';
import MailboxPage from './components/MailboxPage.jsx';
import OpeningPage from './components/OpeningPage.jsx';
import PhotoWallPage from './components/PhotoWallPage.jsx';
import QuizGamePage from './components/QuizGamePage.jsx';
import SiteNav from './components/SiteNav.jsx';
import TarotPage from './components/TarotPage.jsx';

export default function App() {
  const [stage, setStage] = useState('opening');

  if (stage === 'opening') {
    return <OpeningPage onEnter={() => setStage('tarot')} />;
  }

  if (stage === 'tarot') {
    return <TarotPage onComplete={() => setStage('quiz')} />;
  }

  if (stage === 'quiz') {
    return <QuizGamePage onComplete={() => setStage('main')} />;
  }

  return (
    <div className="min-h-screen overflow-x-hidden text-birthday-ink">
      <SiteNav onBackToOpening={() => setStage('opening')} />
      <main className="pt-24 md:pt-20">
        <GamePage />
        <PhotoWallPage />
        <MailboxPage />
      </main>
      <footer className="px-4 pb-12 pt-4 text-center text-sm text-birthday-muted">
        Made with love · 新的一岁也要被认真偏爱
      </footer>
    </div>
  );
}
