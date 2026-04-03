"use client";

import { useEffect, useRef } from "react";
import { Prize } from "@/lib/constants";
import { SEGMENT_ANGLE, CENTER_X, CENTER_Y, RADIUS } from "@/lib/constants";

interface SpinWheelCanvasProps {
  prizes: Prize[];
  rotation: number;
  size: number;
}

export function SpinWheelCanvas({ prizes, rotation, size }: SpinWheelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw each segment
    prizes.forEach((prize, index) => {
      const startAngle = (index * SEGMENT_ANGLE + rotation) * Math.PI / 180;
      const endAngle = ((index + 1) * SEGMENT_ANGLE + rotation) * Math.PI / 180;

      // Draw segment
      ctx.beginPath();
      ctx.moveTo(CENTER_X, CENTER_Y);
      ctx.arc(CENTER_X, CENTER_Y, RADIUS, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = prize.color;
      ctx.fill();

      // Draw segment border
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw prize text
      ctx.save();
      ctx.translate(CENTER_X, CENTER_Y);
      ctx.rotate(startAngle + (SEGMENT_ANGLE * Math.PI / 180) / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = prize.textColor;
      ctx.font = "bold 16px Geist Sans, sans-serif";
      ctx.fillText(prize.label, RADIUS - 20, 5);
      ctx.restore();
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, 30, 0, 2 * Math.PI);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.strokeStyle = "#E5E7EB";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw center text
    ctx.fillStyle = "#1F2937";
    ctx.font = "bold 14px Geist Sans, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("DHANA", CENTER_X, CENTER_Y - 8);
    ctx.fillText("DHAN", CENTER_X, CENTER_Y + 8);
  }, [prizes, rotation]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="max-w-full h-auto"
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
}
