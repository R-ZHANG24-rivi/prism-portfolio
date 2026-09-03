struct Camera {
  viewProjection: mat4x4f,
  position: vec3f,
}

struct Model {
  matrix: mat4x4f,
}

struct Glass {
  pointer: vec2f,
  time: f32,
  opacity: f32,
  refractionStrength: f32,
  ior: f32,
  fresnelStrength: f32,
  rainbowIntensity: f32,
}

@group(0) @binding(0) var<uniform> camera: Camera;
@group(0) @binding(1) var<uniform> model: Model;
@group(0) @binding(2) var<uniform> glass: Glass;

struct VertexOut {
  @builtin(position) position: vec4f,
  @location(0) worldPosition: vec3f,
  @location(1) worldNormal: vec3f,
  @location(2) objectPosition: vec3f,
}

@vertex fn vs_main(
  @location(0) position: vec3f,
  @location(1) normal: vec3f,
) -> VertexOut {
  var out: VertexOut;
  let world = model.matrix * vec4f(position, 1.0);
  out.position = camera.viewProjection * world;
  out.worldPosition = world.xyz;
  out.worldNormal = normalize((model.matrix * vec4f(normal, 0.0)).xyz);
  out.objectPosition = position;
  return out;
}

@fragment fn fs_main(
  @location(0) worldPosition: vec3f,
  @location(1) worldNormal: vec3f,
  @location(2) objectPosition: vec3f,
  @builtin(front_facing) frontFacing: bool,
) -> @location(0) vec4f {
  var normal = normalize(worldNormal);
  if (!frontFacing) { normal = -normal; }

  let viewDirection = normalize(camera.position - worldPosition);
  let ndv = clamp(abs(dot(normal, viewDirection)), 0.0, 1.0);
  let fresnel = pow(1.0 - ndv, 2.35) * glass.fresnelStrength;
  let refractionRatio = 1.0 / max(glass.ior, 1.01);
  let refracted = refract(-viewDirection, normal, refractionRatio);

  let key = pow(max(dot(normal, normalize(vec3f(-0.5, 0.82, 0.62))), 0.0), 22.0);
  let rim = pow(max(dot(normal, normalize(vec3f(0.74, 0.20, 0.64))), 0.0), 10.0);
  let vertical = smoothstep(-1.35, 1.45, objectPosition.y);
  let interior = pow(1.0 - ndv, 0.65) * (0.42 + vertical * 0.22);

  // Restrained chromatic separation appears chiefly at the beam crossing and silhouette.
  let beamSlice = exp(-pow((objectPosition.y + refracted.y * glass.refractionStrength * 0.26) / 0.115, 2.0));
  let chromaPhase = clamp(refracted.x * 0.5 + 0.5 + objectPosition.y * 0.12, 0.0, 1.0);
  let red = smoothstep(0.68, 0.18, abs(chromaPhase - 0.18));
  let green = smoothstep(0.56, 0.16, abs(chromaPhase - 0.52));
  let blue = smoothstep(0.62, 0.16, abs(chromaPhase - 0.84));
  let spectrum = vec3f(red, green, blue) * beamSlice * glass.rainbowIntensity;

  let volume = vec3f(0.044, 0.061, 0.076) * (0.42 + interior * 1.45);
  let coolGlass = vec3f(0.46, 0.62, 0.76) * interior * 0.34;
  let edgeLight = vec3f(0.78, 0.91, 1.0) * fresnel * 1.48;
  let highlights = vec3f(0.92, 0.98, 1.0) * key * 1.8 + vec3f(0.45, 0.62, 0.95) * rim * 0.52;
  let faceFactor = select(0.58, 1.0, frontFacing);
  let color = (volume + coolGlass + edgeLight + highlights + spectrum * 0.34) * faceFactor;
  let alpha = clamp(glass.opacity * (0.58 + interior) + fresnel * 0.42 + key * 0.28, 0.06, 0.66) * faceFactor;

  return vec4f(color, alpha);
}
