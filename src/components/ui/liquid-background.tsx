import React, { useEffect, useRef } from "react";

interface LiquidBackgroundProps {
  className?: string;
  color1?: string;
  color2?: string;
  color3?: string;
  speed?: number;
  variant?: "default" | "mesh" | "waves";
}

export function LiquidBackground({
  className = "",
  color1 = "#4f46e5",
  color2 = "#3b82f6",
  color3 = "#8b5cf6",
  speed = 0.01,
  variant = "default",
}: LiquidBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createGradient = (x: number, y: number, radius: number) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, color1 + "80"); // 50% opacity
      gradient.addColorStop(0.5, color2 + "40"); // 25% opacity
      gradient.addColorStop(1, color3 + "00"); // 0% opacity
      return gradient;
    };

    const drawDefault = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.fillStyle = "transparent";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // First blob
      const x1 = canvas.width * (0.3 + 0.1 * Math.sin(time * 0.7));
      const y1 = canvas.height * (0.3 + 0.1 * Math.cos(time * 0.5));
      const radius1 = Math.min(canvas.width, canvas.height) * 0.4;

      ctx.fillStyle = createGradient(x1, y1, radius1);
      ctx.beginPath();
      ctx.arc(x1, y1, radius1, 0, Math.PI * 2);
      ctx.fill();

      // Second blob
      const x2 = canvas.width * (0.7 + 0.1 * Math.cos(time * 0.6));
      const y2 = canvas.height * (0.7 + 0.1 * Math.sin(time * 0.4));
      const radius2 = Math.min(canvas.width, canvas.height) * 0.3;

      ctx.fillStyle = createGradient(x2, y2, radius2);
      ctx.beginPath();
      ctx.arc(x2, y2, radius2, 0, Math.PI * 2);
      ctx.fill();

      // Third blob
      const x3 = canvas.width * (0.5 + 0.1 * Math.sin(time * 0.5));
      const y3 = canvas.height * (0.5 + 0.1 * Math.cos(time * 0.6));
      const radius3 = Math.min(canvas.width, canvas.height) * 0.35;

      ctx.fillStyle = createGradient(x3, y3, radius3);
      ctx.beginPath();
      ctx.arc(x3, y3, radius3, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawMesh = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create gradient background
      const bgGradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height,
      );
      bgGradient.addColorStop(0, color1 + "10");
      bgGradient.addColorStop(1, color2 + "10");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw mesh grid
      const gridSize = 30;
      const amplitude = 5;

      ctx.strokeStyle = color3 + "30";
      ctx.lineWidth = 1;

      // Horizontal lines
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 5) {
          const distFromCenter = Math.sqrt(
            Math.pow(x - canvas.width / 2, 2) +
              Math.pow(y - canvas.height / 2, 2),
          );
          const offsetY = Math.sin(distFromCenter * 0.01 + time) * amplitude;

          if (x === 0) {
            ctx.moveTo(x, y + offsetY);
          } else {
            ctx.lineTo(x, y + offsetY);
          }
        }
        ctx.stroke();
      }

      // Vertical lines
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        for (let y = 0; y < canvas.height; y += 5) {
          const distFromCenter = Math.sqrt(
            Math.pow(x - canvas.width / 2, 2) +
              Math.pow(y - canvas.height / 2, 2),
          );
          const offsetX = Math.sin(distFromCenter * 0.01 + time) * amplitude;

          if (y === 0) {
            ctx.moveTo(x + offsetX, y);
          } else {
            ctx.lineTo(x + offsetX, y);
          }
        }
        ctx.stroke();
      }

      // Add floating particles
      const particles = 50;
      for (let i = 0; i < particles; i++) {
        const x = canvas.width * (0.1 + 0.8 * Math.sin(time * 0.1 + i));
        const y = canvas.height * (0.1 + 0.8 * Math.cos(time * 0.1 + i * 0.7));
        const size = 1 + Math.sin(time + i) * 1;

        ctx.fillStyle = i % 2 === 0 ? color1 + "60" : color2 + "60";
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawWaves = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, color1 + "10");
      bgGradient.addColorStop(1, color2 + "10");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw multiple wave layers
      const waveCount = 5;
      const baseY = canvas.height * 0.5;

      for (let w = 0; w < waveCount; w++) {
        const waveOpacity = 0.1 - w * 0.015;
        const waveColor = w % 2 === 0 ? color1 : color2;

        ctx.fillStyle =
          waveColor +
          Math.floor(waveOpacity * 255)
            .toString(16)
            .padStart(2, "0");
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        const amplitude = 50 - w * 5;
        const frequency = 0.01;
        const speed = time * (0.5 - w * 0.05);

        for (let x = 0; x <= canvas.width; x += 5) {
          const y =
            baseY +
            Math.sin(x * frequency + speed) * amplitude +
            Math.sin(x * frequency * 2 + speed * 1.5) * (amplitude * 0.5) +
            w * 30;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fill();
      }

      // Add floating particles
      const particles = 30;
      for (let i = 0; i < particles; i++) {
        const x = (canvas.width * i) / particles + Math.sin(time + i) * 50;
        const y = baseY - 100 + Math.cos(time * 0.5 + i) * 50;
        const size = 1 + Math.sin(time + i) * 1;

        ctx.fillStyle = i % 2 === 0 ? color1 + "80" : color3 + "80";
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const draw = () => {
      switch (variant) {
        case "mesh":
          drawMesh();
          break;
        case "waves":
          drawWaves();
          break;
        default:
          drawDefault();
      }

      time += speed;
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color1, color2, color3, speed, variant]);

  return (
    <canvas ref={canvasRef} className={`fixed inset-0 -z-10 ${className}`} />
  );
}
