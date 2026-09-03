export const VISUAL = {
  prism: {
    ior: 1.56,
    thickness: 1.45,
    transmission: 1,
    roughness: 0.018,
    chromaticAberration: 0.115,
    distortion: 0.045,
    pointerRotationX: 0.085,
    pointerRotationY: 0.13,
  },
  light: { key: 4.2, rim: 3.1, side: 2.3, fill: 1.15 },
  spectrum: { sliceCount: 18, opacity: 0.72, pointerStrength: 0.16 },
  post: { bloomIntensity: 0.42, luminanceThreshold: 0.74 },
  pointer: { distortionStrength: 0.22, damping: 0.055 },
  preview: { refraction: 0.12, chromaticShift: 0.028, damping: 0.07 },
};
