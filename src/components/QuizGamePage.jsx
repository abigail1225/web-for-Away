import { useMemo, useState } from 'react';
import { assetPath } from '../data/siteData.js';
import { letterStyles, quizIntro, quizQuestions } from '../data/quizGameData.js';

const normalize = (value) => value.trim().replace(/\s+/g, '').toLowerCase();

export default function QuizGamePage({ onComplete, completeLabel = '进入 Puzzle Time' }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [phase, setPhase] = useState('greeting');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [imageFailed, setImageFailed] = useState(false);
  const [mistakeKey, setMistakeKey] = useState(0);

  const question = quizQuestions[questionIndex];
  const isLast = questionIndex === quizQuestions.length - 1;
  const collectedLetters = useMemo(
    () => quizQuestions.map((item) => item.finalLetter || item.answer.charAt(0)),
    [],
  );

  const goNextBubble = () => {
    if (phase === 'greeting') {
      setPhase('question');
      setFeedback('');
    }
  };

  const submitAnswer = (event) => {
    event.preventDefault();
    const accepted = [question.answer, question.character].map(normalize);

    if (accepted.includes(normalize(answer))) {
      setFeedback(question.correctReply);
      setPhase('correct');
      return;
    }

    setFeedback(question.wrongReply);
    setMistakeKey((current) => current + 1);
  };

  const revealAnswer = () => {
    setPhase('reveal');
  };

  const advance = () => {
    if (isLast) {
      setPhase('finale');
      return;
    }

    setQuestionIndex((current) => current + 1);
    setPhase('greeting');
    setAnswer('');
    setFeedback('');
    setImageFailed(false);
    setMistakeKey(0);
  };

  if (phase === 'finale') {
    return (
      <main className="quiz-page quiz-finale-page">
        <section className="quiz-finale">
          <p className="quiz-kicker">All letters unlocked</p>
          <h1 aria-label="I love You">
            {collectedLetters.map((letter, index) => {
              const spacer = index === 0 || index === 4 ? ' ' : '';
              return (
                <span key={`${letter}-${index}`} style={letterStyles[index]}>
                  {letter}
                  {spacer}
                </span>
              );
            })}
          </h1>
          <p>{quizIntro.finalMessage}</p>
          <button type="button" className="btn btn-rose" onClick={onComplete}>
            {completeLabel}
          </button>
        </section>
      </main>
    );
  }

  const currentLetter = question.answer.charAt(0);

  return (
    <main className="quiz-page">
      <section className="quiz-stage">
        <div className="quiz-photo-wrap" key={question.id}>
          {!imageFailed ? (
            <img
              src={assetPath(question.image)}
              alt={`${question.character} 提示图`}
              className="quiz-photo"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="quiz-photo quiz-photo-placeholder">
              <span>{question.character}</span>
              <small>{question.image}</small>
            </div>
          )}
        </div>

        <aside className="quiz-dialogue">
          <p className="quiz-kicker">
            Question {String(questionIndex + 1).padStart(2, '0')} / {String(quizQuestions.length).padStart(2, '0')}
          </p>
          <div className="quiz-letter-track" aria-label="暗号进度">
            {quizQuestions.map((item, index) => {
              const unlocked = index < questionIndex || (index === questionIndex && (phase === 'reveal' || phase === 'finale'));
              const active = index === questionIndex;
              return (
                <span
                  key={item.id}
                  className={`quiz-letter-dot ${unlocked ? 'unlocked' : ''} ${active ? 'active' : ''}`}
                  style={unlocked ? letterStyles[index] : undefined}
                >
                  {unlocked ? item.finalLetter || item.answer.charAt(0) : '•'}
                </span>
              );
            })}
          </div>
          {phase === 'reveal' ? <h1>Answer unlocked</h1> : null}

          {phase === 'greeting' ? (
            <button type="button" className="quiz-bubble" onClick={goNextBubble}>
              <span>{question.greeting || quizIntro.greeting}</span>
              <small className="tap-hint">点击继续</small>
            </button>
          ) : null}

          {phase === 'question' || phase === 'correct' ? (
            <form onSubmit={submitAnswer} className={`quiz-form ${feedback && phase !== 'correct' ? 'has-error' : ''}`} key={mistakeKey}>
              <p className="quiz-bubble">{question.prompt || quizIntro.prompt}</p>
              <label htmlFor="quiz-answer">输入答案</label>
              <input
                id="quiz-answer"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="大小写和空格不用完全一致"
                disabled={phase === 'correct'}
              />
              {feedback ? <p className={phase === 'correct' ? 'quiz-feedback correct' : 'quiz-feedback'}>{feedback}</p> : null}
              {phase === 'correct' ? (
                <button type="button" className="btn btn-lavender" onClick={revealAnswer}>
                  查看正确答案
                </button>
              ) : (
                <button type="submit" className="btn btn-rose">
                  提交
                </button>
              )}
            </form>
          ) : null}

          {phase === 'reveal' ? (
            <button type="button" className="quiz-answer-reveal" onClick={advance}>
              <span style={letterStyles[questionIndex]}>{currentLetter}</span>
              {question.answer.slice(1)}
              <small>{isLast ? '点击查看最终答案' : '点击进入下一张照片'}</small>
            </button>
          ) : null}
        </aside>
      </section>
    </main>
  );
}
