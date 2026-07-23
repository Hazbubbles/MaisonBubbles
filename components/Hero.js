// Feuille de ginkgo décorative en fond, en très faible opacité.
// Illustration recréée à la main (SVG, calculée par trigonométrie) pour
// ressembler à l'image fournie par le client — pas une reproduction pixel
// pour pixel (impossible à extraire d'une image collée dans le chat).
const APEX = [200, 300];
const BASE_RADIUS = 205;
// Deux lobes asymétriques (le droit plus large que le gauche, comme sur la
// photo), avec une encoche entre les deux légèrement décalée à gauche.
const LEFT_LOBE = { center: 233, spread: 42, bulge: 22 };
const RIGHT_LOBE = { center: 308, spread: 46, bulge: 38 };
const NOTCH = { center: 261, spread: 8, depth: 50 };
const ANGLE_START = 188;
const ANGLE_END = 353;
const VEIN_COUNT = 45;
const OUTLINE_POINT_COUNT = 100;

function gaussian(angleDeg, { center, spread, bulge, depth }) {
  const diff = angleDeg - center;
  const amount = bulge !== undefined ? bulge : depth;
  return amount * Math.exp(-(diff * diff) / (2 * spread * spread));
}

function radiusAt(angleDeg) {
  return (
    BASE_RADIUS +
    gaussian(angleDeg, LEFT_LOBE) +
    gaussian(angleDeg, RIGHT_LOBE) -
    gaussian(angleDeg, NOTCH)
  );
}

function pointAt(angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  const r = radiusAt(angleDeg);
  return [APEX[0] + r * Math.cos(rad), APEX[1] + r * Math.sin(rad)];
}

function sampleAngles(count) {
  return Array.from({ length: count }, (_, i) => ANGLE_START + ((ANGLE_END - ANGLE_START) * i) / (count - 1));
}

function GinkgoLeaf({ className }) {
  const veinAngles = sampleAngles(VEIN_COUNT);
  const outlinePoints = sampleAngles(OUTLINE_POINT_COUNT).map(pointAt);
  const outlinePath = outlinePoints.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");

  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      <g transform="rotate(-6 200 300)">
        {/* Tige (double trait, comme sur la photo) */}
        <path d="M193,300 C186,328 180,358 174,394" strokeWidth="1.4" />
        <path d="M204,300 C200,328 197,358 194,394" strokeWidth="1.4" />

        {/* Contour du limbe */}
        <path d={outlinePath} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />

        {/* Nervures rayonnantes, fines et nombreuses */}
        {veinAngles.map((angle) => {
          const [x, y] = pointAt(angle);
          return (
            <line key={angle} x1={APEX[0]} y1={APEX[1]} x2={x} y2={y} strokeWidth="0.5" />
          );
        })}
      </g>
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="relative mx-auto w-full max-w-5xl overflow-hidden px-6 pt-16 pb-24">
      <GinkgoLeaf className="pointer-events-none absolute left-1/2 top-1/2 h-auto w-[640px] max-w-none -translate-x-1/2 -translate-y-1/2 text-brand opacity-[0.13]" />

      <h1 className="relative select-none text-center font-brand text-5xl font-light uppercase leading-[1.05] tracking-wide text-brand sm:text-6xl">
        Des coffrets
        <br />
        faits avec
        <br />
        soin
      </h1>
    </section>
  );
}
