import { useEffect, useMemo, useState } from 'react';

const size = 17;
const keyOf = ({ x, y }) => `${x},${y}`;
const range = (from, to) => Array.from({ length: to - from + 1 }, (_, index) => from + index);
const cellsFrom = (cells) => new Set(cells.map(([x, y]) => `${x},${y}`));
const points = (coords) => coords.map(([x, y]) => ({ x, y }));
const line = (from, to) => {
  const horizontal = Array.from({ length: Math.abs(to.x - from.x) + 1 }, (_, index) => ({
    x: from.x + Math.sign(to.x - from.x) * index,
    y: from.y,
  }));
  const corner = horizontal[horizontal.length - 1];
  const vertical = Array.from({ length: Math.abs(to.y - from.y) }, (_, index) => ({
    x: corner.x,
    y: corner.y + Math.sign(to.y - from.y) * (index + 1),
  }));
  return [...horizontal, ...vertical];
};
const pathFromPoints = (coords) => {
  const anchors = points(coords);
  return anchors.flatMap((anchor, index) => {
    if (index === anchors.length - 1) return [];
    const segment = line(anchor, anchors[index + 1]);
    return index === 0 ? segment : segment.slice(1);
  });
};
const obstacleSet = (route, extras) => {
  const routeKeys = new Set(route.map(keyOf));
  return cellsFrom(extras.filter(([x, y]) => !routeKeys.has(`${x},${y}`)));
};
const cyberCopy = {
  chorus: 'BUAA CHORUS',
  dx: '邓欣帮弄',
  szdk: 'SZDK游戏代通关',
  phone: '咨询电话18612258636',
  yolo: 'YOLO',
  rent: '工位招租',
  token: 'token续租',
  drone: 'DRONE',
  score: '♪ 乐谱同步',
  laptop: 'LAPTOP',
  chatgpt: 'Chat GPT',
};

const iRoute = pathFromPoints([
  [4, 2],
  [12, 2],
  [8, 2],
  [8, 14],
  [4, 14],
  [12, 14],
]);

const heartRoute = pathFromPoints([
  [5, 3],
  [4, 3],
  [3, 4],
  [3, 5],
  [4, 5],
  [3, 5],
  [4, 6],
  [5, 6],
  [5, 7],
  [6, 7],
  [6, 8],
  [7, 8],
  [7, 9],
  [8, 9],
  [8, 10],
  [9, 10],
  [9, 9],
  [10, 9],
  [10, 8],
  [11, 8],
  [11, 7],
  [12, 7],
  [12, 6],
  [13, 6],
  [13, 5],
  [13, 4],
  [12, 4],
  [12, 3],
  [11, 3],
  [11, 4],
  [10, 4],
  [10, 5],
  [9, 5],
  [9, 6],
  [8, 6],
  [7, 5],
  [6, 5],
  [6, 4],
  [5, 4],
  [5, 3],
]);

const uRoute = pathFromPoints([
  [4, 2],
  [4, 12],
  [12, 12],
  [12, 2],
]);

