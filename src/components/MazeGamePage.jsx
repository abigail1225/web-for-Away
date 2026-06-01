import { useEffect, useMemo, useState } from 'react';

const size = 17;
const keyOf = ({ x, y }) => `${x},${y}`;
const range = (from, to) => Array.from({ length: to - from + 1 }, (_, index) => from + index);
const cellsFrom = (cells) => new Set(cells.map(([x, y]) => `${x},${y}`));
const rect = (x1, y1, x2, y2) => range(y1, y2).flatMap((y) => range(x1, x2).map((x) => [x, y]));

const makeLevels = () => [
  {
    id: 'i',
    title: 'Level 01',
    subtitle: 'The letter I',
    start: { x: 4, y: 3 },
    exit: { x: 12, y: 13 },
    cells: cellsFrom([
      ...rect(4, 2, 12, 4),
      ...rect(6, 2, 10, 14),
      ...rect(4, 12, 12, 14),
    ]),
    obstacles: cellsFrom([
      [7, 3],
      [10, 3],
      [8, 5],
      [7, 7],
      [9, 9],
      [8, 11],
      [6, 13],
      [10, 13],
    ]),
  },
  {
    id: 'heart',
    title: 'Level 02',
    subtitle: 'The soft middle',
    start: { x: 5, y: 2 },
    exit: { x: 8, y: 11 },
    cells: cellsFrom([
      ...[5, 6, 10, 11].map((x) => [x, 2]),
      ...range(4, 7).map((x) => [x, 3]),
      ...range(9, 12).map((x) => [x, 3]),
      ...range(3, 13).map((x) => [x, 4]),
      ...range(3, 13).map((x) => [x, 5]),
      ...range(4, 12).map((x) => [x, 6]),
      ...range(5, 11).map((x) => [x, 7]),
      ...range(6, 10).map((x) => [x, 8]),
      ...range(7, 9).map((x) => [x, 9]),
      [8, 10],
      [8, 11],
    ]),
    obstacles: cellsFrom([
      [6, 4],
      [10, 4],
      [4, 5],
      [8, 5],
      [12, 5],
      [6, 6],
      [10, 6],
      [8, 8],
    ]),
  },
  {
    id: 'u',
    title: 'Level 03',
    subtitle: 'The letter U',
    start: { x: 4, y: 2 },
    exit: { x: 12, y: 2 },
    cells: cellsFrom([
      ...rect(3, 2, 5, 12),
      ...rect(11, 2, 13, 12),
      ...rect(3, 10, 13, 12),
    ]),
    obstacles: cellsFrom([
      [4, 4],
      [3, 7],
      [5, 10],
      [7, 11],
      [9, 10],
      [12, 8],
      [11, 5],
    ]),
  },
];

const directions = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
  W: { x: 0, y: -1 },
  S: { x: 0, y: 1 },
  A: { x: -1, y: 0 },
  D: { x: 1, y: 0 },
};

