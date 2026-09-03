@group(0) @binding(0) var scene: texture_2d<f32>;
@group(0) @binding(1) var sceneSampler: sampler;
@group(0) @binding(2) var glassLayer: texture_2d<f32>;

struct PresentParams {
  texel: vec2f,
  bloomStrength: f32,
  vignetteStrength: f32,
}

@group(0) @binding(3) var<uniform> params: PresentParams;

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let base = textureSampleLevel(scene, sceneSampler, uv, 0.0).rgb;
  let glass = textureSampleLevel(glassLayer, sceneSampler, uv, 0.0);
  let px = params.texel * 4.0;
  var blur = vec3f(0.0);
  blur += textureSampleLevel(scene, sceneSampler, uv + vec2f(px.x, 0.0), 0.0).rgb;
  blur += textureSampleLevel(scene, sceneSampler, uv - vec2f(px.x, 0.0), 0.0).rgb;
  blur += textureSampleLevel(scene, sceneSampler, uv + vec2f(0.0, px.y), 0.0).rgb;
  blur += textureSampleLevel(scene, sceneSampler, uv - vec2f(0.0, px.y), 0.0).rgb;
  blur *= 0.25;
  let bloom = max(blur - vec3f(0.12), vec3f(0.0)) * params.bloomStrength;

  let centred = uv * 2.0 - 1.0;
  let vignette = 1.0 - smoothstep(0.52, 1.35, dot(centred, centred)) * params.vignetteStrength;
  let composited = base * (1.0 - glass.a) + glass.rgb;
  let color = (composited + bloom) * vignette;
  return vec4f(color, 1.0);
}
