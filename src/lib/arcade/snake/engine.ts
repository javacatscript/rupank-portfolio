import type { Direction, GameConfig, GameState, Point } from "./types";

const DEFAULT_TICK_MS = 140;
const DEFAULT_MIN_TICK_MS = 80;
const DEFAULT_TICK_STEP_MS = 4;
const DEFAULT_SNAKE_LENGTH = 3;
const DEFAULT_DIRECTION: Direction = "right";

const DIRECTION_DELTA: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITE_DIRECTION: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

function pointsEqual(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}

function isOpposite(a: Direction, b: Direction): boolean {
  return OPPOSITE_DIRECTION[a] === b;
}

function pointKey(point: Point): string {
  return `${point.x},${point.y}`;
}

function spawnFood(
  snake: Point[],
  gridWidth: number,
  gridHeight: number,
): Point {
  const occupied = new Set(snake.map(pointKey));
  const freeCells: Point[] = [];

  for (let y = 0; y < gridHeight; y += 1) {
    for (let x = 0; x < gridWidth; x += 1) {
      const cell = { x, y };
      if (!occupied.has(pointKey(cell))) {
        freeCells.push(cell);
      }
    }
  }

  if (freeCells.length === 0) {
    return snake[0] ?? { x: 0, y: 0 };
  }

  const index = Math.floor(Math.random() * freeCells.length);
  return freeCells[index]!;
}

function createInitialSnake(
  gridWidth: number,
  gridHeight: number,
  length: number,
): Point[] {
  const headX = Math.floor(gridWidth / 2);
  const headY = Math.floor(gridHeight / 2);
  const snake: Point[] = [];

  for (let i = 0; i < length; i += 1) {
    snake.push({ x: headX - i, y: headY });
  }

  return snake;
}

export function createInitialState(config: GameConfig): GameState {
  const snakeLength = Math.max(
    1,
    Math.min(
      config.initialSnakeLength ?? DEFAULT_SNAKE_LENGTH,
      config.gridWidth * config.gridHeight,
    ),
  );
  const snake = createInitialSnake(
    config.gridWidth,
    config.gridHeight,
    snakeLength,
  );

  return {
    schemaVersion: 1,
    gridWidth: config.gridWidth,
    gridHeight: config.gridHeight,
    snake,
    direction: DEFAULT_DIRECTION,
    nextDirection: null,
    food: spawnFood(snake, config.gridWidth, config.gridHeight),
    score: 0,
    status: "ready",
    tickMs: config.tickMs ?? DEFAULT_TICK_MS,
  };
}

export function queueDirection(state: GameState, dir: Direction): GameState {
  if (state.status === "gameover") {
    return state;
  }

  const reference = state.nextDirection ?? state.direction;
  if (isOpposite(reference, dir)) {
    return state;
  }

  return {
    ...state,
    nextDirection: dir,
  };
}

export function step(state: GameState, _config: GameConfig): GameState {
  if (state.status === "paused" || state.status === "gameover") {
    return state;
  }

  const direction =
    state.nextDirection && !isOpposite(state.direction, state.nextDirection)
      ? state.nextDirection
      : state.direction;

  const head = state.snake[0];
  if (!head) {
    return { ...state, status: "gameover", nextDirection: null };
  }

  const delta = DIRECTION_DELTA[direction];
  const newHead: Point = {
    x: head.x + delta.x,
    y: head.y + delta.y,
  };

  const hitWall =
    newHead.x < 0 ||
    newHead.x >= state.gridWidth ||
    newHead.y < 0 ||
    newHead.y >= state.gridHeight;

  if (hitWall) {
    return {
      ...state,
      status: "gameover",
      direction,
      nextDirection: null,
    };
  }

  const ateFood = pointsEqual(newHead, state.food);
  const bodyForCollision = ateFood ? state.snake : state.snake.slice(0, -1);
  const hitSelf = bodyForCollision.some((segment) =>
    pointsEqual(segment, newHead),
  );

  if (hitSelf) {
    return {
      ...state,
      status: "gameover",
      direction,
      nextDirection: null,
    };
  }

  const snake = [newHead, ...state.snake];
  if (!ateFood) {
    snake.pop();
  }

  const minTickMs = _config.minTickMs ?? DEFAULT_MIN_TICK_MS;
  const tickStepMs = _config.tickStepMs ?? DEFAULT_TICK_STEP_MS;
  const nextTickMs = ateFood
    ? Math.max(minTickMs, state.tickMs - tickStepMs)
    : state.tickMs;

  return {
    ...state,
    status: "playing",
    snake,
    direction,
    nextDirection: null,
    score: ateFood ? state.score + 1 : state.score,
    tickMs: nextTickMs,
    food: ateFood
      ? spawnFood(snake, state.gridWidth, state.gridHeight)
      : state.food,
  };
}

export function togglePause(state: GameState): GameState {
  if (state.status === "playing") {
    return { ...state, status: "paused" };
  }

  if (state.status === "paused") {
    return { ...state, status: "playing" };
  }

  return state;
}

export function restart(config: GameConfig): GameState {
  return createInitialState(config);
}
