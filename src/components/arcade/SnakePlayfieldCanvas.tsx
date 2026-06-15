"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { normalizeHex } from "@/lib/themeColors";
import type { GameState } from "@/lib/arcade/snake/types";

type SnakePlayfieldCanvasProps = {
  state: GameState;
  className?: string;
};

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const normalized = normalizeHex(hex) ?? "#00ff00";
  const h = normalized.slice(1);
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

export default function SnakePlayfieldCanvas({
  state,
  className = "",
}: SnakePlayfieldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { accent } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const accentHex = normalizeHex(accent) ?? "#00ff00";
    const { r, g, b } = hexToRgb(accentHex);
    const accentRgb = `rgb(${r},${g},${b})`;
    /** Slightly dimmer variant for snake body (head stays full accent). */
    const accentDim = `rgb(${Math.round(r * 0.55)},${Math.round(g * 0.55)},${Math.round(b * 0.55)})`;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cellW = width / state.gridWidth;
    const cellH = height / state.gridHeight;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= state.gridWidth; x += 1) {
      const px = x * cellW;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, height);
      ctx.stroke();
    }
    for (let y = 0; y <= state.gridHeight; y += 1) {
      const py = y * cellH;
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(width, py);
      ctx.stroke();
    }

    state.snake.forEach((segment, index) => {
      const inset = index === 0 ? 0.5 : 1;
      ctx.fillStyle = index === 0 ? accentRgb : accentDim;
      ctx.fillRect(
        segment.x * cellW + inset,
        segment.y * cellH + inset,
        cellW - inset * 2,
        cellH - inset * 2,
      );
    });

    const foodInset = Math.max(2.5, Math.min(cellW, cellH) * 0.22);
    ctx.fillStyle = accentRgb;
    ctx.fillRect(
      state.food.x * cellW + foodInset,
      state.food.y * cellH + foodInset,
      cellW - foodInset * 2,
      cellH - foodInset * 2,
    );
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 1;
    ctx.strokeRect(
      state.food.x * cellW + foodInset,
      state.food.y * cellH + foodInset,
      cellW - foodInset * 2,
      cellH - foodInset * 2,
    );

    if (state.status === "paused") {
      ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = accentRgb;
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("PAUSED", width / 2, height / 2);
    }

    if (state.status === "gameover") {
      ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = accentRgb;
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("GAME OVER", width / 2, height / 2 - 10);
      ctx.font = "11px monospace";
      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      ctx.fillText("PRESS R TO RESTART", width / 2, height / 2 + 14);
    }

    if (state.status === "ready") {
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = accentRgb;
      ctx.font = "bold 12px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("PRESS ANY ARROW TO START", width / 2, height / 2);
    }
  }, [state, accent]);

  return (
    <canvas
      ref={canvasRef}
      className={`block h-full w-full ${className}`}
      aria-hidden
    />
  );
}
