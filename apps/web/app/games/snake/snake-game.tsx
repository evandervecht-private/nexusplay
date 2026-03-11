"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const GRID = 20;
const CELL = 24;
const SIZE = GRID * CELL;
const SPEED_MS = 130;

type Pt = { x: number; y: number };
type Dir = "U" | "D" | "L" | "R";
type Phase = "idle" | "playing" | "paused" | "over";

const OPPOSITE: Record<Dir, Dir> = { U: "D", D: "U", L: "R", R: "L" };

const KEY_MAP: Record<string, Dir | undefined> = {
  ArrowUp: "U", w: "U", W: "U",
  ArrowDown: "D", s: "D", S: "D",
  ArrowLeft: "L", a: "L", A: "L",
  ArrowRight: "R", d: "R", D: "R",
};

const INIT_SNAKE: Pt[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

function randomFood(exclude: Pt[]): Pt {
  let p: Pt;
  do {
    p = {
      x: Math.floor(Math.random() * GRID),
      y: Math.floor(Math.random() * GRID),
    };
  } while (exclude.some((e) => e.x === p.x && e.y === p.y));
  return p;
}

function fresh() {
  const snake = INIT_SNAKE.map((p) => ({ ...p }));
  return { snake, dir: "R" as Dir, food: randomFood(snake) };
}

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
  ctx.fill();
}

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snakeRef = useRef<Pt[]>([]);
  const dirRef = useRef<Dir>("R");
  const nextDirRef = useRef<Dir>("R");
  const foodRef = useRef<Pt>({ x: 15, y: 10 });
  const scoreRef = useRef(0);
  const phaseRef = useRef<Phase>("idle");
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");

  const syncPhase = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = "#08080f";
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Grid dots
    ctx.fillStyle = "#14141f";
    for (let gx = 0; gx < GRID; gx++) {
      for (let gy = 0; gy < GRID; gy++) {
        ctx.fillRect(gx * CELL + CELL / 2 - 0.5, gy * CELL + CELL / 2 - 0.5, 1, 1);
      }
    }

    // Food glow
    const food = foodRef.current;
    const fx = food.x * CELL + CELL / 2;
    const fy = food.y * CELL + CELL / 2;
    const foodGlow = ctx.createRadialGradient(fx, fy, 0, fx, fy, CELL);
    foodGlow.addColorStop(0, "rgba(244, 63, 94, 0.3)");
    foodGlow.addColorStop(1, "transparent");
    ctx.fillStyle = foodGlow;
    ctx.fillRect(fx - CELL, fy - CELL, CELL * 2, CELL * 2);

    // Food
    ctx.fillStyle = "#f43f5e";
    ctx.beginPath();
    ctx.arc(fx, fy, CELL / 2 - 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.beginPath();
    ctx.arc(fx - 2, fy - 2, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Snake
    const snake = snakeRef.current;
    for (let i = snake.length - 1; i >= 0; i--) {
      const seg = snake[i];
      if (!seg) continue;
      const isHead = i === 0;
      const t = snake.length > 1 ? i / (snake.length - 1) : 0;

      if (isHead) {
        // Head glow
        const hx = seg.x * CELL + CELL / 2;
        const hy = seg.y * CELL + CELL / 2;
        const headGlow = ctx.createRadialGradient(hx, hy, 0, hx, hy, CELL * 1.5);
        headGlow.addColorStop(0, "rgba(139, 92, 246, 0.25)");
        headGlow.addColorStop(1, "transparent");
        ctx.fillStyle = headGlow;
        ctx.fillRect(hx - CELL * 1.5, hy - CELL * 1.5, CELL * 3, CELL * 3);
      }

      const lightness = Math.round(52 - t * 22);
      ctx.fillStyle = isHead ? "#8b5cf6" : `hsl(265, 65%, ${lightness}%)`;
      drawRoundRect(
        ctx,
        seg.x * CELL + 2,
        seg.y * CELL + 2,
        CELL - 4,
        CELL - 4,
        isHead ? 6 : 4,
      );

      // Eyes on head
      if (isHead) {
        const dir = dirRef.current;
        const hcx = seg.x * CELL + CELL / 2;
        const hcy = seg.y * CELL + CELL / 2;
        ctx.fillStyle = "white";
        let e1x = hcx, e1y = hcy, e2x = hcx, e2y = hcy;
        if (dir === "R") { e1x += 4; e1y -= 3; e2x += 4; e2y += 3; }
        else if (dir === "L") { e1x -= 4; e1y -= 3; e2x -= 4; e2y += 3; }
        else if (dir === "U") { e1x -= 3; e1y -= 4; e2x += 3; e2y -= 4; }
        else { e1x -= 3; e1y += 4; e2x += 3; e2y += 4; }
        ctx.beginPath();
        ctx.arc(e1x, e1y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(e2x, e2y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, []);

  const stopTick = useCallback(() => {
    if (tickRef.current !== null) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const gameTick = useCallback(() => {
    if (phaseRef.current !== "playing") return;
    dirRef.current = nextDirRef.current;

    const snake = snakeRef.current;
    const head = snake[0];
    if (!head) return;

    const dir = dirRef.current;
    const next: Pt = {
      x: head.x + (dir === "R" ? 1 : dir === "L" ? -1 : 0),
      y: head.y + (dir === "D" ? 1 : dir === "U" ? -1 : 0),
    };

    if (next.x < 0 || next.x >= GRID || next.y < 0 || next.y >= GRID) {
      stopTick();
      setHighScore((h) => Math.max(h, scoreRef.current));
      syncPhase("over");
      draw();
      return;
    }

    if (snake.slice(0, snake.length - 1).some((s) => s.x === next.x && s.y === next.y)) {
      stopTick();
      setHighScore((h) => Math.max(h, scoreRef.current));
      syncPhase("over");
      draw();
      return;
    }

    const food = foodRef.current;
    if (next.x === food.x && next.y === food.y) {
      snakeRef.current = [next, ...snake];
      foodRef.current = randomFood(snakeRef.current);
      scoreRef.current += 10;
      setScore(scoreRef.current);
    } else {
      snakeRef.current = [next, ...snake.slice(0, -1)];
    }

    draw();
  }, [draw, stopTick, syncPhase]);

  const startGame = useCallback(() => {
    stopTick();
    const g = fresh();
    snakeRef.current = g.snake;
    dirRef.current = g.dir;
    nextDirRef.current = g.dir;
    foodRef.current = g.food;
    scoreRef.current = 0;
    setScore(0);
    syncPhase("playing");
    tickRef.current = setInterval(gameTick, SPEED_MS);
    draw();
  }, [gameTick, draw, stopTick, syncPhase]);

  const togglePause = useCallback(() => {
    if (phaseRef.current === "playing") {
      stopTick();
      syncPhase("paused");
    } else if (phaseRef.current === "paused") {
      syncPhase("playing");
      tickRef.current = setInterval(gameTick, SPEED_MS);
    }
  }, [gameTick, stopTick, syncPhase]);

  useEffect(() => {
    draw();
    return () => stopTick();
  }, [draw, stopTick]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        if (phaseRef.current === "idle" || phaseRef.current === "over") {
          startGame();
        } else {
          togglePause();
        }
        return;
      }
      const dir = KEY_MAP[e.key];
      if (dir === undefined) return;
      e.preventDefault();
      const cur = phaseRef.current;
      if (cur === "idle" || cur === "over") {
        startGame();
        return;
      }
      if (cur === "paused") {
        togglePause();
        return;
      }
      if (dir !== OPPOSITE[dirRef.current]) {
        nextDirRef.current = dir;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [startGame, togglePause]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Score bar */}
      <div className="flex w-full max-w-[480px] items-center justify-between rounded-xl border border-white/[0.06] bg-card px-6 py-3">
        <div className="text-center">
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Score
          </p>
          <p className="text-2xl font-black tabular-nums">{score}</p>
        </div>
        <div className="h-8 w-px bg-white/10" />
        <div className="text-center">
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Best
          </p>
          <p className="text-2xl font-black tabular-nums text-primary">{highScore}</p>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] shadow-2xl shadow-primary/10">
        <canvas ref={canvasRef} width={SIZE} height={SIZE} className="block" />

        {phase === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
            <p className="mb-2 text-6xl font-black tracking-tighter text-gradient">SNAKE</p>
            <p className="mb-8 text-sm text-muted-foreground">
              Press Space or any arrow key to start
            </p>
            <Button onClick={startGame} size="lg" className="h-11 px-8 glow-sm">
              Start Game
            </Button>
          </div>
        )}

        {phase === "paused" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
            <p className="mb-2 text-4xl font-black">PAUSED</p>
            <p className="text-sm text-muted-foreground">Press Space to resume</p>
          </div>
        )}

        {phase === "over" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
            <p className="mb-6 text-4xl font-black text-destructive">Game Over</p>

            <div className="mb-8 flex items-center gap-8">
              <div className="text-center">
                <p className="text-4xl font-black tabular-nums">{score}</p>
                <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                  Score
                </p>
              </div>
              <div className="h-12 w-px bg-white/10" />
              <div className="text-center">
                <p className="text-4xl font-black tabular-nums text-primary">{highScore}</p>
                <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                  Best
                </p>
              </div>
            </div>

            <Button onClick={startGame} size="lg" className="h-11 px-8 glow-sm" autoFocus>
              Play Again
            </Button>
          </div>
        )}
      </div>

      {/* Controls */}
      {phase === "playing" && (
        <div className="flex gap-3">
          <Button onClick={togglePause} variant="outline" size="sm">
            Pause
          </Button>
          <Button onClick={startGame} variant="ghost" size="sm">
            Restart
          </Button>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        WASD / Arrow keys to move &middot; Space to pause
      </p>
    </div>
  );
}
