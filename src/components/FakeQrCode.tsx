// A QR-looking SVG for the demo. It is NOT scannable: the modules are pseudo-random,
// seeded by `seed` so each traveller gets a different but stable pattern.
const SIZE = 25; // modules per side (a version-2 QR code is 25×25)
const FINDER = 7;

// Small deterministic PRNG (mulberry32) so the pattern doesn't change between renders.
function makeRandom(seed: string): () => number {
  let h = 1779033703;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
  return () => {
    h = (h + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Finder squares plus the one-module white border around them.
function isInFinderZone(x: number, y: number): boolean {
  const near = (v: number) => v <= FINDER;
  const far = (v: number) => v >= SIZE - FINDER - 1;
  return (near(x) && near(y)) || (far(x) && near(y)) || (near(x) && far(y));
}

// Version-2 codes have one alignment pattern centred at (18, 18).
const ALIGN = 18;
function isInAlignZone(x: number, y: number): boolean {
  return Math.abs(x - ALIGN) <= 2 && Math.abs(y - ALIGN) <= 2;
}

function isTimingPattern(x: number, y: number): boolean {
  return (x === 6 || y === 6) && !isInFinderZone(x, y);
}

function dataModules(seed: string): [number, number][] {
  const random = makeRandom(seed);
  const cells: [number, number][] = [];
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (isInFinderZone(x, y) || isInAlignZone(x, y)) continue;
      const isDark = isTimingPattern(x, y) ? (x + y) % 2 === 0 : random() < 0.5;
      if (isDark) cells.push([x, y]);
    }
  }
  return cells;
}

function Finder({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={7} height={7} fill="currentColor" />
      <rect x={1} y={1} width={5} height={5} fill="#fff" />
      <rect x={2} y={2} width={3} height={3} fill="currentColor" />
    </g>
  );
}

interface Props {
  seed: string;
  size?: number; // rendered size in px
  className?: string;
}

export function FakeQrCode({ seed, size = 64, className }: Props) {
  const quiet = 2; // white margin in modules
  const view = SIZE + quiet * 2;
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox={`${-quiet} ${-quiet} ${view} ${view}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label="eSIM QR Code（示意，無法掃描）"
    >
      <rect x={-quiet} y={-quiet} width={view} height={view} fill="#fff" />
      {dataModules(seed).map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="currentColor" />
      ))}
      <Finder x={0} y={0} />
      <Finder x={SIZE - FINDER} y={0} />
      <Finder x={0} y={SIZE - FINDER} />
      <rect x={ALIGN - 2} y={ALIGN - 2} width={5} height={5} fill="currentColor" />
      <rect x={ALIGN - 1} y={ALIGN - 1} width={3} height={3} fill="#fff" />
      <rect x={ALIGN} y={ALIGN} width={1} height={1} fill="currentColor" />
    </svg>
  );
}
