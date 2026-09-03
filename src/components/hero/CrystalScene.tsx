import { useEffect, useRef, useState } from 'react';
import {
  clock,
  draw,
  effect,
  frameLoop,
  geometry,
  init,
  sampler,
  surface,
  target,
  type FrameLoopHandle,
  type Gpu,
  type Target,
} from 'vgpu';
import { perspectiveCamera } from 'vgpu/scene';
import { HERO_VISUAL, type Vec3 } from '../../config/heroVisual';
import crystalShader from '../../shaders/crystal.wgsl';
import opticalFieldShader from '../../shaders/opticalField.wgsl';
import presentShader from '../../shaders/present.wgsl';

type SceneState = 'loading' | 'ready' | 'fallback';

type Point3 = readonly [number, number, number];

/** The original elongated, faceted diamond rebuilt as a vgpu vertex stream. */
function crystalVertexData(): Float32Array<ArrayBuffer> {
  const vertices: number[] = [];
  const segments = 8;
  const top: Point3 = [0, 1.82, 0];
  const bottom: Point3 = [0, -1.82, 0];
  const upper: Point3[] = [];
  const lower: Point3[] = [];

  for (let index = 0; index < segments; index += 1) {
    const angle = index / segments * Math.PI * 2;
    upper.push([Math.cos(angle) * 0.72, 0.34, Math.sin(angle) * 0.42]);
    lower.push([Math.cos(angle + 0.16) * 0.72, -0.34, Math.sin(angle + 0.16) * 0.42]);
  }

  const face = (p0: Point3, p1: Point3, p2: Point3) => {
    const ax = p1[0] - p0[0]; const ay = p1[1] - p0[1]; const az = p1[2] - p0[2];
    const bx = p2[0] - p0[0]; const by = p2[1] - p0[1]; const bz = p2[2] - p0[2];
    const nx = ay * bz - az * by;
    const ny = az * bx - ax * bz;
    const nz = ax * by - ay * bx;
    const length = Math.hypot(nx, ny, nz) || 1;
    const normal: Point3 = [nx / length, ny / length, nz / length];
    [p0, p1, p2].forEach((point) => vertices.push(...point, ...normal));
  };

  for (let index = 0; index < segments; index += 1) {
    const next = (index + 1) % segments;
    face(top, upper[next], upper[index]);
    face(upper[index], upper[next], lower[index]);
    face(upper[next], lower[next], lower[index]);
    face(bottom, lower[index], lower[next]);
  }

  return new Float32Array(vertices);
}

function modelMatrix(position: Vec3, rotation: Vec3, scale: Vec3): Float32Array {
  const [x, y, z] = rotation;
  const a = Math.cos(x); const b = Math.sin(x);
  const c = Math.cos(y); const d = Math.sin(y);
  const e = Math.cos(z); const f = Math.sin(z);
  const ae = a * e; const af = a * f;
  const be = b * e; const bf = b * f;

  return new Float32Array([
    c * e * scale[0], (af + be * d) * scale[0], (bf - ae * d) * scale[0], 0,
    -c * f * scale[1], (ae - bf * d) * scale[1], (be + af * d) * scale[1], 0,
    d * scale[2], -b * c * scale[2], a * c * scale[2], 0,
    position[0], position[1], position[2], 1,
  ]);
}

