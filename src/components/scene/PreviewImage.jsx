import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function PreviewImage({ src, active, visible, order }) {
  const material = useRef();
  const texture = useTexture(src);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    texture.needsUpdate = true;
  }, [texture]);

  useFrame(() => {
    if (!material.current) return;
    const target = active && visible ? 0.78 : 0;
    material.current.opacity += (target - material.current.opacity) * 0.075;
  });

  return (
    <mesh position={[0, 0, -0.13 - order * 0.001]} renderOrder={order}>
      <planeGeometry args={[2.04, 1.22]} />
      <meshBasicMaterial ref={material} map={texture} transparent opacity={0} toneMapped={false} depthWrite={false} />
    </mesh>
  );
}