const makeLevels = () => [
  {
    id: 'i',
    title: 'Level 01',
    subtitle: 'The letter I',
    route: iRoute,
    start: iRoute[0],
    exit: iRoute[iRoute.length - 1],
    cells: cellsFrom(iRoute.map(({ x, y }) => [x, y])),
    obstacles: obstacleSet(iRoute, [
      [6, 3],
      [7, 3],
      [9, 3],
      [10, 3],
      [6, 5],
      [10, 5],
      [7, 6],
      [9, 6],
      [6, 8],
      [10, 8],
      [7, 10],
      [9, 9],
      [9, 11],
      [6, 12],
      [10, 12],
      [6, 13],
      [7, 13],
      [9, 13],
      [10, 13],
    ]),
    signs: [
      { x: 6, y: 3, w: 2, text: cyberCopy.chorus, tone: 0 },
      { x: 9, y: 3, w: 2, text: cyberCopy.dx, tone: 1 },
      { x: 6, y: 8, w: 5, text: cyberCopy.szdk, tone: 2 },
      { x: 6, y: 12, w: 5, text: cyberCopy.phone, tone: 3 },
      { x: 7, y: 10, w: 3, text: cyberCopy.drone, tone: 4 },
    ],
  },
  {
    id: 'heart',
    title: 'Level 02',
    subtitle: 'The soft middle',
    route: heartRoute,
    start: heartRoute[0],
    exit: heartRoute[heartRoute.length - 1],
    cells: cellsFrom(heartRoute.map(({ x, y }) => [x, y])),
    obstacles: obstacleSet(heartRoute, [
      [5, 2],
      [6, 3],
      [7, 4],
      [8, 4],
      [9, 4],
      [10, 4],
      [4, 5],
      [5, 5],
      [6, 5],
      [8, 5],
      [10, 5],
      [11, 5],
      [12, 5],
      [6, 6],
      [7, 6],
      [9, 6],
      [10, 6],
      [5, 8],
      [11, 8],
      [6, 9],
      [10, 9],
      [8, 8],
    ]),
    signs: [
      { x: 7, y: 4, w: 4, text: cyberCopy.yolo, tone: 2 },
      { x: 4, y: 5, w: 3, text: cyberCopy.score, tone: 4 },
      { x: 10, y: 5, w: 3, text: cyberCopy.rent, tone: 0 },
      { x: 6, y: 6, w: 5, text: cyberCopy.chatgpt, tone: 3 },
      { x: 6, y: 9, w: 5, text: cyberCopy.dx, tone: 1 },
    ],
  },
  {
    id: 'u',
    title: 'Level 03',
    subtitle: 'The letter U',
    route: uRoute,
    start: uRoute[0],
    exit: uRoute[uRoute.length - 1],
    cells: cellsFrom(uRoute.map(({ x, y }) => [x, y])),
    obstacles: obstacleSet(uRoute, [
      [3, 3],
      [5, 3],
      [4, 4],
      [3, 5],
      [5, 6],
      [3, 7],
      [5, 8],
      [5, 10],
      [4, 11],
      [6, 11],
      [7, 11],
      [8, 10],
      [9, 10],
      [10, 11],
      [11, 11],
      [12, 8],
      [11, 7],
      [13, 6],
      [11, 5],
      [13, 4],
    ]),
    signs: [
      { x: 3, y: 3, w: 3, text: cyberCopy.laptop, tone: 1 },
      { x: 3, y: 7, w: 3, text: cyberCopy.token, tone: 3 },
      { x: 5, y: 10, w: 6, text: cyberCopy.phone, tone: 0 },
      { x: 10, y: 11, w: 4, text: cyberCopy.szdk, tone: 2 },
      { x: 11, y: 5, w: 3, text: cyberCopy.drone, tone: 4 },
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

export default function MazeGamePage({ onComplete }) {
  const levels = useMemo(makeLevels, []);
  const [levelIndex, setLevelIndex] = useState(0);
  const [routeIndex, setRouteIndex] = useState(0);
  const [player, setPlayer] = useState(levels[0].start);
  const [trail, setTrail] = useState([levels[0].start]);
  const [finishedTrails, setFinishedTrails] = useState({});
  const [notice, setNotice] = useState('用方向键或 WASD 移动，绕开地形里的挡板。');
  const [mode, setMode] = useState('playing');

  const level = levels[levelIndex];
  const obstacleKeys = level.obstacles;
  const obstacleList = useMemo(() => [...obstacleKeys], [obstacleKeys]);

  const finishLevel = () => {
    const nextTrails = { ...finishedTrails, [level.id]: level.route };
    setFinishedTrails(nextTrails);

    if (levelIndex === levels.length - 1) {
      setMode('reveal');
      setNotice('完成。把三段轨迹拼起来看看。');
      return;
    }

    setNotice('很好，下一关。');
    const nextLevel = levels[levelIndex + 1];
    setLevelIndex((current) => current + 1);
    setRouteIndex(0);
    setPlayer(nextLevel.start);
    setTrail([nextLevel.start]);
  };

  const move = (delta) => {
    if (mode !== 'playing') return;

    const next = { x: player.x + delta.x, y: player.y + delta.y };
    const nextKey = keyOf(next);
    const nextRouteCell = level.route[routeIndex + 1];
    const previousRouteCell = level.route[routeIndex - 1];
    const isNextStep = nextRouteCell && nextRouteCell.x === next.x && nextRouteCell.y === next.y;
    const isBackStep = previousRouteCell && previousRouteCell.x === next.x && previousRouteCell.y === next.y;

    if (obstacleKeys.has(nextKey)) {
      setNotice('赛博挡板在闪，换个方向。');
      return;
    }

    if (!isNextStep && !isBackStep) {
      setNotice('这不是正确路线，沿着唯一通道继续找出口。');
      return;
    }

    const nextIndex = isNextStep ? routeIndex + 1 : routeIndex - 1;
    const nextTrail = [...trail, next];
    setRouteIndex(nextIndex);
    setPlayer(next);
    setTrail(nextTrail);
    setNotice('继续走，出口在发光。');

    if (nextIndex === level.route.length - 1) {
      finishLevel();
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
            const obstacleIndex = obstacleList.indexOf(key);

            return (
              <span
                key={key}
                className={[
                  'maze-cell',
                  visible ? 'seen' : 'unseen',
                  isPath ? 'path' : 'wall',
                  isObstacle ? 'obstacle' : '',
                  isObstacle ? `cyber-tone-${obstacleIndex % 5}` : '',
                  isTrail ? 'trail' : '',
                  isExit ? 'exit' : '',
                  isPlayer ? 'player' : '',
                ].join(' ')}
              />
            );
          })}
          {level.signs.map((sign) => {
            const visible = Math.hypot(player.x - (sign.x + sign.w / 2), player.y - sign.y) <= 5.15;
            return (
              <span
                key={`${sign.text}-${sign.x}-${sign.y}`}
                className={`maze-obstacle-sign cyber-tone-${sign.tone} ${visible ? 'seen' : 'unseen'}`}
                style={{
                  gridColumn: `${sign.x + 1} / span ${sign.w}`,
                  gridRow: `${sign.y + 1} / span 1`,
                }}
              >
                {sign.text}
              </span>
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