export default function CrystalScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0, easedX: 0, easedY: 0 });
  const [sceneState, setSceneState] = useState<SceneState>('loading');

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return undefined;

    let disposed = false;
    let gpu: Gpu | undefined;
    let loop: FrameLoopHandle | undefined;
    let sceneTarget: Target | undefined;
    let glassTarget: Target | undefined;
    let visible = true;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onPointerMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
    }, { rootMargin: '15% 0px' });
    observer.observe(host);

    void (async () => {
      try {
        if (!navigator.gpu) throw new Error('WebGPU is not available in this browser.');
        gpu = await init({ powerPreference: 'high-performance', label: 'portfolio-crystal' });
        if (disposed) {
          gpu.dispose();
          return;
        }

        gpu.onError((error) => console.error('[CrystalScene]', error));
        const canvasSurface = surface(gpu, canvas, {
          dpr: [1, 1.6],
          alphaMode: 'opaque',
          clearColor: HERO_VISUAL.backgroundColor,
          label: 'portfolio-canvas',
        });

        const initialSize = canvasSurface.size;
        sceneTarget = target(gpu, {
          size: initialSize,
          format: 'rgba8unorm',
          clearColor: HERO_VISUAL.backgroundColor,
          label: 'optical-field-target',
        });
        glassTarget = target(gpu, {
          size: initialSize,
          format: 'rgba8unorm',
          depth: true,
          clearColor: [0, 0, 0, 0],
          label: 'glass-crystal-target',
        });

        const cameraPosition: Vec3 = [0, 0.08, 7.2];
        const camera = perspectiveCamera({
          fov: 35,
          aspect: initialSize[0] / initialSize[1],
          near: 0.1,
          far: 50,
          position: cameraPosition,
          target: [0, -0.02, 0],
        });

        const crystalGeometry = geometry(gpu, {
          topology: 'triangle-list',
          buffers: [{
            data: crystalVertexData(),
            stride: 24,
            attributes: {
              position: { format: 'float32x3', location: 0, offset: 0 },
              normal: { format: 'float32x3', location: 1, offset: 12 },
            },
          }],
        });

        const glassValues = {
          pointer: [0, 0],
          time: 0,
          opacity: HERO_VISUAL.glassOpacity,
          refractionStrength: HERO_VISUAL.refractionStrength,
          ior: HERO_VISUAL.ior,
          fresnelStrength: HERO_VISUAL.fresnelStrength,
          rainbowIntensity: HERO_VISUAL.rainbowIntensity,
        };
        const cameraValues = { viewProjection: camera.viewProjection, position: cameraPosition };
        const initialModel = modelMatrix(HERO_VISUAL.crystalPosition, HERO_VISUAL.crystalRotation, HERO_VISUAL.crystalScale);

        const backGlass = draw(gpu, {
          shader: crystalShader,
          geometry: crystalGeometry,
          blend: 'alpha',
          cull: 'front',
          depth: { write: false, compare: 'less' },
          label: 'crystal-back-glass',
          set: { camera: cameraValues, model: { matrix: initialModel }, glass: glassValues },
        });
        const frontGlass = draw(gpu, {
          shader: crystalShader,
          geometry: crystalGeometry,
          blend: 'alpha',
          cull: 'back',
          depth: { write: false, compare: 'less' },
          label: 'crystal-front-glass',
          set: { camera: cameraValues, model: { matrix: initialModel }, glass: glassValues },
        });

        const isMobile = () => window.innerWidth <= 760;
        const crystalCentre = () => isMobile() ? [0.54, 0.57] : [0.62, 0.51];
        const opticalField = effect(gpu, opticalFieldShader, {
          label: 'optical-field',
          set: {
            params: {
              resolution: initialSize,
              crystalCenter: crystalCentre(),
              lightPosition: HERO_VISUAL.lightPosition,
              pointer: [0, 0],
              time: 0,
              lightWidth: HERO_VISUAL.lightWidth,
              lightIntensity: HERO_VISUAL.lightIntensity,
              dispersionStrength: HERO_VISUAL.dispersionStrength,
              rainbowIntensity: HERO_VISUAL.rainbowIntensity,
            },
          },
        });

        const sceneSampler = sampler(gpu, { minFilter: 'linear', magFilter: 'linear' });
        const present = effect(gpu, presentShader, {
          label: 'present-crystal-scene',
          set: {
            scene: sceneTarget,
            sceneSampler,
            glassLayer: glassTarget,
            params: { texel: sceneTarget.texelSize, bloomStrength: 0.72, vignetteStrength: 0.34 },
          },
        });

        canvasSurface.onResize(({ width, height }) => {
          if (!sceneTarget || !glassTarget) return;
          sceneTarget.resize([width, height]);
          glassTarget.resize([width, height]);
          camera.set({ aspect: width / height });
          opticalField.set({ params: { resolution: [width, height], crystalCenter: crystalCentre() } });
          present.set({ params: { texel: sceneTarget.texelSize } });
        });

        const time = clock(gpu);
        loop = frameLoop(gpu, (frame) => {
          if (!visible || !sceneTarget || !glassTarget) return;
          const motion = reduceMotion ? 0 : 1;
          const ease = reduceMotion ? 1 : 0.035;
          pointer.current.easedX += (pointer.current.x - pointer.current.easedX) * ease;
          pointer.current.easedY += (pointer.current.y - pointer.current.easedY) * ease;

          const t = time.time * HERO_VISUAL.animationSpeed * motion;
          const mobile = isMobile();
          const scaleFactor = mobile ? 0.72 : 1;
          const position: Vec3 = mobile ? [0, -0.24, 0] : HERO_VISUAL.crystalPosition;
          const scale = HERO_VISUAL.crystalScale.map((value) => value * scaleFactor) as unknown as Vec3;
          const rotation: Vec3 = [
            HERO_VISUAL.crystalRotation[0] + Math.sin(t * 0.72) * 0.018 - pointer.current.easedY * HERO_VISUAL.mouseInfluence,
            HERO_VISUAL.crystalRotation[1] + Math.sin(t) * 0.055 + pointer.current.easedX * HERO_VISUAL.mouseInfluence,
            HERO_VISUAL.crystalRotation[2] + Math.cos(t * 0.64) * 0.012,
          ];
          const matrix = modelMatrix(position, rotation, scale);
          const pointerValue = [pointer.current.easedX * motion, pointer.current.easedY * motion];

          backGlass.set({ model: { matrix }, glass: { time: time.time, pointer: pointerValue } });
          frontGlass.set({ model: { matrix }, glass: { time: time.time, pointer: pointerValue } });
          opticalField.set({ params: { time: time.time, pointer: pointerValue } });

          frame.pass({ target: sceneTarget, clear: HERO_VISUAL.backgroundColor }, opticalField);
          frame.pass({ target: glassTarget, clear: [0, 0, 0, 0], clearDepth: 1 }, (pass) => {
            pass.draw(backGlass);
            pass.draw(frontGlass);
          });
          frame.pass(canvasSurface, present);
        }, reduceMotion ? { fps: 12 } : undefined);

        setSceneState('ready');
      } catch (error) {
        console.error('[CrystalScene] WebGPU fallback enabled.', error);
        if (!disposed) setSceneState('fallback');
        loop?.stop();
        gpu?.dispose();
      }
    })();

    return () => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      loop?.stop();
      gpu?.dispose();
    };
  }, []);

  return (
    <div ref={hostRef} className="crystal-scene" data-state={sceneState} aria-hidden="true">
      <canvas ref={canvasRef} className="crystal-canvas" />
      <div className="crystal-fallback">
        <span className="fallback-beam" />
        <span className="fallback-spectrum" />
        <span className="fallback-glass" />
      </div>
    </div>
  );
}