export default function MazeGamePage({ onComplete }) {
  const levels = useMemo(makeLevels, []);
  const [levelIndex, setLevelIndex] = useState(0);
  const [player, setPlayer] = useState(levels[0].start);
  const [trail, setTrail] = useState([levels[0].start]);
  const [finishedTrails, setFinishedTrails] = useState({});
  const [notice, setNotice] = useState('用方向键或 WASD 移动，绕开地形里的挡板。');
  const [mode, setMode] = useState('playing');

  const level = levels[levelIndex];
  const obstacleKeys = level.obstacles;

  const finishLevel = (finalTrail) => {
    const nextTrails = { ...finishedTrails, [level.id]: finalTrail };
    setFinishedTrails(nextTrails);

    if (levelIndex === levels.length - 1) {
      setMode('reveal');
      setNotice('完成。把三段轨迹拼起来看看。');
      return;
    }

    setNotice('很好，下一关。');
    const nextLevel = levels[levelIndex + 1];
    setLevelIndex((current) => current + 1);
    setPlayer(nextLevel.start);
    setTrail([nextLevel.start]);
  };

  const move = (delta) => {
    if (mode !== 'playing') return;

    const next = { x: player.x + delta.x, y: player.y + delta.y };
    const nextKey = keyOf(next);
    if (!level.cells.has(nextKey) || obstacleKeys.has(nextKey)) {
      setNotice('前面是挡板，像迷宫一样绕过去。');
      return;
    }

    const nextTrail = [...trail, next];
    setPlayer(next);
    setTrail(nextTrail);
    setNotice('继续走，出口在发光。');

    if (next.x === level.exit.x && next.y === level.exit.y) {
      finishLevel(nextTrail);
    }
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      const delta = directions[event.key];
      if (!delta) return;
      event.preventDefault();
      move(delta);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  if (mode === 'reveal') {
    return (
      <main className="maze-page maze-reveal-page">
        <section className="maze-reveal">
          <p className="maze-kicker">Trajectory replay</p>
          <h1>i ❤️ U</h1>
          <div className="replay-strip" aria-label="三关行动轨迹回放">
            {levels.map((item) => (
              <MiniMap key={item.id} level={item} trail={finishedTrails[item.id] || []} />
            ))}
          </div>
          <button type="button" className="puzzle-portal" onClick={onComplete}>
            Puzzle Time
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="maze-page">
      <section className="maze-head">
        <p className="maze-kicker">The lights go out</p>
        <h1>{level.title}</h1>
        <p>{level.subtitle}</p>
      </section>

      <section className="maze-wrap">
        <div
          className="maze-grid"
          style={{ '--maze-size': size }}
          aria-label={`${level.title} 迷宫`}
        >
          {Array.from({ length: size * size }, (_, index) => {
            const x = index % size;
            const y = Math.floor(index / size);
            const key = `${x},${y}`;
            const distance = Math.hypot(player.x - x, player.y - y);
            const visible = distance <= 4.15;
            const isPath = level.cells.has(key);
            const isTrail = trail.some((cell) => cell.x === x && cell.y === y);
            const isPlayer = player.x === x && player.y === y;
            const isExit = level.exit.x === x && level.exit.y === y;
            const isObstacle = obstacleKeys.has(key);

            return (
              <span
                key={key}
                className={[
                  'maze-cell',
                  visible ? 'seen' : 'unseen',
                  isPath ? 'path' : 'wall',
                  isObstacle ? 'obstacle' : '',
                  isTrail ? 'trail' : '',
                  isExit ? 'exit' : '',
                  isPlayer ? 'player' : '',
                ].join(' ')}
              />
            );
          })}
        </div>

        <aside className="maze-panel">
          <p>{notice}</p>
          <div className="maze-progress">
            {levels.map((item, index) => (
              <span key={item.id} className={index <= levelIndex ? 'active' : ''} />
            ))}
          </div>
          <div className="maze-controls" aria-label="移动按钮">
            <button type="button" onClick={() => move(directions.ArrowUp)}>↑</button>
            <button type="button" onClick={() => move(directions.ArrowLeft)}>←</button>
            <button type="button" onClick={() => move(directions.ArrowDown)}>↓</button>
            <button type="button" onClick={() => move(directions.ArrowRight)}>→</button>
          </div>
        </aside>
      </section>
    </main>
  );
}

function MiniMap({ level, trail }) {
  const trailKeys = new Set(trail.map(keyOf));

  return (
    <div className="mini-map" style={{ '--maze-size': size }}>
      {Array.from({ length: size * size }, (_, index) => {
        const x = index % size;
        const y = Math.floor(index / size);
        const key = `${x},${y}`;
        return (
          <span
            key={key}
            className={[
              level.cells.has(key) ? 'mini-path' : '',
              trailKeys.has(key) ? 'mini-trail' : '',
              level.exit.x === x && level.exit.y === y ? 'mini-exit' : '',
            ].join(' ')}
          />
        );
      })}
    </div>
  );
}
