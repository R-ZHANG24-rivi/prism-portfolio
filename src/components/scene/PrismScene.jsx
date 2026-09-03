import { Canvas, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { Suspense } from 'react';
import { VISUAL } from '../../config/visual';
import OpticalGlass from './OpticalGlass';

/** Three.js is retained only for the project-list image preview, never for the vgpu hero. */
function PreviewScene({ pointer, activeProject, previewVisible }) {
  const { viewport } = useThree();
  const mobile = viewport.width < 5.5;

  return (
    <>
      <ambientLight intensity={0.08} />
      <directionalLight position={[-4.2, 5.2, 5.8]} intensity={VISUAL.light.key} color="#f2fbff" />
      <pointLight position={[3.8, 1.3, -2.2]} intensity={VISUAL.light.rim} color="#8a4dff" />
      <pointLight position={[-2.4, 4.4, 1.2]} intensity={VISUAL.light.side} color="#72dcff" />
      <pointLight position={[-2.8, -3.4, 2.5]} intensity={VISUAL.light.fill} color="#ff7a45" />
      <OpticalGlass pointer={pointer} activeProject={activeProject} visible={previewVisible} />
      <Environment preset="studio" environmentIntensity={0.7} />
      <EffectComposer multisampling={0}>
        <Bloom intensity={mobile ? 0.24 : VISUAL.post.bloomIntensity} luminanceThreshold={VISUAL.post.luminanceThreshold} mipmapBlur />
      </EffectComposer>
    </>
  );
}

export default function PrismScene(props) {
  return (
    <div className="webgl-layer" aria-hidden="true">
      <Canvas dpr={[1, 1.55]} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }} camera={{ position: [0, 0, 7.2], fov: 36 }}>
        <Suspense fallback={null}><PreviewScene {...props} /></Suspense>
      </Canvas>
    </div>
  );
}
