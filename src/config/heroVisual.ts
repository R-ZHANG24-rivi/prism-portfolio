export type Vec2 = readonly [number, number];
export type Vec3 = readonly [number, number, number];

export interface HeroVisualConfig {
  backgroundColor: readonly [number, number, number, number];
  crystalScale: Vec3;
  crystalPosition: Vec3;
  crystalRotation: Vec3;
  glassOpacity: number;
  refractionStrength: number;
  ior: number;
  fresnelStrength: number;
  lightPosition: Vec2;
  lightWidth: number;
  lightIntensity: number;
  dispersionStrength: number;
  rainbowIntensity: number;
  animationSpeed: number;
  mouseInfluence: number;
}

/** Central tuning surface for the hero's composition, glass and motion. */
export const HERO_VISUAL: HeroVisualConfig = {
  backgroundColor: [0.002, 0.003, 0.006, 1],
  crystalScale: [1.35, 1.05, 1.35],
  crystalPosition: [0.82, -0.03, 0],
  crystalRotation: [-0.06, -0.32, -0.08],
  glassOpacity: 0.19,
  refractionStrength: 0.78,
  ior: 1.48,
  fresnelStrength: 1.15,
  // Screen-space light origin; the crystal centre is derived from the scene layout.
  lightPosition: [0.34, 0.515],
  lightWidth: 0.0042,
  lightIntensity: 1.0,
  dispersionStrength: 0.19,
  rainbowIntensity: 0.72,
  animationSpeed: 0.16,
  mouseInfluence: 0.075,
};
