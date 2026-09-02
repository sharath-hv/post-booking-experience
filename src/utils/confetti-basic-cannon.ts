import canvasConfetti from "canvas-confetti";

type Cannon = ReturnType<typeof canvasConfetti.create>;
type CannonOptions = NonNullable<Parameters<Cannon>[0]>;

function resolveConfetti() {
  if (typeof canvasConfetti === "function") return canvasConfetti;
  const nested = canvasConfetti as unknown as { default?: typeof canvasConfetti };
  return nested.default;
}

/** Bind to a viewport canvas we control — no worker (fails under Next/Turbopack). */
export function createCannon(canvas: HTMLCanvasElement): Cannon | null {
  const api = resolveConfetti();
  if (api == null) return null;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  return api.create(canvas, { resize: true, useWorker: false });
}

/** Official “realistic look” mix — several overlapping bursts so it reads on a light page. */
export function fireBasicCannon(fire: Cannon) {
  const count = 220;
  const origin = { y: 0.62 };

  const burst = (particleRatio: number, opts: CannonOptions) => {
    fire({
      origin,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  };

  burst(0.25, { spread: 26, startVelocity: 55 });
  burst(0.2, { spread: 60 });
  burst(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  burst(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  burst(0.1, { spread: 120, startVelocity: 45 });
  fire({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0, y: 0.7 } });
  fire({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1, y: 0.7 } });
}
