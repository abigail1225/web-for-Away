import { useEffect, useMemo, useState } from 'react';

const size = 17;
const keyOf = ({ x, y }) => `${x},${y}`;
const range = (from, to) => Array.from({ length: to - from + 1 }, (_, index) => from + index);
const cellsFrom = (cells) => new Set(cells.map(([x, y]) => `${x},${y}`));

const makeLevels = () => [
  {
    id: 'i',
    title: 'Level 01',
    subtitle: 'The letter I',
    start: { x: 5, y: 2 },
    exit: { x: 11, y: 14 },
    cells: cellsFrom([
      ...range(5, 11).map((x) => [x, 2]),
      ...range(2, 14).map((y) => [8, y]),
      ...range(5, 11).map((x) => [x, 14]),
    ]),
    hazards: [
      range(4, 12).map((y) => ({ x: 8, y })),
      range(5, 11).map((x) => ({ x, y: 14 })),
    ],
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
    hazards: [
      range(4, 12).map((x) => ({ x, y: 5 })),
      range(6, 10).map((x) => ({ x, y: 8 })),
    ],
  },
  {
    id: 'u',
    title: 'Level 03',
    subtitle: 'The letter U',
    start: { x: 4, y: 2 },
    exit: { x: 12, y: 2 },
    cells: cellsFrom([
      ...range(2, 12).map((y) => [4, y]),
      ...range(2, 12).map((y) => [12, y]),
      ...range(4, 12).map((x) => [x, 12]),
    ]),
    hazards: [
      range(4, 12).map((x) => ({ x, y: 12 })),
      range(3, 10).map((y) => ({ x: 12, y })),
    ],
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

function getHazards(level, tick) {
  return level.hazards.map((path, index) => {
    const step = tick + index * 3;
    const cycle = path.length * 2 - 2;
    const position = step % cycle;
    return path[position < path.length ? position : cycle - position];
  });
}

export default function MazeGamePage({ onComplete }) {
  const levels = useMemo(makeLevels, []);
  const [levelIndex, setLevelIndex] = useState(0);
  const [tick, setTick] = useState(0);
  const [player, setPlayer] = useState(levels[0].start);
  const [trail, setTrail] = useState([levels[0].start]);
  const [finishedTrails, setFinishedTrails] = useState({});
  const [notice, setNotice] = useState('用方向键或 WASD 移动，避开亮红色障碍。');
  const [mode, setMode] = useState('playing');

  const level = levels[levelIndex];
  const hazards = useMemo(() => getHazards(level, tick), [level, tick]);
  const hazardKeys = useMemo(() => new Set(hazards.map(keyOf)), [hazards]);

  const resetPlayer = () => {
    setPlayer(level.start);
    setTrail([level.start]);
  };

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
    setTick(0);
    setPlayer(nextLevel.start);
    setTrail([nextLevel.start]);
  };

  const move = (delta) => {
    if (mode !== 'playing') return;

    const next = { x: player.x + delta.x, y: player.y + delta.y };
    const nextKey = keyOf(next);
    if (!level.cells.has(nextKey)) {
      setNotice('这里是黑暗边界，换条路。');
      return;
    }

    if (hazardKeys.has(nextKey)) {
      setNotice('被障碍碰到了，回到这一关起点。');
      resetPlayer();
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
    if (mode !== 'playing') return undefined;
    const timer = window.setInterval(() => setTick((current) => current + 1), 520);
    return () => window.clearInterval(timer);
  }, [mode]);

  useEffect(() => {
    if (mode !== 'playing') return;
    if (hazardKeys.has(keyOf(player))) {
      setNotice('障碍追上来了，回到这一关起点。');
      resetPlayer();
    }
  }, [hazardKeys, mode, player]);

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
            const isHazard = hazardKeys.has(key);

            return (
              <span
                key={key}
                className={[
                  'maze-cell',
                  visible ? 'seen' : 'unseen',
                  isPath ? 'path' : 'wall',
                  isTrail ? 'trail' : '',
                  isExit ? 'exit' : '',
                  isHazard ? 'hazard' : '',
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
