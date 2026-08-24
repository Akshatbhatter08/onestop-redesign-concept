/**
 * Film grain. One fixed, static layer over everything — never animated, so the
 * compositor rasterises it once and forgets about it. Kills the flat "CSS
 * gradient" look that makes warm palettes read as cheap.
 */
export function Grain() {
  return <div className="grain-overlay" aria-hidden />
}
