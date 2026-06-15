export type Direction = "up" | "down" | "left" | "right";

export type Point = {
  x: number;
  y: number;
};

export type GameStatus = "ready" | "playing" | "paused" | "gameover";

export type GameConfig = {
  gridWidth: number;
  gridHeight: number;
  tickMs?: number;
  minTickMs?: number;
  tickStepMs?: number;
  initialSnakeLength?: number;
};

export type GameState = {
  schemaVersion: 1;
  gridWidth: number;
  gridHeight: number;
  snake: Point[];
  direction: Direction;
  nextDirection: Direction | null;
  food: Point;
  score: number;
  status: GameStatus;
  tickMs: number;
};
