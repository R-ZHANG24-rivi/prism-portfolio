struct OpticalParams {
  resolution: vec2f,
  crystalCenter: vec2f,
  lightPosition: vec2f,
  pointer: vec2f,
  time: f32,
  lightWidth: f32,
  lightIntensity: f32,
  dispersionStrength: f32,
  rainbowIntensity: f32,
}

@group(0) @binding(0) var<uniform> params: OpticalParams;

fn segmentDistance(point: vec2f, start: vec2f, end: vec2f) -> f32 {
  let line = end - start;
  let t = clamp(dot(point - start, line) / dot(line, line), 0.0, 1.0);
  return length(point - (start + line * t));
}

fn spectralRamp(t: f32) -> vec3f {
  let r = smoothstep(0.38, 0.04, abs(t - 0.16));
  let g = smoothstep(0.34, 0.035, abs(t - 0.50));
  let b = smoothstep(0.38, 0.04, abs(t - 0.82));
  return vec3f(r, g, b);
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let aspect = params.resolution.x / max(params.resolution.y, 1.0);
  var p = uv;
  p.x *= aspect;
  let crystal = vec2f(params.crystalCenter.x * aspect, params.crystalCenter.y);
  let origin = vec2f(params.lightPosition.x * aspect, params.lightPosition.y);
  let mouseBend = params.pointer.y * 0.012;

  // A single quiet incident beam, ending precisely inside the glass volume.
  let entryEnd = crystal + vec2f(-0.018 * aspect, mouseBend);
  let incidentDistance = segmentDistance(p, origin, entryEnd);
  let incidentGate = smoothstep(origin.x - 0.05, origin.x + 0.015, p.x) *
                     (1.0 - smoothstep(entryEnd.x - 0.01, entryEnd.x + 0.018, p.x));
  let beamCore = exp(-incidentDistance * incidentDistance / max(params.lightWidth * params.lightWidth, 0.000001));
  let beamHalo = exp(-incidentDistance * 92.0) * 0.16;

  var color = vec3f(0.0018, 0.0024, 0.0042);
  color += vec3f(0.94, 0.97, 1.0) * (beamCore + beamHalo) * incidentGate * params.lightIntensity;

  // Closely spaced wavelengths merge into a soft, controlled spectral band.
  for (var index: i32 = 0; index < 9; index += 1) {
    let wave = f32(index) / 8.0;
    let spread = (wave - 0.5) * params.dispersionStrength;
    let direction = normalize(vec2f(0.72 * aspect, -0.10 + spread + mouseBend));
    let end = crystal + direction * 1.15;
    let distance = segmentDistance(p, crystal + direction * 0.025, end);
    let rayGate = smoothstep(crystal.x - 0.005, crystal.x + 0.025, p.x);
    let rayCore = exp(-distance * distance / 0.000035);
    let rayGlow = exp(-distance * 30.0) * 0.075;
    color += spectralRamp(wave) * (rayCore * 0.24 + rayGlow) * rayGate * params.rainbowIntensity;
  }

  // A barely visible pool of light anchors the sculpture without adding decoration.
  let floorP = vec2f((uv.x - params.crystalCenter.x) * aspect, (uv.y - 0.79) * 3.8);
  let floorGlow = exp(-dot(floorP, floorP) * 4.8) * 0.032;
  color += vec3f(0.34, 0.48, 0.64) * floorGlow;

  return vec4f(color, 1.0);
}
